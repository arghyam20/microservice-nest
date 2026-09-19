import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Role, RoleDocument } from '../role/schemas/role.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<UserDocument>,
    @InjectRepository(Role)
    private readonly roleModel: Repository<RoleDocument>,
  ) {}

  async seed() {
    this.logger.log('Starting seeding process...');
    await this.seedRoles();
    await this.seedAdminUser();
    this.logger.log('Seeding process completed.');
  }

  private async seedRoles() {
    this.logger.log('Seeding roles...');

    const rolesToSeed = [
      { role: 'admin', roleDisplayName: 'Admin', roleGroup: 'admin' },
      { role: 'user', roleDisplayName: 'User', roleGroup: 'user' },
    ];

    for (const roleData of rolesToSeed) {
      const existingRole = await this.roleModel.findOne({
        where: { role: roleData.role },
      });
      if (!existingRole) {
        await this.roleModel.save(this.roleModel.create(roleData));
        this.logger.log(`Created role: ${roleData.role}`);
      } else {
        this.logger.log(`Role ${roleData.role} already exists.`);
      }
    }
  }

  private async seedAdminUser() {
    this.logger.log('Seeding admin user...');

    const adminRole = await this.roleModel.findOne({
      where: { role: 'admin' },
    });
    if (!adminRole) {
      this.logger.error('Admin role not found! Cannot create admin user.');
      return;
    }

    const adminEmail = 'admin@example.com';
    const existingUser = await this.userModel.findOne({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      await this.userModel.save(
        this.userModel.create({
          firstName: 'Super',
          lastName: 'Admin',
          fullName: 'Super Admin',
          email: adminEmail,
          password: hashedPassword,
          roles: [adminRole.uuid as any],
          isAccountVerified: true,
          isProfileCompleted: true,
          status: 'Active',
        }),
      );
      this.logger.log(`Created admin user: ${adminEmail}`);
    } else {
      this.logger.log(`Admin user ${adminEmail} already exists.`);
    }
  }
}
