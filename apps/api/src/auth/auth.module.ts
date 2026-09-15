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
import { InviteMailService } from './invite-mail.service';
import { InviteService } from './invite.service';
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
    InviteService,
    InviteMailService,
    SecurityEventService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: RefreshTokenStore,
      inject: [MedeaseConfigService],
      useFactory: (config: MedeaseConfigService) => {
        // Login stores refresh tokens in Redis — keep the client resilient so a
        // dropped Upstash connection does not permanently break /auth/login.
        const redis = new Redis(config.redis.url, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: false,
          retryStrategy: (times) => Math.min(times * 200, 5_000),
          reconnectOnError: (err) => {
            const message = err.message ?? '';
            return (
              message.includes('READONLY') ||
              message.includes('Connection is closed') ||
              message.includes('ECONNRESET')
            );
          },
        });
        redis.on('error', () => {
          // Prevent unhandled error events from crashing the process.
        });
        return new RefreshTokenStore(redis);
      },
    },
  ],
  exports: [AuthService, InviteService, JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
