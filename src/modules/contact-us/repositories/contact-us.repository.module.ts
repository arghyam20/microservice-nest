import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUs } from '../schemas/contact-us.schema';
import { ContactUsRepository } from './contact-us.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ContactUs])],
  providers: [ContactUsRepository],
  exports: [ContactUsRepository],
})
export class ContactUsRepositoryModule {}
