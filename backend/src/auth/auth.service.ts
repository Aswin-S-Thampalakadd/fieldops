import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshTokenHash(userId, null);

    return {
      success: true,
    };
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        role,
        type: 'access',
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '30d',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        role,
        type: 'refresh',
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.usersService.updateRefreshTokenHash(userId, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        role,
      },
    };
  }
}
