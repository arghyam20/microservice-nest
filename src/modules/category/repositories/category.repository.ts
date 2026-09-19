import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseRepository } from 'src/common/bases/base.repository';
import { PaginationResponse } from 'src/common/types/api-response.type';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CategoryListingDto } from '../dto/category.dto';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectRepository(Category) private model: Repository<CategoryDocument>,
  ) {
    super(model);
  }

  async getAllPaginate(
    paginatedDto: CategoryListingDto,
  ): Promise<PaginationResponse<CategoryDocument>> {
    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;
    const base: Record<string, any> = {
      isDeleted: false,
      parentId: paginatedDto.parentId || null,
    };
    if (paginatedDto.status) base.status = paginatedDto.status;
    const where = paginatedDto.search
      ? [{ ...base, name: Like(`%${paginatedDto.search}%`) }]
      : base;
    const [docs, totalDocs] = await this.model.findAndCount({
      where: where as any,
      skip,
      take: +limit,
      order: {
        [paginatedDto.sortField || 'uuid']:
          paginatedDto.sortOrder === 'asc' ? 'ASC' : 'DESC',
      },
    });
    const docsWithFlags = await Promise.all(
      docs.map(
        async (doc) =>
          ({
            ...doc,
            hasChild: await this.model.exists({
              where: {
                parentId: doc.uuid,
                isDeleted: false,
                status: 'Active',
              } as any,
            }),
          }) as any,
      ),
    );
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page !== 1;
    const hasNextPage = totalDocs - (skip + docs.length) > 0;
    return {
      meta: {
        totalDocs,
        skip,
        page,
        limit,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
      },
      docs: docsWithFlags,
    };
  }

  async getAllCustom(
    params: Record<string, any>,
    userId?: string,
    assignFilter: boolean | null = null,
  ): Promise<CategoryDocument[]> {
    return await this.getAll(params);
  }
  async getCategoriesWithActiveForms(
    params: Record<string, any>,
  ): Promise<CategoryDocument[]> {
    return await this.getAll(params);
  }
}
