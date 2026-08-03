import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AdmissionFilters,
  TransferFilters,
} from '@medease/admissions-contract';

export class AdmissionFiltersDto implements AdmissionFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({
    enum: [
      'requested',
      'triaged',
      'bed_assigned',
      'admitted',
      'cancelled',
      'discharged',
    ],
  })
  @IsOptional()
  @IsIn([
    'requested',
    'triaged',
    'bed_assigned',
    'admitted',
    'cancelled',
    'discharged',
  ])
  status?: AdmissionFilters['status'];

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'emergency'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'emergency'])
  priority?: AdmissionFilters['priority'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ward?: string;

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
  pageSize?: number;
}

export class TransferFiltersDto implements TransferFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({
    enum: ['requested', 'approved', 'in_transit', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsIn(['requested', 'approved', 'in_transit', 'completed', 'cancelled'])
  status?: TransferFilters['status'];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  fromFacilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  toFacilityId?: string;

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
  pageSize?: number;
}
