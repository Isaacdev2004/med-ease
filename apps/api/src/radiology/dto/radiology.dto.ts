import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  ApproveReportInput,
  CompleteAcquisitionInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  Finding,
  Impression,
  Recommendation,
  ReportFilters,
  StudyFilters,
} from '@medease/radiology-contract';

const STUDY_STATUSES = [
  'scheduled',
  'in_progress',
  'completed',
  'pending_interpretation',
  'preliminary',
  'final',
  'amended',
  'cancelled',
] as const;

const REPORT_STATUSES = [
  'draft',
  'preliminary',
  'final',
  'amended',
  'cancelled',
] as const;

const MODALITIES = [
  'MRI',
  'CT',
  'X-Ray',
  'Ultrasound',
  'PET',
  'Mammography',
  'Fluoroscopy',
  'DEXA',
  'Dental',
  'Nuclear Medicine',
] as const;

const BODY_PARTS = [
  'head',
  'neck',
  'chest',
  'abdomen',
  'pelvis',
  'spine',
  'upper_extremity',
  'lower_extremity',
  'whole_body',
  'breast',
  'dental',
  'cardiac',
] as const;

export class StudyFiltersDto implements StudyFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: MODALITIES })
  @IsOptional()
  @IsIn([...MODALITIES])
  modality?: StudyFilters['modality'];

  @ApiPropertyOptional({ enum: BODY_PARTS })
  @IsOptional()
  @IsIn([...BODY_PARTS])
  bodyPart?: StudyFilters['bodyPart'];

  @ApiPropertyOptional({ enum: STUDY_STATUSES })
  @IsOptional()
  @IsIn([...STUDY_STATUSES])
  status?: StudyFilters['status'];

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'stat'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'stat'])
  priority?: StudyFilters['priority'];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  radiologistId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCritical?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}

export class ReportFiltersDto implements ReportFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: REPORT_STATUSES })
  @IsOptional()
  @IsIn([...REPORT_STATUSES])
  status?: ReportFilters['status'];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCritical?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}

export class CreateRadiologyOrderBodyDto implements CreateRadiologyOrderInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiProperty()
  @IsString()
  orderingPhysician!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderingPhysicianId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty()
  @IsString()
  facilityName!: string;

  @ApiProperty({ enum: MODALITIES })
  @IsIn([...MODALITIES])
  modality!: CreateRadiologyOrderInput['modality'];

  @ApiProperty({ enum: BODY_PARTS })
  @IsIn([...BODY_PARTS])
  bodyPart!: CreateRadiologyOrderInput['bodyPart'];

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'stat'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'stat'])
  priority?: CreateRadiologyOrderInput['priority'];

  @ApiProperty()
  @IsString()
  clinicalIndication!: string;

  @ApiProperty()
  @IsString()
  reason!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  carePlanId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CompleteAcquisitionBodyDto
  implements Omit<CompleteAcquisitionInput, 'studyId'>
{
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  imageCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  seriesCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiationDoseMsv?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceName?: string;
}

export class FindingBodyDto implements Finding {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({
    enum: ['normal', 'mild', 'moderate', 'severe', 'critical'],
  })
  @IsIn(['normal', 'mild', 'moderate', 'severe', 'critical'])
  severity!: Finding['severity'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bodyRegion?: string;
}

export class ImpressionBodyDto implements Impression {
  @ApiProperty()
  @IsString()
  summary!: string;

  @ApiProperty()
  @IsBoolean()
  critical!: boolean;
}

export class RecommendationBodyDto implements Recommendation {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  text!: string;

  @ApiProperty({ enum: ['routine', 'urgent'] })
  @IsIn(['routine', 'urgent'])
  priority!: Recommendation['priority'];

  @ApiPropertyOptional({ enum: MODALITIES })
  @IsOptional()
  @IsIn([...MODALITIES])
  followUpModality?: Recommendation['followUpModality'];
}

export class CompleteInterpretationBodyDto
  implements Omit<CompleteInterpretationInput, 'reportId'>
{
  @ApiProperty({ type: () => FindingBodyDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FindingBodyDto)
  findings!: FindingBodyDto[];

  @ApiProperty({ type: () => ImpressionBodyDto })
  @ValidateNested()
  @Type(() => ImpressionBodyDto)
  impression!: ImpressionBodyDto;

  @ApiPropertyOptional({ type: () => RecommendationBodyDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecommendationBodyDto)
  recommendations?: RecommendationBodyDto[];
}

export class ApproveReportBodyDto
  implements Omit<ApproveReportInput, 'reportId'>
{
  @ApiProperty()
  @IsString()
  radiologistId!: string;

  @ApiProperty()
  @IsString()
  radiologistName!: string;
}

export class DevicesQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class RadiologyStudyDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  accessionNumber!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  modality!: string;
}

export class RadiologyReportDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  accessionNumber!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  title!: string;
}
