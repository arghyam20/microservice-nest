import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../modules/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { exists } from '../common/helpers/exists';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const tokens = this.getTokens(user.id, user.email, user.role?.name);
    await this.userService.updateRefreshToken(user.id, await this.hashToken(tokens.refreshToken));
    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = this.getTokens(user.id, user.email, user.role?.name);
    await this.userService.updateRefreshToken(user.id, await this.hashToken(tokens.refreshToken));
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const refreshMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.getTokens(user.id, user.email, user.role?.name);
    await this.userService.updateRefreshToken(user.id, await this.hashToken(tokens.refreshToken));
    return tokens;
  }

  async logout(userId: string) {
    await this.userService.removeRefreshToken(userId);
  }

  private getTokens(userId: string, email: string, roleName?: string) {
    const payload = { sub: userId, email, role: roleName };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    };
  }

  private async hashToken(token: string) {
    return bcrypt.hash(token, 10);
  }
}
