import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class MedicationIdentityDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  genericName!: string;

  @ApiPropertyOptional()
  brandName?: string;

  @ApiProperty()
  strength!: string;

  @ApiProperty()
  medicationClass!: string;

  @ApiProperty()
  medicationType!: string;

  @ApiPropertyOptional()
  manufacturer?: string;

  @ApiProperty()
  controlledSubstance!: boolean;

  @ApiPropertyOptional({ format: 'uuid' })
  libraryMedicationId?: string;
}

export class PrescriptionDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  prescriptionNumber!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty({ type: () => MedicationIdentityDto })
  medication!: MedicationIdentityDto;

  @ApiProperty()
  dose!: string;

  @ApiProperty()
  frequency!: string;

  @ApiProperty()
  route!: string;

  @ApiProperty()
  durationDays!: number;

  @ApiProperty()
  startDate!: string;

  @ApiPropertyOptional()
  endDate?: string;

  @ApiProperty()
  validityDays!: number;

  @ApiProperty()
  expiresAt!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  refillCount!: number;

  @ApiProperty()
  refillsRemaining!: number;

  @ApiProperty()
  prescribingPhysician!: string;

  @ApiProperty({ format: 'uuid' })
  prescribingPhysicianId!: string;

  @ApiPropertyOptional()
  dispensingPharmacy?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  dispensingPharmacyId?: string;

  @ApiProperty()
  instructions!: string;

  @ApiProperty({ type: [String] })
  warnings!: string[];

  @ApiProperty({ type: [String] })
  contraindications!: string[];

  @ApiProperty()
  isRecurring!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PatientMedicationDto extends MedicationIdentityDto {
  @ApiProperty({ format: 'uuid' })
  prescriptionId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  dose!: string;

  @ApiProperty()
  frequency!: string;

  @ApiProperty()
  route!: string;

  @ApiProperty()
  startDate!: string;

  @ApiPropertyOptional()
  endDate?: string;

  @ApiPropertyOptional()
  remainingDays?: number;

  @ApiProperty()
  instructions!: string;

  @ApiProperty({ type: [String] })
  warnings!: string[];

  @ApiProperty({ type: [String] })
  contraindications!: string[];

  @ApiProperty({ type: [String] })
  sideEffects!: string[];

  @ApiPropertyOptional()
  storage?: string;

  @ApiProperty()
  prescribingPhysician!: string;

  @ApiPropertyOptional()
  dispensingPharmacy?: string;

  @ApiProperty()
  refillCount!: number;

  @ApiProperty()
  refillsRemaining!: number;

  @ApiProperty()
  adherencePercent!: number;

  @ApiPropertyOptional()
  condition?: string;
}

export class PaginatedMedicationsDto {
  @ApiProperty({ type: () => PatientMedicationDto, isArray: true })
  items!: PatientMedicationDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

export class ScheduledDoseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  medicationId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  medicationName!: string;

  @ApiProperty()
  scheduledAt!: string;

  @ApiProperty()
  slot!: string;

  @ApiProperty()
  dose!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  instructions?: string;
}

export class DoseLogDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  medicationId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  scheduledDoseId?: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  loggedAt!: string;

  @ApiPropertyOptional()
  notes?: string;
}

export class MedicationReminderDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  medicationId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  channel!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  dueAt!: string;

  @ApiProperty()
  active!: boolean;
}

export class RefillRequestDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  prescriptionId!: string;

  @ApiProperty({ format: 'uuid' })
  medicationId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  medicationName!: string;

  @ApiProperty({ format: 'uuid' })
  pharmacyId!: string;

  @ApiProperty()
  pharmacyName!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  requestedAt!: string;

  @ApiProperty()
  autoRefill!: boolean;
}

export class MedicationSearchResultDto {
  @ApiProperty({ type: () => PatientMedicationDto, isArray: true })
  medications!: PatientMedicationDto[];

  @ApiProperty({ type: () => PrescriptionDto, isArray: true })
  prescriptions!: PrescriptionDto[];
}
