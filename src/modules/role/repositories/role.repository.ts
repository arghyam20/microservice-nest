import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseRepository } from 'src/common/bases/base.repository';
import { PaginationResponse } from 'src/common/types/api-response.type';
import { Role, RoleDocument } from '../schemas/role.schema';
import { RoleListingDto } from '../dto/role.dto';

@Injectable()
export class RoleRepository extends BaseRepository<RoleDocument> {
  constructor(@InjectRepository(Role) private model: Repository<RoleDocument>) {
    super(model);
  }

  async getAllPaginate(
    paginatedDto: RoleListingDto,
  ): Promise<PaginationResponse<RoleDocument>> {
    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;
    const sortField = paginatedDto.sortField || 'uuid';
    const sortOrder = paginatedDto.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const base: Record<string, any> = { isDeleted: false };

    if (paginatedDto.status) base.status = paginatedDto.status;
    if ('roleGroup' in paginatedDto && paginatedDto.roleGroup)
      base.roleGroup = paginatedDto.roleGroup;

    const searchFields = ['role', 'roleGroup', 'roleDisplayName'];
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
  ): Promise<RoleDocument[]> {
    return await this.getAll(params);
  }

  async findSettingCms(): Promise<RoleDocument | null> {
    return await this.model.findOne({ where: {} });
  }

  async getDetails(params: Record<string, any>): Promise<RoleDocument | null> {
    return await this.getByField(params);
  }
}
