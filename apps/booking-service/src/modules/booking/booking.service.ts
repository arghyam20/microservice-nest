import { Injectable } from '@nestjs/common';
import { BookingStatus } from '../../../../../libs/contracts/src';
import { PrismaService } from '../../../../../libs/prisma/src';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  initialStatus(): BookingStatus {
    return BookingStatus.PENDING;
  }
}
