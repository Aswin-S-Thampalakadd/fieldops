import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const result = await this.authService.login(dto);

    this.setAuthCookies(response, result);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;

    const result = await this.authService.refresh(
      request.user.id,
      refreshToken,
    );

    this.setAuthCookies(response, result);

    return {
      user: result.user,
    };
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true })
    response: Response,
  ) {
    await this.authService.logout(request.user.id);

    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return {
      success: true,
    };
  }

  private setAuthCookies(
    response: Response,
    result: {
      accessToken: string;
      refreshToken: string;
    },
  ) {
    const secure = process.env.NODE_ENV === 'production';

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
