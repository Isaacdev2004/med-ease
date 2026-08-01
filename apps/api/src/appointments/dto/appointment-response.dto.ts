import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  Appointment,
  AppointmentListResult,
  QueueEntry,
  WaitlistEntry,
} from '@medease/appointments-contract';

export class AppointmentPatientDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  mrn!: string;
}

export class AppointmentProviderDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  specialty!: string;

  @ApiProperty()
  department!: string;
}

export class AppointmentFacilityDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  address!: string;
}

export class AppointmentDto implements Appointment {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => AppointmentPatientDto })
  patient!: AppointmentPatientDto;

  @ApiProperty({ type: () => AppointmentProviderDto })
  provider!: AppointmentProviderDto;

  @ApiProperty({ type: () => AppointmentFacilityDto })
  facility!: AppointmentFacilityDto;

  @ApiProperty()
  department!: string;

  @ApiProperty()
  specialty!: string;

  @ApiProperty()
  room!: string;

  @ApiProperty()
  scheduledAt!: string;

  @ApiProperty()
  durationMinutes!: number;

  @ApiProperty()
  status!: Appointment['status'];

  @ApiProperty()
  visitType!: Appointment['visitType'];

  @ApiProperty()
  priority!: Appointment['priority'];

  @ApiProperty()
  insurance!: string;

  @ApiProperty()
  reason!: string;

  @ApiPropertyOptional()
  clinicalNotes?: string;

  @ApiProperty()
  followUpRequired!: boolean;

  @ApiPropertyOptional()
  referralId?: string;

  @ApiProperty()
  checkInStatus!: Appointment['checkInStatus'];

  @ApiPropertyOptional()
  queuePosition?: number;

  @ApiPropertyOptional()
  telehealthLink?: string;

  @ApiProperty()
  isRecurring!: boolean;

  @ApiPropertyOptional()
  recurringPattern?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PaginatedAppointmentsDto implements AppointmentListResult {
  @ApiProperty({ type: () => AppointmentDto, isArray: true })
  items!: AppointmentDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

export class QueueEntryDto implements QueueEntry {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  appointmentId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  providerName!: string;

  @ApiProperty()
  position!: number;

  @ApiProperty()
  estimatedWaitMinutes!: number;

  @ApiProperty()
  checkInStatus!: QueueEntry['checkInStatus'];

  @ApiPropertyOptional()
  checkedInAt?: string;
}

export class WaitlistEntryDto implements WaitlistEntry {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty()
  providerName!: string;

  @ApiProperty()
  specialty!: string;

  @ApiProperty()
  requestedDate!: string;

  @ApiProperty()
  priority!: WaitlistEntry['priority'];

  @ApiProperty()
  addedAt!: string;

  @ApiProperty()
  position!: number;
}

export class ApiErrorResponseDto {
  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  code?: string;
}
