import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.save(this.userRepo.create({ ...data, password }));
    const tokens = this.generateTokens(user.id, user.email, user.role);
    await this.userRepo.update(user.id, { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) });
    return tokens;
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepo.findOne({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = this.generateTokens(user.id, user.email, user.role);
    await this.userRepo.update(user.id, { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) });
    return tokens;
  }

  async refresh(data: { userId: string; refreshToken: string }) {
    const user = await this.userRepo.findOne({ where: { id: data.userId } });
    if (!user?.refreshToken || !(await bcrypt.compare(data.refreshToken, user.refreshToken))) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = this.generateTokens(user.id, user.email, user.role);
    await this.userRepo.update(user.id, { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) });
    return tokens;
  }

  async logout(data: { userId: string }) {
    await this.userRepo.update(data.userId, { refreshToken: undefined });
    return { success: true };
  }

  async validateToken(data: { token: string }) {
    try {
      return this.jwtService.verify(data.token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateTokens(userId: string, email: string, role?: string) {
    const payload = { sub: userId, email, role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    };
  }
}
