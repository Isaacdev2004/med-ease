import { Type } from 'class-transformer';
import {
  IsArray,
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
  ApproveResultInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  LabOrderFilters,
  LabResultFilters,
  ReleaseResultInput,
  UploadObservationInput,
  UploadResultInput,
  VerifyResultInput,
} from '@medease/laboratory-contract';

const ORDER_STATUSES = [
  'draft',
  'pending',
  'scheduled',
  'collected',
  'in_progress',
  'completed',
  'cancelled',
  'rejected',
] as const;

const RESULT_STATUSES = [
  'pending',
  'processing',
  'verified',
  'released',
  'corrected',
  'amended',
  'cancelled',
  'rejected',
] as const;

const CATEGORIES = [
  'hematology',
  'biochemistry',
  'microbiology',
  'immunology',
  'virology',
  'pathology',
  'genetics',
  'endocrinology',
  'toxicology',
  'urinalysis',
  'coagulation',
  'blood_bank',
  'covid',
  'pregnancy',
  'custom',
] as const;

export class LabOrderFiltersDto implements LabOrderFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: ORDER_STATUSES })
  @IsOptional()
  @IsIn([...ORDER_STATUSES])
  status?: LabOrderFilters['status'];

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'stat'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'stat'])
  priority?: LabOrderFilters['priority'];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

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

export class LabResultFiltersDto implements LabResultFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: RESULT_STATUSES })
  @IsOptional()
  @IsIn([...RESULT_STATUSES])
  status?: LabResultFilters['status'];

  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn([...CATEGORIES])
  category?: LabResultFilters['category'];

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

export class SpecimenQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class CreateLabOrderBodyDto implements CreateLabOrderInput {
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

  @ApiProperty()
  @IsString()
  department!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  laboratoryId!: string;

  @ApiProperty()
  @IsString()
  laboratoryName!: string;

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'stat'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'stat'])
  priority?: CreateLabOrderInput['priority'];

  @ApiPropertyOptional({
    enum: ['in_clinic', 'home_collection', 'external_lab', 'referral'],
  })
  @IsOptional()
  @IsIn(['in_clinic', 'home_collection', 'external_lab', 'referral'])
  collectionMethod?: CreateLabOrderInput['collectionMethod'];

  @ApiProperty()
  @IsString()
  clinicalIndication!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  testIds!: string[];

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

export class CollectBodyDto implements Omit<CollectSpecimenInput, 'orderId'> {
  @ApiProperty()
  @IsString()
  collectedBy!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  temperature?: string;
}

export class UploadObservationBodyDto implements UploadObservationInput {
  @ApiProperty()
  @IsString()
  testId!: string;

  @ApiProperty()
  @IsString()
  value!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  numericValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interpretation?: string;
}

export class UploadResultBodyDto
  implements Omit<UploadResultInput, 'orderId'>
{
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  technologistId!: string;

  @ApiProperty()
  @IsString()
  technologistName!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ enum: CATEGORIES })
  @IsIn([...CATEGORIES])
  category!: UploadResultInput['category'];

  @ApiProperty({ type: () => UploadObservationBodyDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadObservationBodyDto)
  observations!: UploadObservationBodyDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}

export class VerifyBodyDto implements Omit<VerifyResultInput, 'reportId'> {
  @ApiProperty()
  @IsString()
  verifiedBy!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}

export class ApproveBodyDto implements Omit<ApproveResultInput, 'reportId'> {
  @ApiProperty()
  @IsString()
  approvedBy!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  digitalSignature?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}

export class ReleaseBodyDto implements Omit<ReleaseResultInput, 'reportId'> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class LabOrderDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  orderNumber!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  patientName!: string;
}

export class LabReportDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  reportNumber!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  title!: string;
}
