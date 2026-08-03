import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class AdmissionDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  patientMrn!: string;

  @ApiProperty({ format: 'uuid' })
  facilityId!: string;

  @ApiProperty()
  facilityName!: string;

  @ApiProperty()
  ward!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  bedId?: string;

  @ApiPropertyOptional()
  bedLabel?: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  priority!: string;

  @ApiProperty()
  requestedAt!: string;

  @ApiPropertyOptional()
  admittedAt?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PaginatedAdmissionsDto {
  @ApiProperty({ type: () => AdmissionDto, isArray: true })
  items!: AdmissionDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

export class AdmissionBoardSummaryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  facilityId?: string;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  admitted!: number;

  @ApiProperty()
  discharged!: number;

  @ApiProperty()
  cancelled!: number;

  @ApiProperty()
  urgent!: number;
}

export class AdmissionBoardDto {
  @ApiProperty({ type: () => AdmissionBoardSummaryDto })
  summary!: AdmissionBoardSummaryDto;

  @ApiProperty({ type: () => AdmissionDto, isArray: true })
  admissions!: AdmissionDto[];
}

export class PatientTransferDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  fromWard!: string;

  @ApiProperty()
  toWard!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  requestedAt!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PaginatedTransfersDto {
  @ApiProperty({ type: () => PatientTransferDto, isArray: true })
  items!: PatientTransferDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}
