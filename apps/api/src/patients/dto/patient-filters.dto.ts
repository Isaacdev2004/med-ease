import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  PatientFilters,
  PatientSearchFilters,
} from '@medease/patients-contract';

export class PatientFiltersDto implements PatientFilters {
  @ApiPropertyOptional({
    description: 'Free-text search across name, MRN, identifiers, contacts',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'observation'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'observation'])
  status?: 'active' | 'inactive' | 'observation';

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  primaryProviderId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeArchived?: boolean;

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

export class PatientSearchQueryDto implements PatientSearchFilters {
  @ApiProperty({ description: 'Required search query' })
  @IsString()
  q!: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'observation'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'observation'])
  status?: 'active' | 'inactive' | 'observation';

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  primaryProviderId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeArchived?: boolean;

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

export class ExportPatientsQueryDto {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'observation'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'observation'])
  status?: 'active' | 'inactive' | 'observation';

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;
}

export class ExportPatientsBodyDto {
  @ApiProperty({ enum: ['csv', 'pdf', 'xlsx'] })
  @IsIn(['csv', 'pdf', 'xlsx'])
  format!: 'csv' | 'pdf' | 'xlsx';

  @ApiPropertyOptional({ type: ExportPatientsQueryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExportPatientsQueryDto)
  filters?: ExportPatientsQueryDto;
}

export class PatientIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;
}
