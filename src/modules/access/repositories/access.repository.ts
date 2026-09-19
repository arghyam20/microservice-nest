import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseRepository } from 'src/common/bases/base.repository';
import { PaginationResponse } from 'src/common/types/api-response.type';
import { Access, AccessDocument } from '../schemas/access.schema';
import { AccessListingDto } from '../dto/access.dto';

@Injectable()
export class AccessRepository extends BaseRepository<AccessDocument> {
  constructor(
    @InjectRepository(Access) private model: Repository<AccessDocument>,
  ) {
    super(model);
  }

  async getAllPaginate(
    paginatedDto: AccessListingDto,
  ): Promise<PaginationResponse<AccessDocument>> {
    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;
    const sortField = paginatedDto.sortField || 'uuid';
    const sortOrder = paginatedDto.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const base: Record<string, any> = { isDeleted: false };

    if (paginatedDto.status) base.status = paginatedDto.status;
    if ('parentId' in paginatedDto)
      base.parentId = paginatedDto.parentId || null;
    if ('impact' in paginatedDto && paginatedDto.impact !== undefined)
      base.impact = paginatedDto.impact;
    if ('required' in paginatedDto && paginatedDto.required !== undefined)
      base.required = paginatedDto.required;

    const searchFields = ['name', 'slug'];
    const where = paginatedDto.search
      ? searchFields.map((field) => ({
          ...base,
          [field]: Like(`%${paginatedDto.search}%`),
        }))
      : base;

    const [docs, totalDocs] = await this.model.findAndCount({
      where: where as any,
      skip,
      take: +limit,
      order: { [sortField]: sortOrder },
    });

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
      docs,
    };
  }

  async getAllCustom(
    params: Record<string, any> = {},
  ): Promise<AccessDocument[]> {
    return await this.getAll(params);
  }

  async findSettingCms(): Promise<AccessDocument | null> {
    return await this.model.findOne({ where: {} });
  }

  async getDetails(
    params: Record<string, any>,
  ): Promise<AccessDocument | null> {
    return await this.getByField(params);
  }
}
