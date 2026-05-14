import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientKafka) {}

  @Post()
  create(@Body() body: any) { return firstValueFrom(this.userClient.send('user.create', body)); }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return firstValueFrom(this.userClient.send('user.list', { page: +page, limit: +limit }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return firstValueFrom(this.userClient.send('user.get', { userId: id })); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return firstValueFrom(this.userClient.send('user.update', { userId: id, ...body }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return firstValueFrom(this.userClient.send('user.delete', { userId: id })); }
}
