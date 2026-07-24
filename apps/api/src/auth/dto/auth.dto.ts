import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'doctor@medease.health' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'demo' })
  @IsString()
  @MinLength(1)
  password!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class AuthUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  organizationId!: string;

  @ApiProperty({ type: [String] })
  permissions!: string[];

  @ApiProperty()
  locale!: string;

  @ApiProperty()
  timezone!: string;

  @ApiPropertyOptional()
  lastLogin?: string;

  @ApiProperty()
  status!: string;
}

export class OrganizationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;
}

export class AuthSessionResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ description: 'Unix epoch milliseconds' })
  expiresAt!: number;

  @ApiPropertyOptional()
  rememberMe?: boolean;

  @ApiPropertyOptional({
    description: 'Refresh token for SPA clients when cookies are unavailable cross-origin',
  })
  refreshToken?: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;

  @ApiProperty({ type: AuthSessionResponseDto })
  session!: AuthSessionResponseDto;

  @ApiProperty({ type: OrganizationResponseDto })
  organization!: OrganizationResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  expiresAt!: number;

  @ApiPropertyOptional()
  refreshToken?: string;
}

export class RefreshTokenBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
