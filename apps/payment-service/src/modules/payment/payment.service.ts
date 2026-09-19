import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma/src';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  providerBoundary() {
    return {
      ownsProviderIntegration: true,
      idempotencyRequired: true,
    };
  }
}
