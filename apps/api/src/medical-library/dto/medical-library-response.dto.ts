import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class MedicationDosageDto {
  @ApiProperty()
  population!: string;

  @ApiProperty()
  indication!: string;

  @ApiProperty()
  dose!: string;

  @ApiProperty()
  frequency!: string;

  @ApiPropertyOptional()
  maxDose?: string;

  @ApiPropertyOptional()
  notes?: string;
}

export class MedicationInteractionDto {
  @ApiProperty()
  drugName!: string;

  @ApiProperty()
  severity!: string;

  @ApiProperty()
  description!: string;
}

export class MedicationRecordDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiPropertyOptional()
  bdpmId?: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  brandName?: string;

  @ApiProperty()
  genericName!: string;

  @ApiProperty()
  strength!: string;

  @ApiProperty()
  dosageForm!: string;

  @ApiProperty()
  route!: string;

  @ApiProperty()
  atcCode!: string;

  @ApiProperty()
  therapeuticClass!: string;

  @ApiProperty()
  category!: string;

  @ApiPropertyOptional()
  manufacturer?: string;

  @ApiProperty()
  prescriptionRequired!: boolean;

  @ApiProperty()
  controlledSubstance!: boolean;

  @ApiProperty()
  pregnancySafety!: string;

  @ApiProperty()
  breastfeedingSafety!: string;

  @ApiProperty()
  pediatricApproved!: boolean;

  @ApiProperty()
  geriatricApproved!: boolean;

  @ApiProperty()
  available!: boolean;

  @ApiProperty()
  searchCount!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: [String] })
  activeIngredients!: string[];

  @ApiProperty({ type: [String] })
  indications!: string[];

  @ApiProperty({ type: [String] })
  contraindications!: string[];

  @ApiProperty({ type: [String] })
  warnings!: string[];

  @ApiProperty({ type: [String] })
  precautions!: string[];

  @ApiProperty({ type: [String] })
  sideEffects!: string[];

  @ApiProperty({ type: [String] })
  administration!: string[];

  @ApiProperty()
  storage!: string;

  @ApiProperty()
  patientInformation!: string;

  @ApiProperty()
  professionalInformation!: string;

  @ApiProperty({ type: [String] })
  references!: string[];

  @ApiProperty({ type: () => MedicationDosageDto, isArray: true })
  dosages!: MedicationDosageDto[];

  @ApiProperty({ type: () => MedicationInteractionDto, isArray: true })
  interactions!: MedicationInteractionDto[];

  @ApiProperty({ type: [String] })
  relatedMedicationIds!: string[];

  @ApiProperty()
  updatedAt!: string;
}

export class MedicationSearchFacetsDto {
  @ApiProperty({ type: [String] })
  categories!: string[];

  @ApiProperty({ type: [String] })
  therapeuticClasses!: string[];

  @ApiProperty({ type: [String] })
  manufacturers!: string[];

  @ApiProperty({ type: [String] })
  routes!: string[];
}

export class MedicationSearchResultDto {
  @ApiProperty({ type: () => MedicationRecordDto, isArray: true })
  items!: MedicationRecordDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty({ type: () => MedicationSearchFacetsDto })
  facets!: MedicationSearchFacetsDto;
}

export class MedicationCategoryInfoDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  count!: number;
}

export class MedicationLibraryStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  prescription!: number;

  @ApiProperty()
  overTheCounter!: number;

  @ApiProperty()
  categories!: number;

  @ApiProperty()
  favorites!: number;
}

export class ToggleFavoriteResponseDto {
  @ApiProperty()
  isFavorite!: boolean;
}
