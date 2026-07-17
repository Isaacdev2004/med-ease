import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  CreatePatientAllergyInput,
  CreatePatientEmergencyContactInput,
  CreatePatientIdentifierInput,
  CreatePatientInput,
  CreatePatientPreferenceInput,
  UpdatePatientInput,
} from '@medease/patients-contract';

export class CreatePatientIdentifierBodyDto implements CreatePatientIdentifierInput {
  @ApiProperty({
    enum: ['mrn', 'national_id', 'passport', 'drivers_license', 'ssn', 'other'],
  })
  @IsIn(['mrn', 'national_id', 'passport', 'drivers_license', 'ssn', 'other'])
  type!: CreatePatientIdentifierInput['type'];

  @ApiProperty()
  @IsString()
  value!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  system?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreatePatientContactBodyDto {
  @ApiProperty({ enum: ['phone', 'email', 'fax', 'other'] })
  @IsIn(['phone', 'email', 'fax', 'other'])
  type!: 'phone' | 'email' | 'fax' | 'other';

  @ApiProperty()
  @IsString()
  value!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreatePatientAddressBodyDto {
  @ApiPropertyOptional({
    enum: ['home', 'work', 'mailing', 'temporary', 'other'],
  })
  @IsOptional()
  @IsIn(['home', 'work', 'mailing', 'temporary', 'other'])
  type?: 'home' | 'work' | 'mailing' | 'temporary' | 'other';

  @ApiProperty()
  @IsString()
  street!: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty()
  @IsString()
  postalCode!: string;

  @ApiProperty()
  @IsString()
  country!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreatePatientEmergencyContactBodyDto implements CreatePatientEmergencyContactInput {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  relationship!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreatePatientAllergyBodyDto implements CreatePatientAllergyInput {
  @ApiProperty()
  @IsString()
  allergen!: string;

  @ApiProperty({ enum: ['drug', 'food', 'environmental', 'other'] })
  @IsIn(['drug', 'food', 'environmental', 'other'])
  type!: CreatePatientAllergyInput['type'];

  @ApiProperty({ enum: ['mild', 'moderate', 'severe', 'life_threatening'] })
  @IsIn(['mild', 'moderate', 'severe', 'life_threatening'])
  severity!: CreatePatientAllergyInput['severity'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reaction?: string;
}

export class CreatePatientPreferenceBodyDto implements CreatePatientPreferenceInput {
  @ApiPropertyOptional({ default: 'en-US' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smoking?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  communication?: Record<string, unknown>;
}

export class RegisterPatientBodyDto implements Omit<
  CreatePatientInput,
  'createdBy'
> {
  @ApiProperty()
  @IsString()
  mrn!: string;

  @ApiProperty()
  @IsString()
  fullName!: string;

  @ApiProperty({ format: 'date' })
  @IsString()
  dateOfBirth!: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other', 'unknown'] })
  @IsOptional()
  @IsIn(['male', 'female', 'other', 'unknown'])
  gender?: CreatePatientInput['gender'];

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'observation'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'observation'])
  status?: CreatePatientInput['status'];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  primaryProviderId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  fhirResourceId?: string;

  @ApiPropertyOptional({ type: [CreatePatientIdentifierBodyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientIdentifierBodyDto)
  identifiers?: CreatePatientIdentifierBodyDto[];

  @ApiPropertyOptional({ type: [CreatePatientContactBodyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientContactBodyDto)
  contacts?: CreatePatientContactBodyDto[];

  @ApiPropertyOptional({ type: [CreatePatientAddressBodyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientAddressBodyDto)
  addresses?: CreatePatientAddressBodyDto[];

  @ApiPropertyOptional({ type: [CreatePatientEmergencyContactBodyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientEmergencyContactBodyDto)
  emergencyContacts?: CreatePatientEmergencyContactBodyDto[];

  @ApiPropertyOptional({ type: [CreatePatientAllergyBodyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientAllergyBodyDto)
  allergies?: CreatePatientAllergyBodyDto[];

  @ApiPropertyOptional({ type: CreatePatientPreferenceBodyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePatientPreferenceBodyDto)
  preferences?: CreatePatientPreferenceBodyDto;
}

export class UpdatePatientBodyDto implements Omit<
  UpdatePatientInput,
  'updatedBy'
> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mrn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other', 'unknown'] })
  @IsOptional()
  @IsIn(['male', 'female', 'other', 'unknown'])
  gender?: UpdatePatientInput['gender'];

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'observation'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'observation'])
  status?: UpdatePatientInput['status'];

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  facilityId?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  primaryProviderId?: string | null;

  @ApiPropertyOptional({ description: 'Optimistic lock version' })
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;
}

export class ValidatePatientMergeBodyDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sourcePatientId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  targetPatientId!: string;
}
