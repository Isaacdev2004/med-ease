import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  CreatePrescriptionInput,
  LogDoseInput,
  RefillRequestInput,
} from '@medease/medications-contract';

const ROUTES = [
  'oral',
  'topical',
  'injection',
  'inhalation',
  'sublingual',
  'other',
] as const;

const DOSE_STATUSES = [
  'taken',
  'skipped',
  'late',
  'partial',
  'vomited',
  'rescheduled',
] as const;

export class CreatePrescriptionBodyDto implements CreatePrescriptionInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsString()
  medicationName!: string;

  @ApiProperty()
  @IsString()
  genericName!: string;

  @ApiProperty()
  @IsString()
  strength!: string;

  @ApiProperty()
  @IsString()
  dose!: string;

  @ApiProperty()
  @IsString()
  frequency!: string;

  @ApiProperty({ enum: ROUTES })
  @IsIn([...ROUTES])
  route!: CreatePrescriptionInput['route'];

  @ApiProperty()
  @IsInt()
  @Min(1)
  durationDays!: number;

  @ApiProperty()
  @IsString()
  instructions!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  refillCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  controlledSubstance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicationClass?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicationType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prescribingPhysician?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  prescribingPhysicianId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dispensingPharmacy?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  dispensingPharmacyId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  warnings?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contraindications?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sideEffects?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scheduleTimes?: string[];
}

export class LogDoseBodyDto implements LogDoseInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  medicationId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  scheduledDoseId?: string;

  @ApiProperty({ enum: DOSE_STATUSES })
  @IsIn([...DOSE_STATUSES])
  status!: LogDoseInput['status'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RefillRequestBodyDto implements RefillRequestInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  prescriptionId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  pharmacyId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pharmacyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoRefill?: boolean;
}
