import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  register(@Payload() data: { email: string; password: string; name: string; role?: string }) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.login')
  login(@Payload() data: { email: string; password: string }) {
    return this.authService.login(data);
  }

  @MessagePattern('auth.refresh')
  refresh(@Payload() data: { userId: string; refreshToken: string }) {
    return this.authService.refresh(data);
  }

  @MessagePattern('auth.logout')
  logout(@Payload() data: { userId: string }) {
    return this.authService.logout(data);
  }

  @MessagePattern('auth.validate.token')
  validateToken(@Payload() data: { token: string }) {
    return this.authService.validateToken(data);
  }
}
