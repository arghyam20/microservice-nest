import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResult } from '../../common/interfaces/pagination.interface';
import { exists } from '../../common/helpers/exists';
import { KafkaService } from '../../kafka/kafka.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = createUserDto.roleName
      ? await this.roleService.create({ name: createUserDto.roleName })
      : undefined;

    const password = await bcrypt.hash(createUserDto.password, 10);
    const { roleName, ...data } = createUserDto;
    const user = this.userRepository.create({
      ...data,
      password,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    // Emit event to Kafka
    await this.kafkaService.emit('user.created', {
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role?.name,
    });

    return savedUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(id, { refreshToken });
  }

  async removeRefreshToken(id: string): Promise<void> {
    await this.userRepository.update(id, { refreshToken: undefined });
  }

  async findAll(pagination: PaginationDto): Promise<PaginationResult<User>> {
    const [data, totalItems] = await this.userRepository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { name: 'ASC' },
      relations: ['role'],
    });

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: pagination.limit,
        totalPages: Math.ceil(totalItems / pagination.limit),
        currentPage: pagination.page,
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    const { roleName, ...data } = updateUserDto;

    if (exists(data.password)) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (roleName) {
      user.role = await this.roleService.create({ name: roleName });
    }

    Object.assign(user, data);
    const updatedUser = await this.userRepository.save(user);

    // Emit event to Kafka
    await this.kafkaService.emit('user.updated', {
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role?.name,
    });

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await this.userRepository.delete(id);

    // Emit event to Kafka
    await this.kafkaService.emit('user.deleted', {
      userId: id,
      email: user.email,
    });
  }

  // Message pattern for microservice communication
  async handleUserCreated(data: any) {
    console.log('User created event received:', data);
    // Handle user created event from other services
  }

  async handleUserUpdated(data: any) {
    console.log('User updated event received:', data);
    // Handle user updated event from other services
  }

  async handleUserDeleted(data: any) {
    console.log('User deleted event received:', data);
    // Handle user deleted event from other services
  }
}
