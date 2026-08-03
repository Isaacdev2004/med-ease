import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  BillingFilters,
  CreateInvoiceInput,
  RecordPaymentInput,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@medease/billing-contract';

const INVOICE_STATUSES = [
  'draft',
  'issued',
  'partial',
  'paid',
  'overdue',
  'cancelled',
  'written_off',
] as const;

const PAYMENT_METHODS = [
  'cash',
  'card',
  'bank_transfer',
  'insurance',
  'wallet',
  'stripe',
  'paystack',
  'flutterwave',
  'mobile_money',
] as const;

const LINE_CATEGORIES = [
  'consultation',
  'laboratory',
  'radiology',
  'medication',
  'monitoring',
  'telemedicine',
  'procedure',
  'other',
] as const;

const CURRENCIES = ['EUR', 'USD', 'GBP', 'NGN', 'XOF'] as const;

export class ApiErrorResponseDto {
  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  code?: string;
}

export class BillingFiltersDto implements BillingFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

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
  providerId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;
}

export class InsuranceQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class OutstandingQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class LineItemBodyDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @ApiProperty({ enum: LINE_CATEGORIES })
  @IsIn([...LINE_CATEGORIES])
  category!: (typeof LINE_CATEGORIES)[number];
}

export class CreateInvoiceBodyDto implements CreateInvoiceInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  patientName!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  facilityName!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  providerId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  providerName!: string;

  @ApiProperty({ type: [LineItemBodyDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemBodyDto)
  lineItems!: LineItemBodyDto[];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  insuranceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: CURRENCIES })
  @IsOptional()
  @IsIn([...CURRENCIES])
  currency?: (typeof CURRENCIES)[number];
}

export class UpdateInvoiceBodyDto implements Omit<UpdateInvoiceInput, 'invoiceId'> {
  @ApiPropertyOptional({ type: [LineItemBodyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemBodyDto)
  lineItems?: LineItemBodyDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: INVOICE_STATUSES })
  @IsOptional()
  @IsIn([...INVOICE_STATUSES])
  status?: (typeof INVOICE_STATUSES)[number];
}

export class SubmitClaimBodyDto implements SubmitClaimInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  patientName!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  payer!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  policyNumber!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  diagnosisCodes!: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  procedureCodes!: string[];

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalClaim!: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  providerId!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  laboratoryOrders?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  radiologyOrders?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  deductible?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  copay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  coinsurance?: number;

  @ApiPropertyOptional({ enum: CURRENCIES })
  @IsOptional()
  @IsIn([...CURRENCIES])
  currency?: (typeof CURRENCIES)[number];
}

export class ApproveClaimBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  approvedAmount?: number;
}

export class DenyClaimBodyDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  reason!: string;
}

export class RecordPaymentBodyDto implements RecordPaymentInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  invoiceId!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: PAYMENT_METHODS })
  @IsIn([...PAYMENT_METHODS])
  method!: (typeof PAYMENT_METHODS)[number];

  @ApiPropertyOptional({ enum: CURRENCIES })
  @IsOptional()
  @IsIn([...CURRENCIES])
  currency?: (typeof CURRENCIES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  installmentNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  totalInstallments?: number;
}

export class RefundPaymentBodyDto implements RefundPaymentInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  paymentId!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  reason!: string;
}

export class PatientInvoiceDto {
  @ApiProperty({ format: 'uuid' })
  invoiceId!: string;

  @ApiProperty()
  invoiceNumber!: string;

  @ApiProperty()
  status!: string;
}

export class InsuranceClaimDto {
  @ApiProperty({ format: 'uuid' })
  claimId!: string;

  @ApiProperty()
  status!: string;
}

export class PaymentDto {
  @ApiProperty({ format: 'uuid' })
  paymentId!: string;

  @ApiProperty()
  amount!: number;
}
