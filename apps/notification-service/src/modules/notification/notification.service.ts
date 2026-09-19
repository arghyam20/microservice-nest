import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma/src';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  deliveryIsAsync(): boolean {
    return true;
  }
}
