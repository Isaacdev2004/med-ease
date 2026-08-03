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

import type { CarePlanFilters } from '@medease/care-pathways-contract';

const CARE_PLAN_STATUSES = [
  'draft',
  'active',
  'on_hold',
  'completed',
  'cancelled',
  'archived',
  'suspended',
] as const;

const CARE_PLAN_TYPES = [
  'chronic_disease',
  'rehabilitation',
  'preventive',
  'post_operative',
  'home_care',
  'palliative',
  'goal_based',
  'collaborative',
  'shared',
] as const;

export class CarePlanFiltersDto implements CarePlanFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: CARE_PLAN_STATUSES })
  @IsOptional()
  @IsIn([...CARE_PLAN_STATUSES])
  status?: CarePlanFilters['status'];

  @ApiPropertyOptional({ enum: CARE_PLAN_TYPES })
  @IsOptional()
  @IsIn([...CARE_PLAN_TYPES])
  type?: CarePlanFilters['type'];

  @ApiPropertyOptional({ description: 'Pathway code slug' })
  @IsOptional()
  @IsString()
  pathwayId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  admissionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}

export class CareTaskQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  carePlanId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;
}
