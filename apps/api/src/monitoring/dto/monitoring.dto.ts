import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AssignDeviceInput,
  CreateObservationInput,
  EnrollRPMInput,
  MonitoringFilters,
  UpdateObservationInput,
} from '@medease/monitoring-contract';

const OBSERVATION_CATEGORIES = [
  'vital-signs',
  'activity',
  'symptom',
  'survey',
  'device',
  'laboratory',
  'imaging',
  'medication-response',
] as const;

const VITAL_TYPES = [
  'blood_pressure',
  'heart_rate',
  'respiratory_rate',
  'temperature',
  'spo2',
  'blood_glucose',
  'weight',
  'bmi',
  'ecg_summary',
  'pain_score',
  'fall_risk',
] as const;

const CONTEXTS = [
  'home',
  'ward',
  'telemonitoring',
  'outpatient',
  'rpm',
] as const;

const ALERT_STATUSES = [
  'active',
  'acknowledged',
  'resolved',
  'dismissed',
] as const;

const ALERT_SEVERITIES = ['info', 'warning', 'critical', 'urgent'] as const;

const OBSERVATION_STATUSES = ['final', 'preliminary', 'amended'] as const;

export class MonitoringFiltersDto implements MonitoringFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: OBSERVATION_CATEGORIES })
  @IsOptional()
  @IsIn([...OBSERVATION_CATEGORIES])
  category?: MonitoringFilters['category'];

  @ApiPropertyOptional({ enum: VITAL_TYPES })
  @IsOptional()
  @IsIn([...VITAL_TYPES])
  metric?: MonitoringFilters['metric'];

  @ApiPropertyOptional({ enum: CONTEXTS })
  @IsOptional()
  @IsIn([...CONTEXTS])
  context?: MonitoringFilters['context'];

  @ApiPropertyOptional({ enum: ALERT_STATUSES })
  @IsOptional()
  @IsIn([...ALERT_STATUSES])
  status?: MonitoringFilters['status'];

  @ApiPropertyOptional({ enum: ALERT_SEVERITIES })
  @IsOptional()
  @IsIn([...ALERT_SEVERITIES])
  severity?: MonitoringFilters['severity'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to?: string;

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

export class DashboardQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class TimelineQueryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;
}

export class PatientQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class CreateObservationBodyDto implements CreateObservationInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ enum: OBSERVATION_CATEGORIES })
  @IsIn([...OBSERVATION_CATEGORIES])
  category!: CreateObservationInput['category'];

  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsString()
  display!: string;

  @ApiProperty({ oneOf: [{ type: 'number' }, { type: 'string' }] })
  @Allow()
  value!: number | string;

  @ApiProperty()
  @IsString()
  unit!: string;

  @ApiPropertyOptional({ enum: CONTEXTS })
  @IsOptional()
  @IsIn([...CONTEXTS])
  context?: CreateObservationInput['context'];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  deviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateObservationBodyDto
  implements Omit<UpdateObservationInput, 'id'>
{
  @ApiPropertyOptional({ oneOf: [{ type: 'number' }, { type: 'string' }] })
  @IsOptional()
  @Allow()
  value?: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: OBSERVATION_STATUSES })
  @IsOptional()
  @IsIn([...OBSERVATION_STATUSES])
  status?: UpdateObservationInput['status'];
}

export class AssignDeviceBodyDto implements AssignDeviceInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  deviceId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsString()
  assignedBy!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  programId?: string;
}

export class EnrollRPMBodyDto implements EnrollRPMInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: VITAL_TYPES, isArray: true })
  @IsArray()
  @IsIn([...VITAL_TYPES], { each: true })
  metrics!: EnrollRPMInput['metrics'];

  @ApiProperty()
  @IsString()
  frequency!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  clinicianId!: string;

  @ApiProperty()
  @IsString()
  clinicianName!: string;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deviceIds?: string[];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  carePlanId?: string;
}

export class ResolveAlertBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolvedBy?: string;
}

export class AcknowledgeAlertBodyDto {
  @ApiProperty()
  @IsString()
  by!: string;
}

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class ObservationDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  display!: string;

  @ApiProperty()
  category!: string;
}

export class MonitoringAlertDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  status!: string;
}
