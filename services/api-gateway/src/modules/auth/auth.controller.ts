import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientKafka) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string; role?: string }) {
    return firstValueFrom(this.authClient.send('auth.register', body));
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return firstValueFrom(this.authClient.send('auth.login', body));
  }

  @Post('refresh')
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return firstValueFrom(this.authClient.send('auth.refresh', body));
  }

  @Post('logout')
  logout(@Body() body: { userId: string }) {
    return firstValueFrom(this.authClient.send('auth.logout', body));
  }
}
