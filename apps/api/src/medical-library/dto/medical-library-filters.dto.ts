import { Type, Transform } from 'class-transformer';
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

import { toOptionalBoolean } from '../../common/transforms/optional-boolean';

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
  @Transform(toOptionalBoolean)
  prescriptionRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
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
  @Transform(toOptionalBoolean)
  pediatric?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  geriatric?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  controlledSubstance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
  available?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(toOptionalBoolean)
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
