import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { REFRESH_COOKIE_NAME } from '@medease/auth';

import { Public } from '../authorization/decorators/require-permission.decorator';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponseDto,
  RefreshResponseDto,
  RefreshTokenBodyDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtAccessPayload } from '@medease/auth';

@ApiTags('auth')
@Controller('auth')
@Public()
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ auth: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or locked account',
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res, AuthService.extractMeta(req));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rotate refresh token and issue a new access token',
  })
  @ApiCookieAuth(REFRESH_COOKIE_NAME)
  @ApiOkResponse({ type: RefreshResponseDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RefreshTokenBodyDto,
  ) {
    const refreshToken = this.authService.resolveRefreshToken(
      req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined,
      body.refreshToken,
    );
    return this.authService.refresh(
      refreshToken,
      res,
      AuthService.extractMeta(req),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke the current session' })
  @ApiCookieAuth(REFRESH_COOKIE_NAME)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RefreshTokenBodyDto,
  ) {
    const refreshToken = this.authService.resolveRefreshToken(
      req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined,
      body.refreshToken,
    );
    await this.authService.logout(refreshToken, AuthService.extractMeta(req));
    this.authService.clearRefreshCookie(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the authenticated user profile' })
  @ApiOkResponse({ type: LoginResponseDto })
  async me(@CurrentUser() user: JwtAccessPayload) {
    return this.authService.getMe(user.sub);
  }
}
