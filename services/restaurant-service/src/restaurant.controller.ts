import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern('restaurant.create')
  createRestaurant(@Payload() data: any) { return this.restaurantService.createRestaurant(data); }

  @MessagePattern('restaurant.list')
  listRestaurants(@Payload() data: { page?: number; limit?: number }) {
    return this.restaurantService.findAllRestaurants(data.page, data.limit);
  }

  @MessagePattern('restaurant.get')
  getRestaurant(@Payload() data: { restaurantId: string }) {
    return this.restaurantService.findOneRestaurant(data.restaurantId);
  }

  @MessagePattern('restaurant.update')
  updateRestaurant(@Payload() data: { restaurantId: string; [key: string]: any }) {
    const { restaurantId, ...rest } = data;
    return this.restaurantService.updateRestaurant(restaurantId, rest);
  }

  @MessagePattern('category.create')
  createCategory(@Payload() data: any) { return this.restaurantService.createCategory(data); }

  @MessagePattern('category.list')
  listCategories(@Payload() data: { page?: number; limit?: number }) {
    return this.restaurantService.findAllCategories(data.page, data.limit);
  }

  @MessagePattern('category.get')
  getCategory(@Payload() data: { categoryId: string }) {
    return this.restaurantService.findOneCategory(data.categoryId);
  }
}
