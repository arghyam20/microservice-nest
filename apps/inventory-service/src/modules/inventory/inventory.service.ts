import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma/src';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  orm() {
    return {
      service: 'inventory-service',
      orm: 'prisma',
    };
  }
}
