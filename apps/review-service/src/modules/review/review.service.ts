import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma/src';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  requiresCompletedBooking(): boolean {
    return true;
  }
}
