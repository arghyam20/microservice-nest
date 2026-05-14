import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern('menu-item.create')
  create(@Payload() data: any) { return this.menuService.create(data); }

  @MessagePattern('menu-item.list')
  findAll(@Payload() data: { page?: number; limit?: number; restaurantId?: string }) {
    return this.menuService.findAll(data.page, data.limit, data.restaurantId);
  }

  @MessagePattern('menu-item.get')
  findOne(@Payload() data: { menuItemId: string }) { return this.menuService.findOne(data.menuItemId); }

  @MessagePattern('menu-item.update')
  update(@Payload() data: { menuItemId: string; [key: string]: any }) {
    const { menuItemId, ...rest } = data;
    return this.menuService.update(menuItemId, rest);
  }
}
