import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppointmentPatientDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String })
  fullName!: string;

  @ApiProperty({ type: String })
  mrn!: string;
}

export class AppointmentProviderDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String })
  fullName!: string;

  @ApiProperty({ type: String })
  specialty!: string;

  @ApiProperty({ type: String })
  department!: string;
}

export class AppointmentFacilityDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  address!: string;
}

export class AppointmentDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: () => AppointmentPatientDto })
  patient!: AppointmentPatientDto;

  @ApiProperty({ type: () => AppointmentProviderDto })
  provider!: AppointmentProviderDto;

  @ApiProperty({ type: () => AppointmentFacilityDto })
  facility!: AppointmentFacilityDto;

  @ApiProperty({ type: String })
  department!: string;

  @ApiProperty({ type: String })
  specialty!: string;

  @ApiProperty({ type: String })
  room!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  scheduledAt!: string;

  @ApiProperty({ type: Number })
  durationMinutes!: number;

  @ApiProperty({
    type: String,
    enum: [
      'scheduled',
      'confirmed',
      'checked_in',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
    ],
  })
  status!:
    | 'scheduled'
    | 'confirmed'
    | 'checked_in'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';

  @ApiProperty({
    type: String,
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
  visitType!:
    | 'in_person'
    | 'telemedicine'
    | 'home_care'
    | 'laboratory'
    | 'radiology'
    | 'pharmacy'
    | 'follow_up';

  @ApiProperty({ type: String, enum: ['routine', 'urgent', 'emergency'] })
  priority!: 'routine' | 'urgent' | 'emergency';

  @ApiProperty({ type: String })
  insurance!: string;

  @ApiProperty({ type: String })
  reason!: string;

  @ApiPropertyOptional({ type: String })
  clinicalNotes?: string;

  @ApiProperty({ type: Boolean })
  followUpRequired!: boolean;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  referralId?: string;

  @ApiProperty({
    type: String,
    enum: ['not_checked_in', 'checked_in', 'in_waiting_room', 'with_provider'],
  })
  checkInStatus!:
    | 'not_checked_in'
    | 'checked_in'
    | 'in_waiting_room'
    | 'with_provider';

  @ApiPropertyOptional({ type: Number })
  queuePosition?: number;

  @ApiPropertyOptional({ type: String })
  telehealthLink?: string;

  @ApiProperty({ type: Boolean })
  isRecurring!: boolean;

  @ApiPropertyOptional({ type: String })
  recurringPattern?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PaginatedAppointmentsDto {
  @ApiProperty({ type: () => AppointmentDto, isArray: true })
  items!: AppointmentDto[];

  @ApiProperty({ type: Number })
  total!: number;

  @ApiProperty({ type: Number })
  page!: number;

  @ApiProperty({ type: Number })
  pageSize!: number;
}

export class QueueEntryDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  appointmentId!: string;

  @ApiProperty({ type: String })
  patientName!: string;

  @ApiProperty({ type: String })
  providerName!: string;

  @ApiProperty({ type: Number })
  position!: number;

  @ApiProperty({ type: Number })
  estimatedWaitMinutes!: number;

  @ApiProperty({
    type: String,
    enum: ['not_checked_in', 'checked_in', 'in_waiting_room', 'with_provider'],
  })
  checkInStatus!:
    | 'not_checked_in'
    | 'checked_in'
    | 'in_waiting_room'
    | 'with_provider';

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  checkedInAt?: string;
}

export class WaitlistEntryDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String })
  patientName!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  providerId!: string;

  @ApiProperty({ type: String })
  providerName!: string;

  @ApiProperty({ type: String })
  specialty!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  requestedDate!: string;

  @ApiProperty({ type: String, enum: ['routine', 'urgent', 'emergency'] })
  priority!: 'routine' | 'urgent' | 'emergency';

  @ApiProperty({ type: String, format: 'date-time' })
  addedAt!: string;

  @ApiProperty({ type: Number })
  position!: number;
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: String })
  message!: string;

  @ApiPropertyOptional({ type: String })
  code?: string;
}
