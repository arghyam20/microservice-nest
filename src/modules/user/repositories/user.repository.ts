import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { BaseRepository } from 'src/common/bases/base.repository';
import { User, UserDocument } from '../schemas/user.schema';
import { ListingFrontendUserDto, ListingUserDto } from '../dto/user.dto';
import { PaginationResponse } from 'src/common/types/api-response.type';
import { Role } from 'src/modules/role/schemas/role.schema';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectRepository(User) private model: Repository<UserDocument>,
    @InjectRepository(Role) private roleModel: Repository<Role>,
  ) {
    super(model);
  }

  async getUserDetailsJwtAuth(id: any): Promise<UserDocument | null> {
    return await this.getUserDetails({
      uuid: this.normalizeId(id),
      isDeleted: false,
      status: 'Active',
    });
  }

  async fineOneWithRole(
    params: Record<string, any>,
  ): Promise<UserDocument | null> {
    return await this.getUserDetails(params);
  }

  async getUserDetails(
    params: Record<string, any>,
  ): Promise<UserDocument | null> {
    const user = await this.getByField(params);
    if (!user) return null;
    return await this.attachRoles(user);
  }

  async getAllPaginateFrontend(
    paginatedDto: ListingFrontendUserDto,
  ): Promise<PaginationResponse<UserDocument>> {
    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;
    const base: Record<string, any> = { isDeleted: false };
    if (paginatedDto.status) base.status = paginatedDto.status;

    const search = paginatedDto.search;
    const where = search
      ? [
          { ...base, fullName: Like(`%${search}%`) },
          { ...base, email: Like(`%${search}%`) },
          { ...base, userName: Like(`%${search}%`) },
        ]
      : base;
    const [rows, totalDocs] = await this.model.findAndCount({
      where: where as any,
      skip,
      take: +limit,
      order: {
        [paginatedDto.sortField || 'uuid']:
          paginatedDto.sortOrder === 'asc' ? 'ASC' : 'DESC',
      },
    });
    const docs = await Promise.all(rows.map((row) => this.attachRoles(row)));
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page !== 1;
    const hasNextPage = totalDocs - (skip + docs.length) > 0;
    return {
      meta: {
        totalDocs,
        skip,
        page,
        totalPages,
        limit,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
      },
      docs,
    };
  }

  async getListing(paginatedDto: ListingUserDto): Promise<UserDocument[]> {
    const base: Record<string, any> = { isDeleted: false, status: 'Active' };

    const search = paginatedDto.search;
    const where = search
      ? [
          { ...base, fullName: Like(`%${search}%`) },
          { ...base, email: Like(`%${search}%`) },
          { ...base, phone: Like(`%${search}%`) },
        ]
      : base;
    return await this.model.find({
      where: where as any,
      take: 50,
      order: { uuid: 'DESC' },
    });
  }

  private async attachRoles(user: UserDocument): Promise<UserDocument> {
    const roleIds = Array.isArray(user.roles)
      ? user.roles.map((role: any) => this.normalizeId(role?.uuid || role))
      : [];
    const roles = roleIds.length
      ? await this.roleModel.find({ where: { uuid: In(roleIds) } })
      : [];
    return { ...user, roles } as UserDocument;
  }
}
