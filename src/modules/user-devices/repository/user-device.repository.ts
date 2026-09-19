import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDevice, UserDeviceDocument } from '../schemas/user-device.schema';
import { UserDeviceListingDto } from '../dto/user-devices.dto';
import { BaseRepository } from 'src/common/bases/base.repository';
import { PaginationResponse } from 'src/common/types/api-response.type';

@Injectable()
export class UserDeviceRepository extends BaseRepository<UserDeviceDocument> {
  constructor(
    @InjectRepository(UserDevice)
    private readonly model: Repository<UserDeviceDocument>,
  ) {
    super(model);
  }

  async getSubscriptionsByUserId(
    userId: any,
  ): Promise<{ endpoint: string; keys: { p256dh: string; auth: string } }[]> {
    type WebPush = {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };
    const devices = await this.model.find({
      where: {
        user_id: this.normalizeId(userId),
        isDeleted: false,
        isLoggedOut: false,
        expired: false,
      },
    });
    return devices
      .map((d) => d.webPush as WebPush)
      .filter(
        (
          wp,
        ): wp is { endpoint: string; keys: { p256dh: string; auth: string } } =>
          !!wp?.endpoint && !!wp?.keys?.p256dh && !!wp?.keys?.auth,
      )
      .map((wp) => ({
        endpoint: wp.endpoint,
        keys: { p256dh: wp.keys.p256dh, auth: wp.keys.auth },
      }));
  }

  async savePushSubscription(
    accessToken: string,
    subscription: Record<string, any>,
  ): Promise<void> {
    await this.model.update({ accessToken }, { webPush: subscription });
  }

  async getAllDevicesPaginated(
    paginatedDto: UserDeviceListingDto,
    token?: string,
  ): Promise<PaginationResponse<UserDeviceDocument>> {
    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;
    const [rows, totalDocs] = await this.model.findAndCount({
      where: {
        isDeleted: false,
        expired: false,
        user_id: this.normalizeId(paginatedDto.user_id),
      },
      skip,
      take: +limit,
      order: { uuid: 'DESC' },
    });
    const docs = rows.map((row) => ({
      ...row,
      isCurrent: row.accessToken === token,
    })) as any;
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
}
