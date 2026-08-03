import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AssignTaskInput,
  CompleteStepInput,
  CompleteTaskInput,
  CreateCarePlanInput,
} from '@medease/care-pathways-contract';

const CARE_PLAN_TYPES = [
  'chronic_disease',
  'rehabilitation',
  'preventive',
  'post_operative',
  'home_care',
  'palliative',
  'goal_based',
  'collaborative',
  'shared',
] as const;

export class CreateCarePlanBodyDto implements CreateCarePlanInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: CARE_PLAN_TYPES })
  @IsIn([...CARE_PLAN_TYPES])
  type!: CreateCarePlanInput['type'];

  @ApiPropertyOptional({ description: 'Pathway code slug (e.g. diabetes)' })
  @IsOptional()
  @IsString()
  pathwayId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  admissionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryDiagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedPhysician?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  assignedPhysicianId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facilityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activate?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteTaskBodyDto implements CompleteTaskInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  taskId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  completionNotes?: string;
}

export class AssignTaskBodyDto implements AssignTaskInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  taskId!: string;

  @ApiProperty()
  @IsString()
  owner!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class CompleteStepBodyDto implements CompleteStepInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class NotesBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
