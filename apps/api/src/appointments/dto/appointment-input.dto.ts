import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  BookAppointmentInput,
  CancelAppointmentInput,
  RescheduleAppointmentInput,
} from '@medease/appointments-contract';

export class BookAppointmentBodyDto implements BookAppointmentInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  providerId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty()
  @IsString()
  specialty!: string;

  @ApiProperty()
  @IsString()
  serviceType!: string;

  @ApiProperty()
  @IsISO8601()
  scheduledAt!: string;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @IsInt()
  @Min(5)
  durationMinutes?: number;

  @ApiProperty({
    enum: [
      'in_person',
      'telemedicine',
      'home_care',
      'laboratory',
      'radiology',
      'pharmacy',
      'follow_up',
    ],
  })
  @IsIn([
    'in_person',
    'telemedicine',
    'home_care',
    'laboratory',
    'radiology',
    'pharmacy',
    'follow_up',
  ])
  visitType!:
    | 'in_person'
    | 'telemedicine'
    | 'home_care'
    | 'laboratory'
    | 'radiology'
    | 'pharmacy'
    | 'follow_up';

  @ApiProperty()
  @IsString()
  reason!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerFullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerDepartment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facilityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facilityAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  room?: string;

  @ApiPropertyOptional({ enum: ['routine', 'urgent', 'emergency'] })
  @IsOptional()
  @IsIn(['routine', 'urgent', 'emergency'])
  priority?: 'routine' | 'urgent' | 'emergency';
}

export class RescheduleAppointmentBodyDto implements RescheduleAppointmentInput {
  @ApiProperty()
  @IsISO8601()
  scheduledAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CancelAppointmentBodyDto implements CancelAppointmentInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
