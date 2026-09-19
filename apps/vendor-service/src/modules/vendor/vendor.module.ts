import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessStaff } from './entities/business-staff.entity';
import { Business } from './entities/business.entity';
import { VendorProfile } from './entities/vendor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorProfile, Business, BusinessStaff])],
})
export class VendorModule {}
