import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import type { IamFilters } from '@medease/iam-contract';

export class IamFiltersDto implements IamFilters {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 25, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}

export class IamSearchQueryDto {
  @IsString()
  q!: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;
}

export class IamExportDto {
  @IsIn(['csv', 'pdf', 'xlsx'])
  format!: 'csv' | 'pdf' | 'xlsx';
}

export class IamFavoriteDto {
  @IsUUID()
  userId!: string;

  @IsIn(['user', 'role', 'policy', 'session', 'client'])
  entityType!: 'user' | 'role' | 'policy' | 'session' | 'client';

  @IsString()
  entityId!: string;
}

export class IamFavoritesQueryDto {
  @IsUUID()
  userId!: string;
}
