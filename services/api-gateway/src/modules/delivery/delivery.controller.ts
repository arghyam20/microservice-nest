import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('delivery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'delivery', version: '1' })
export class DeliveryController {
  constructor(@Inject('DELIVERY_SERVICE') private readonly deliveryClient: ClientKafka) {}

  @Post()
  create(@Body() body: any) { return firstValueFrom(this.deliveryClient.send('delivery.create', body)); }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.deliveryClient.send('delivery.get', { deliveryId: id }));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return firstValueFrom(this.deliveryClient.send('delivery.update-status', { deliveryId: id, status: body.status }));
  }
}
