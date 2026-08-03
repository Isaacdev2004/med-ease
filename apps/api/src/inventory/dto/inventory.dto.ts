import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  AdjustStockInput,
  CreateInventoryInput,
  InventoryFilters,
  IssueStockInput,
  ReceiveStockInput,
  UpdateInventoryInput,
} from '@medease/inventory-contract';

const CATEGORIES = [
  'medication',
  'reagent',
  'consumable',
  'equipment',
  'supplies',
  'vaccine',
  'controlled',
  'asset',
  'otc',
  'narcotic',
] as const;

const DEPARTMENTS = [
  'pharmacy',
  'laboratory',
  'radiology',
  'icu',
  'surgery',
  'general',
  'biomedical',
  'warehouse',
] as const;

const STATUSES = [
  'active',
  'low_stock',
  'out_of_stock',
  'expired',
  'recalled',
  'inactive',
] as const;

export class ApiErrorResponseDto {
  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  code?: string;
}

export class InventoryFiltersDto implements InventoryFilters {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ enum: DEPARTMENTS })
  @IsOptional()
  @IsIn(DEPARTMENTS)
  department?: (typeof DEPARTMENTS)[number];

  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

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
  facilityId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ enum: DEPARTMENTS })
  @IsOptional()
  @IsIn(DEPARTMENTS)
  department?: (typeof DEPARTMENTS)[number];
}

export class WarehousesQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;
}

export class MovementsQueryDto extends InventoryFiltersDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  inventoryId?: string;
}

export class CreateInventoryBodyDto implements CreateInventoryInput {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  facilityId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  warehouseId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  sku!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  itemName!: string;

  @ApiProperty({ enum: CATEGORIES })
  @IsIn(CATEGORIES)
  category!: (typeof CATEGORIES)[number];

  @ApiProperty({ enum: DEPARTMENTS })
  @IsIn(DEPARTMENTS)
  department!: (typeof DEPARTMENTS)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityOnHand?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reorderLevel?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reorderQuantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sellingPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shelfLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  coldChain?: boolean;
}

export class UpdateInventoryBodyDto
  implements Omit<UpdateInventoryInput, 'inventoryId'>
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  itemName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reorderLevel?: number;

  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shelfLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityOnHand?: number;
}

export class ReceiveStockBodyDto implements Omit<ReceiveStockInput, 'inventoryId'> {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  performedBy?: string;
}

export class IssueStockBodyDto implements Omit<IssueStockInput, 'inventoryId'> {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  performedBy?: string;
}

export class AdjustStockBodyDto implements Omit<AdjustStockInput, 'inventoryId'> {
  @ApiProperty({ description: 'Absolute on-hand quantity after adjustment' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  performedBy?: string;
}
