import { Controller, Get, Inject } from '@nestjs/common';

export const SERVICE_NAME = 'SERVICE_NAME';

@Controller('health')
export class HealthController {
  constructor(@Inject(SERVICE_NAME) private readonly serviceName: string) {}

  @Get()
  check() {
    return {
      service: this.serviceName,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
