import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
  InviteUserInput,
  PolicyEffect,
  RevokeSessionInput,
  ShareIamInput,
  StartBreakGlassInput,
} from '@medease/iam-contract';

export class CreateUserDto implements CreateUserInput {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  displayName!: string;

  @ApiProperty()
  @IsUUID()
  tenantId!: string;

  @ApiProperty()
  @IsUUID()
  organizationId!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  roleIds!: string[];
}

export class InviteUserDto implements InviteUserInput {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsUUID()
  tenantId!: string;

  @ApiProperty()
  @IsUUID()
  organizationId!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  roleIds!: string[];
}

export class AssignRoleDto implements AssignRoleInput {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsString()
  roleId!: string;
}

export class CreatePolicyDto implements CreatePolicyInput {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ enum: ['allow', 'deny'] })
  @IsIn(['allow', 'deny'])
  effect!: PolicyEffect;

  @ApiProperty()
  @IsString()
  resource!: string;

  @ApiProperty()
  @IsString()
  action!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}

export class RevokeSessionDto implements RevokeSessionInput {
  @ApiProperty()
  @IsUUID()
  sessionId!: string;
}

export class MfaUserDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;
}

export class CreateOAuthClientDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsUUID()
  tenantId!: string;
}

export class RotateApiKeyDto {
  @ApiProperty()
  @IsUUID()
  keyId!: string;
}

export class GrantConsentDto implements GrantConsentInput {
  @ApiProperty()
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsUUID()
  granteeId!: string;

  @ApiProperty()
  @IsString()
  purpose!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expiresAt?: string;
}

export class DelegateAccessDto implements DelegateAccessInput {
  @ApiProperty()
  @IsUUID()
  delegatorId!: string;

  @ApiProperty()
  @IsUUID()
  delegateId!: string;

  @ApiProperty()
  @IsString()
  scope!: string;

  @ApiProperty()
  @IsString()
  endsAt!: string;
}

export class StartBreakGlassDto implements StartBreakGlassInput {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiProperty()
  @IsString()
  reason!: string;
}

export class EndBreakGlassDto implements EndBreakGlassInput {
  @ApiProperty()
  @IsUUID()
  eventId!: string;
}

export class ShareIamDto implements ShareIamInput {
  @ApiProperty({ enum: ['user', 'role', 'policy', 'session', 'client'] })
  @IsIn(['user', 'role', 'policy', 'session', 'client'])
  entityType!: ShareIamInput['entityType'];

  @ApiProperty()
  @IsString()
  entityId!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  recipientIds!: string[];
}

export class IamScopeQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
