import {
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AssignBedInput,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';

export class CreateBedBodyDto implements CreateBedInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty()
  @IsString()
  facilityName!: string;

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty()
  @IsString()
  ward!: string;

  @ApiProperty()
  @IsString()
  roomLabel!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bedType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignBedBodyDto implements AssignBedInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReserveBedBodyDto implements ReserveBedInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  reservedUntil?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBedStatusBodyDto implements UpdateBedStatusInput {
  @ApiProperty({
    enum: ['available', 'reserved', 'cleaning', 'maintenance', 'blocked'],
  })
  @IsIn(['available', 'reserved', 'cleaning', 'maintenance', 'blocked'])
  status!: UpdateBedStatusInput['status'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReleaseBedBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
