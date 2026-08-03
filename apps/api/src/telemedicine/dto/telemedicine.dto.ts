import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  TelemedicineFilters,
} from '@medease/telemedicine-contract';

const SESSION_STATUSES = [
  'scheduled',
  'waiting',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'failed',
] as const;

export class TelemedicineFiltersDto implements TelemedicineFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  clinicianId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ enum: SESSION_STATUSES })
  @IsOptional()
  @IsIn([...SESSION_STATUSES])
  status?: TelemedicineFilters['status'];

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

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  clinicianId?: string;
}

export class WaitingRoomQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  sessionId?: string;
}

export class RecordingsQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  sessionId?: string;
}

export class JoinSessionBodyDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  participantId!: string;
}

export class SendMessageBodyDto implements Omit<SendMessageInput, 'sessionId'> {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  senderId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  senderName!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiverId?: string;
}

export class SaveClinicalNoteBodyDto
  implements Omit<SaveClinicalNoteInput, 'sessionId'>
{
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  clinicianId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subjective?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assessment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  plan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followUp?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class TelemedicineSessionDto {
  @ApiProperty({ format: 'uuid' })
  sessionId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  status!: string;
}
