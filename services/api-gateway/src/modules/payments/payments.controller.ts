import { Body, Controller, Get, Inject, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(@Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientKafka) {}

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return firstValueFrom(this.paymentClient.send('payment.create', { userId: req.user.sub, ...body }));
  }

  @Get()
  findAll() { return firstValueFrom(this.paymentClient.send('payment.list', {})); }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.paymentClient.send('payment.get', { paymentId: id }));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; transactionId?: string }) {
    return firstValueFrom(this.paymentClient.send('payment.update-status', { paymentId: id, ...body }));
  }
}
