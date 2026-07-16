import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PatientDto {
  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  facilityId?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  userId?: string;

  @ApiProperty({ type: String })
  mrn!: string;

  @ApiProperty({ type: String })
  fullName!: string;

  @ApiProperty({ type: String, format: 'date' })
  dateOfBirth!: string;

  @ApiPropertyOptional({ type: String, enum: ['male', 'female', 'other', 'unknown'] })
  gender?: 'male' | 'female' | 'other' | 'unknown';

  @ApiProperty({ type: String, enum: ['active', 'inactive', 'observation'] })
  status!: 'active' | 'inactive' | 'observation';

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  primaryProviderId?: string;

  @ApiProperty({ type: String, format: 'uuid' })
  fhirResourceId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  createdBy!: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  updatedBy?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  deletedAt?: string;

  @ApiProperty({ type: Number })
  version!: number;
}

export class PatientIdentifierDto {
  @ApiProperty({ type: String, format: 'uuid' })
  identifierId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({
    type: String,
    enum: ['mrn', 'national_id', 'passport', 'drivers_license', 'ssn', 'other'],
  })
  type!: string;

  @ApiProperty({ type: String })
  value!: string;

  @ApiPropertyOptional({ type: String })
  system?: string;

  @ApiProperty({ type: Boolean })
  isPrimary!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PatientContactDto {
  @ApiProperty({ type: String, format: 'uuid' })
  contactId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String, enum: ['phone', 'email', 'fax', 'other'] })
  type!: string;

  @ApiProperty({ type: String })
  value!: string;

  @ApiProperty({ type: Boolean })
  isPrimary!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PatientAddressDto {
  @ApiProperty({ type: String, format: 'uuid' })
  addressId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String, enum: ['home', 'work', 'mailing', 'temporary', 'other'] })
  type!: string;

  @ApiProperty({ type: String })
  street!: string;

  @ApiProperty({ type: String })
  city!: string;

  @ApiPropertyOptional({ type: String })
  state?: string;

  @ApiProperty({ type: String })
  postalCode!: string;

  @ApiProperty({ type: String })
  country!: string;

  @ApiProperty({ type: Boolean })
  isPrimary!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PatientEmergencyContactDto {
  @ApiProperty({ type: String, format: 'uuid' })
  emergencyContactId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  relationship!: string;

  @ApiProperty({ type: String })
  phone!: string;

  @ApiPropertyOptional({ type: String })
  email?: string;

  @ApiProperty({ type: Boolean })
  isPrimary!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PatientAllergyDto {
  @ApiProperty({ type: String, format: 'uuid' })
  allergyId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String })
  allergen!: string;

  @ApiProperty({ type: String, enum: ['drug', 'food', 'environmental', 'other'] })
  type!: string;

  @ApiProperty({ type: String, enum: ['mild', 'moderate', 'severe', 'life_threatening'] })
  severity!: string;

  @ApiPropertyOptional({ type: String })
  reaction?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  notedAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PatientPreferenceDto {
  @ApiProperty({ type: String, format: 'uuid' })
  preferenceId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ type: String, format: 'uuid' })
  patientId!: string;

  @ApiProperty({ type: String })
  language!: string;

  @ApiPropertyOptional({ type: String })
  maritalStatus?: string;

  @ApiPropertyOptional({ type: String })
  occupation?: string;

  @ApiPropertyOptional({ type: String })
  nationality?: string;

  @ApiPropertyOptional({ type: String })
  smoking?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  communication?: Record<string, unknown>;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}

export class PaginatedPatientsDto {
  @ApiProperty({ type: () => [PatientDto] })
  items!: PatientDto[];

  @ApiProperty({ type: Number })
  total!: number;

  @ApiProperty({ type: Number })
  page!: number;

  @ApiProperty({ type: Number })
  pageSize!: number;
}

export class ExportPatientsResultDto {
  @ApiProperty({ type: String, enum: ['csv', 'pdf', 'xlsx'] })
  format!: 'csv' | 'pdf' | 'xlsx';

  @ApiProperty({ type: String, format: 'date-time' })
  exportedAt!: string;

  @ApiProperty({ type: Number })
  recordCount!: number;
}

export class PatientMergeValidationResultDto {
  @ApiProperty({ type: Boolean })
  valid!: true;

  @ApiProperty({ type: () => PatientDto })
  sourcePatient!: PatientDto;

  @ApiProperty({ type: () => PatientDto })
  targetPatient!: PatientDto;
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: String, example: 'error' })
  status!: string;

  @ApiProperty({ type: Number })
  statusCode!: number;

  @ApiProperty({ type: String, description: 'Error message or validation errors' })
  message!: string | string[];

  @ApiProperty({ type: String })
  path!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  timestamp!: string;
}
