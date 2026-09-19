import { Module } from '@nestjs/common';
import { ContactUsAdminController } from './contact-us.admin.controller';
import { ContactUsAdminService } from './contact-us.admin.service';

@Module({
  imports: [],
  controllers: [ContactUsAdminController],
  providers: [ContactUsAdminService],
  exports: [ContactUsAdminService],
})
export class ContactUsModule {}
