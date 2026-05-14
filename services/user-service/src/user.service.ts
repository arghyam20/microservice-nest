import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async create(data: { email: string; name: string; password: string; role?: string }): Promise<User> {
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.save(this.userRepo.create({ ...data, password }));
    this.kafka.emit('user.created', { userId: user.id, email: user.email, role: user.role });
    return user;
  }

  async findAll(page = 1, limit = 10) {
    const [data, totalItems] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return { data, meta: { totalItems, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(totalItems / limit) } };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    Object.assign(user, data);
    const saved = await this.userRepo.save(user);
    this.kafka.emit('user.updated', { userId: saved.id, email: saved.email });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.delete(id);
    this.kafka.emit('user.deleted', { userId: id, email: user.email });
  }
}
