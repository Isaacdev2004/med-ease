import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class ClinicalPathwayDto {
  @ApiProperty({ description: 'Pathway code slug' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  definitionId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  completionCriteria!: string;

  @ApiProperty()
  active!: boolean;
}

export class CarePlanDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  pathwayId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  admissionId?: string;

  @ApiProperty()
  progressPercent!: number;

  @ApiProperty()
  completionPercent!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class CarePlanStepDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  carePlanId!: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  status!: string;
}

export class CareTaskDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  carePlanId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  dueDate!: string;
}

export class PaginatedCarePlansDto {
  @ApiProperty({ type: () => CarePlanDto, isArray: true })
  items!: CarePlanDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

export class CarePlanBoardSummaryDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  active!: number;

  @ApiProperty()
  averageProgress!: number;
}

export class CarePlanBoardDto {
  @ApiProperty({ type: () => CarePlanBoardSummaryDto })
  summary!: CarePlanBoardSummaryDto;

  @ApiProperty({ type: () => CarePlanDto, isArray: true })
  plans!: CarePlanDto[];
}
