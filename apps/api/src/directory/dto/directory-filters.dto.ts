import { Type, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import type { DirectoryFilters } from '@medease/directory-contract';

import { toOptionalBoolean } from '../../common/transforms/optional-boolean';

const PROVIDER_TYPES = [
  'professional',
  'facility',
  'pharmacy',
  'transport',
  'nursing_home',
  'medical_center',
  'all',
] as const;

const DIRECTORY_SORTS = [
  'relevance',
  'distance',
  'alphabetical',
  'availability',
  'updated',
] as const;

export class DirectoryFiltersDto implements DirectoryFilters {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: PROVIDER_TYPES })
  @IsOptional()
  @IsIn([...PROVIDER_TYPES])
  type?: DirectoryFilters['type'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  distanceMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  teleconsultation?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  emergency?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  openNow?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  favoritesOnly?: boolean;

  @ApiPropertyOptional({ enum: DIRECTORY_SORTS })
  @IsOptional()
  @IsIn([...DIRECTORY_SORTS])
  sort?: DirectoryFilters['sort'];

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

export class DirectorySuggestionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;
}
