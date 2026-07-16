import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';

import { parseDurationToSeconds } from '@medease/auth';
import { PrismaModule } from '@medease/prisma';

import { MedeaseConfigModule } from '../config/config.module';
import { MedeaseConfigService } from '../config/config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenStore } from './refresh-token.store';
import { SecurityEventService } from './security-event.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    MedeaseConfigModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [MedeaseConfigModule],
      inject: [MedeaseConfigService],
      useFactory: (config: MedeaseConfigService) => ({
        secret: config.auth.jwtSecret,
        signOptions: {
          expiresIn: parseDurationToSeconds(config.auth.accessExpiry),
        },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60_000,
        limit: 20,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SecurityEventService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: RefreshTokenStore,
      inject: [MedeaseConfigService],
      useFactory: (config: MedeaseConfigService) => {
        const redis = new Redis(config.redis.url, {
          maxRetriesPerRequest: 1,
          lazyConnect: true,
        });
        return new RefreshTokenStore(redis);
      },
    },
  ],
  exports: [AuthService, JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
