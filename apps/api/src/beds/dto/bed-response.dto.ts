import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class BedDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  facilityId!: string;

  @ApiProperty()
  facilityName!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  ward!: string;

  @ApiProperty()
  roomLabel!: string;

  @ApiProperty()
  bedType!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  patientId?: string;

  @ApiPropertyOptional()
  patientName?: string;

  @ApiPropertyOptional()
  reservedUntil?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PaginatedBedsDto {
  @ApiProperty({ type: () => BedDto, isArray: true })
  items!: BedDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

export class BedBoardSummaryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  facilityId?: string;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  available!: number;

  @ApiProperty()
  occupied!: number;

  @ApiProperty()
  reserved!: number;

  @ApiProperty()
  cleaning!: number;

  @ApiProperty()
  maintenance!: number;

  @ApiProperty()
  blocked!: number;

  @ApiProperty()
  occupancyPercent!: number;
}

export class BedBoardDto {
  @ApiProperty({ type: () => BedBoardSummaryDto })
  summary!: BedBoardSummaryDto;

  @ApiProperty({ type: () => BedDto, isArray: true })
  beds!: BedDto[];
}

export class BedAssignmentDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  bedId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  assignedAt!: string;

  @ApiPropertyOptional()
  releasedAt?: string;

  @ApiPropertyOptional()
  notes?: string;
}
