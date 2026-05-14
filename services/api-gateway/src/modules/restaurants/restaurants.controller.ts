import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('restaurants')
@Controller({ version: '1' })
export class RestaurantsController {
  constructor(@Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientKafka) {}

  @Post('restaurants')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  createRestaurant(@Body() body: any) {
    return firstValueFrom(this.restaurantClient.send('restaurant.create', body));
  }

  @Get('restaurants')
  listRestaurants(@Query('page') page = 1, @Query('limit') limit = 10) {
    return firstValueFrom(this.restaurantClient.send('restaurant.list', { page: +page, limit: +limit }));
  }

  @Get('restaurants/:id')
  getRestaurant(@Param('id') id: string) {
    return firstValueFrom(this.restaurantClient.send('restaurant.get', { restaurantId: id }));
  }

  @Patch('restaurants/:id')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  updateRestaurant(@Param('id') id: string, @Body() body: any) {
    return firstValueFrom(this.restaurantClient.send('restaurant.update', { restaurantId: id, ...body }));
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  createCategory(@Body() body: any) {
    return firstValueFrom(this.restaurantClient.send('category.create', body));
  }

  @Get('categories')
  listCategories(@Query('page') page = 1, @Query('limit') limit = 10) {
    return firstValueFrom(this.restaurantClient.send('category.list', { page: +page, limit: +limit }));
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return firstValueFrom(this.restaurantClient.send('category.get', { categoryId: id }));
  }
}
