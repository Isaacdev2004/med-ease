import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import type { MedicationFilters } from '@medease/medical-library-contract';
import { MEDICATION_CATEGORIES } from '@medease/medical-library-contract';

const CATEGORIES = [...MEDICATION_CATEGORIES, 'all'] as const;

const ROUTES = [
  'oral',
  'topical',
  'injection',
  'inhalation',
  'sublingual',
  'rectal',
  'ophthalmic',
  'intravenous',
] as const;

const SORTS = [
  'alphabetical',
  'most_searched',
  'updated',
  'therapeutic_class',
  'manufacturer',
] as const;

const PREGNANCY = [
  'safe',
  'caution',
  'contraindicated',
  'unknown',
] as const;

export class MedicationLibraryFiltersDto implements MedicationFilters {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn([...CATEGORIES])
  category?: MedicationFilters['category'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  therapeuticClass?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  atcCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  prescriptionRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  overTheCounter?: boolean;

  @ApiPropertyOptional({ enum: ROUTES })
  @IsOptional()
  @IsIn([...ROUTES])
  route?: MedicationFilters['route'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ enum: PREGNANCY })
  @IsOptional()
  @IsIn([...PREGNANCY])
  pregnancySafety?: MedicationFilters['pregnancySafety'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pediatric?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  geriatric?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  controlledSubstance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  available?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  favoritesOnly?: boolean;

  @ApiPropertyOptional({ enum: SORTS })
  @IsOptional()
  @IsIn([...SORTS])
  sort?: MedicationFilters['sort'];

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

export class MedicationSuggestionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;
}
