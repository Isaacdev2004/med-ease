import {
  Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray, IsInt, IsOptional, IsString, IsUUID, Min, MinLength, ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcurementService } from './procurement.service';

const READ = ['procurement.read', 'inventory.procurement', 'inventory.read'] as const;
const WRITE = ['procurement.write', 'inventory.procurement', 'inventory.write'] as const;
const RECEIVE = ['inventory.receive', 'procurement.write', 'inventory.write'] as const;

class FiltersDto {
  @ApiPropertyOptional() @IsOptional() @IsString() q?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
}

class RfqLineBodyDto {
  @ApiProperty() @IsString() @MinLength(1) description!: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) quantity!: number;
  @ApiProperty() @IsString() unit!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specifications?: string;
}

class CreateRfqBodyDto {
  @ApiProperty() @IsString() @MinLength(1) title!: string;
  @ApiProperty() @IsString() department!: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() requisitionId?: string;
  @ApiProperty({ type: [String] }) @IsArray() invitedSuppliers!: string[];
  @ApiProperty({ type: [RfqLineBodyDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => RfqLineBodyDto) lineItems!: RfqLineBodyDto[];
  @ApiProperty() @IsString() deadline!: string;
}

class AwardBodyDto {
  @ApiProperty() @IsUUID() responseId!: string;
}

class ReceiveLineDto {
  @ApiProperty() @IsString() lineId!: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) receivedQty!: number;
}

class ReceiveGoodsBodyDto {
  @ApiProperty() @IsUUID() purchaseOrderId!: string;
  @ApiProperty() @IsUUID() warehouseId!: string;
  @ApiProperty() @IsString() receivedBy!: string;
  @ApiProperty({ type: [ReceiveLineDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => ReceiveLineDto) lineItems!: ReceiveLineDto[];
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

@ApiTags('procurement')
@ApiBearerAuth()
@Controller('procurement')
@UseGuards(JwtAuthGuard)
export class ProcurementController {
  constructor(@Inject(ProcurementService) private readonly service: ProcurementService) {}

  @Get('rfqs') @RequireAnyPermission([...READ]) @ApiOperation({ summary: 'Search RFQs' })
  searchRfqs(@Query() filters: FiltersDto) {
    return this.service.searchRfqs(filters);
  }

  @Post('rfqs') @RequireAnyPermission([...WRITE])
  createRfq(@Body() body: CreateRfqBodyDto) {
    return this.service.createRfq(body);
  }

  @Post('rfqs/:rfqId/award') @RequireAnyPermission([...WRITE]) @HttpCode(HttpStatus.OK) @ApiParam({ name: 'rfqId' })
  awardRfq(@Param('rfqId') rfqId: string, @Body() body: AwardBodyDto) {
    return this.service.awardRfq(rfqId, body.responseId);
  }

  @Get('goods-receipts') @RequireAnyPermission([...READ])
  searchReceipts(@Query() filters: FiltersDto) {
    return this.service.searchGoodsReceipts(filters);
  }

  @Post('goods-receipts') @RequireAnyPermission([...RECEIVE])
  createReceipt(@Body() body: ReceiveGoodsBodyDto) {
    return this.service.createGoodsReceipt(body);
  }
}
