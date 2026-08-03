import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  TriageAdmissionInput,
} from '@medease/admissions-contract';

export class CreateAdmissionBodyDto implements CreateAdmissionInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty()
  @IsString()
  facilityName!: string;

  @ApiProperty()
  @IsString()
  ward!: string;

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'emergency'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'emergency'])
  priority?: CreateAdmissionInput['priority'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class TriageAdmissionBodyDto implements TriageAdmissionInput {
  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'emergency'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'emergency'])
  priority?: TriageAdmissionInput['priority'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignAdmissionBedBodyDto implements AssignAdmissionBedInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  bedId!: string;

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

export class CreateTransferBodyDto implements CreateTransferInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  admissionId?: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  fromFacilityId!: string;

  @ApiProperty()
  @IsString()
  fromFacilityName!: string;

  @ApiProperty()
  @IsString()
  fromWard!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  fromBedId?: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  toFacilityId!: string;

  @ApiProperty()
  @IsString()
  toFacilityName!: string;

  @ApiProperty()
  @IsString()
  toWard!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  toBedId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteTransferBodyDto implements CompleteTransferInput {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  toBedId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
