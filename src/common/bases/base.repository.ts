import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';

type WriteResult = { affected?: number | null; modifiedCount: number };

export class BaseRepository<T extends { uuid?: string; id?: number }> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async getAll(params: Record<string, any>): Promise<T[]> {
    return await this.repository.find({ where: this.toWhere(params) });
  }

  async getAllByField(params: Record<string, any>): Promise<T[]> {
    return await this.getAll(params);
  }

  async getByField(params: Record<string, any>): Promise<T | null> {
    return await this.repository.findOne({ where: this.toWhere(params) });
  }

  async getById(id: any): Promise<T | null> {
    return await this.repository.findOne({
      where: this.toWhere({ uuid: this.normalizeId(id) }),
    });
  }

  async getCountByParam(params: Record<string, any>): Promise<number> {
    return await this.repository.count({ where: this.toWhere(params) });
  }

  async save(body: any): Promise<T | null> {
    const entity = this.repository.create(this.prepareWrite(body));
    return (await this.repository.save(entity as any)) as T;
  }

  async updateById(data: any, id: any): Promise<T | null> {
    const prepared = this.prepareWrite(data);
    await this.repository.update({ uuid: this.normalizeId(id) }, prepared);
    return await this.getById(id);
  }

  async getDistinctDocument(
    field: string,
    params: Record<string, any>,
  ): Promise<unknown[]> {
    const rows = await this.repository
      .createQueryBuilder('entity')
      .select(`DISTINCT entity.${field}`, field)
      .where(this.toWhere(params) as any)
      .getRawMany();

    return rows.map((row) => row[field]);
  }

  async getAllByFieldWithProjection(
    params: Record<string, any>,
    projection: Record<string, any>,
  ): Promise<T[]> {
    return await this.repository.find({
      where: this.toWhere(params),
      select: this.toSelect(projection),
    } as FindManyOptions<T>);
  }

  async getByFieldWithProjection(
    params: Record<string, any>,
    projection: Record<string, any>,
  ): Promise<T | null> {
    return await this.repository.findOne({
      where: this.toWhere(params),
      select: this.toSelect(projection),
    } as FindManyOptions<T>);
  }

  async delete(id: any): Promise<T | null> {
    const data = await this.getById(id);
    if (!data) return null;
    await this.repository.delete({ uuid: this.normalizeId(id) });
    return data;
  }

  async bulkDelete(params: Record<string, any>): Promise<WriteResult> {
    const result = await this.repository.delete(this.toWhere(params));
    return { ...result, modifiedCount: result.affected || 0 };
  }

  async updateByField(
    data: any,
    param: Record<string, any>,
  ): Promise<WriteResult> {
    const result = await this.repository.update(
      this.toWhere(param),
      this.prepareWrite(data),
    );
    return { ...result, modifiedCount: result.affected || 0 };
  }

  async updateAllByParams(data: any, params: Record<string, any>) {
    const result = await this.repository.update(
      this.toWhere(params),
      this.prepareWrite(data),
    );
    return { ...result, modifiedCount: result.affected || 0 };
  }

  async bulkDeleteSoft(ids: any[]): Promise<WriteResult> {
    const result = await this.repository.update(
      { uuid: In(ids.map((id) => this.normalizeId(id))) } as any,
      { isDeleted: true } as any,
    );
    return { ...result, modifiedCount: result.affected || 0 };
  }

  async saveOrUpdate(data: any, id: any = undefined): Promise<T | null> {
    const existing = id ? await this.getById(id) : null;
    if (existing) return await this.updateById(data, id);
    return await this.save(data);
  }

  protected normalizeId(value: any): any {
    if (value && typeof value.toHexString === 'function')
      return value.toHexString();
    if (value && typeof value.toString === 'function') return value.toString();
    return value;
  }

  protected prepareWrite(data: any): any {
    const prepared = { ...data };
    delete prepared.$set;
    for (const key of Object.keys(prepared)) {
      prepared[key] = Array.isArray(prepared[key])
        ? prepared[key].map((item) => this.normalizeId(item))
        : this.normalizeId(prepared[key]);
    }
    return prepared;
  }

  protected toWhere(
    params: Record<string, any>,
  ): FindOptionsWhere<T>[] | FindOptionsWhere<T> {
    if (!params || !Object.keys(params).length) return {};
    if (params.$and) {
      return params.$and.reduce(
        (merged: Record<string, any>, item: Record<string, any>) => ({
          ...merged,
          ...this.toWhere(item),
        }),
        {},
      ) as FindOptionsWhere<T>;
    }
    if (params.$or) {
      return params.$or.map((item: Record<string, any>) => this.toWhere(item));
    }

    const where: Record<string, any> = {};
    for (const [key, rawValue] of Object.entries(params)) {
      const column = key;
      where[column] = this.toOperator(rawValue);
    }
    return where as FindOptionsWhere<T>;
  }

  private toOperator(value: any): any {
    if (value instanceof RegExp) return Like(`%${value.source}%`);
    if (value === null) return IsNull();
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('$eq' in value) return this.normalizeId(value.$eq) ?? IsNull();
      if ('$in' in value)
        return In(value.$in.map((item: any) => this.normalizeId(item)));
      if ('$nin' in value) return Not(In(value.$nin));
      if ('$ne' in value) return Not(this.normalizeId(value.$ne));
      if ('$regex' in value) return Like(`%${value.$regex}%`);
    }
    return this.normalizeId(value);
  }

  private toSelect(projection: Record<string, any>): Record<string, boolean> {
    return Object.entries(projection || {}).reduce(
      (select, [key, value]) => ({ ...select, [key]: !!value }),
      {},
    );
  }
}
