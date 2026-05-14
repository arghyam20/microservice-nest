import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.create')
  create(@Payload() data: { email: string; name: string; password: string; role?: string }) {
    return this.userService.create(data);
  }

  @MessagePattern('user.list')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.userService.findAll(data.page, data.limit);
  }

  @MessagePattern('user.get')
  findOne(@Payload() data: { userId: string }) {
    return this.userService.findOne(data.userId);
  }

  @MessagePattern('user.update')
  update(@Payload() data: { userId: string; [key: string]: any }) {
    const { userId, ...rest } = data;
    return this.userService.update(userId, rest);
  }

  @MessagePattern('user.delete')
  remove(@Payload() data: { userId: string }) {
    return this.userService.remove(data.userId);
  }
}
