import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('menu-items')
@Controller({ path: 'menu-items', version: '1' })
export class MenuController {
  constructor(@Inject('MENU_SERVICE') private readonly menuClient: ClientKafka) {}

  @Post()
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  create(@Body() body: any) { return firstValueFrom(this.menuClient.send('menu-item.create', body)); }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('restaurantId') restaurantId?: string) {
    return firstValueFrom(this.menuClient.send('menu-item.list', { page: +page, limit: +limit, restaurantId }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return firstValueFrom(this.menuClient.send('menu-item.get', { menuItemId: id })); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: string, @Body() body: any) {
    return firstValueFrom(this.menuClient.send('menu-item.update', { menuItemId: id, ...body }));
  }
}
