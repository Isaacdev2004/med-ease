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

import type { MedicationFilters } from '@medease/medications-contract';

export class MedicationFiltersDto implements MedicationFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({
    enum: ['active', 'completed', 'paused', 'cancelled', 'future'],
  })
  @IsOptional()
  @IsIn(['active', 'completed', 'paused', 'cancelled', 'future'])
  status?: MedicationFilters['status'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  physician?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pharmacy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condition?: string;

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
