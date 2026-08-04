import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AdjustStockBodyDto,
  ApiErrorResponseDto,
  CreateInventoryBodyDto,
  CreatePurchaseOrderBodyDto,
  DashboardQueryDto,
  InventoryFiltersDto,
  IssueStockBodyDto,
  MovementsQueryDto,
  ReceiveStockBodyDto,
  UpdateInventoryBodyDto,
  WarehousesQueryDto,
} from './dto/inventory.dto';
import { InventoryService } from './inventory.service';

const READ = ['inventory.read'] as const;
const WRITE = ['inventory.write'] as const;
const RECEIVE = ['inventory.receive', 'inventory.write'] as const;
const ISSUE = ['inventory.issue', 'inventory.write'] as const;
const PROCURE = [
  'inventory.procurement',
  'inventory.write',
  'procurement.read',
  'procurement.write',
] as const;

const ERRORS = {
  badRequest: {
    description: 'Validation failed',
    type: () => ApiErrorResponseDto,
  },
  unauthorized: {
    description: 'Authentication required',
    type: () => ApiErrorResponseDto,
  },
  forbidden: {
    description: 'Insufficient permissions',
    type: () => ApiErrorResponseDto,
  },
  notFound: {
    description: 'Resource not found',
    type: () => ApiErrorResponseDto,
  },
} as const;

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(
    @Inject(InventoryService)
    private readonly inventoryService: InventoryService,
  ) {}

  @Get('dashboard')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Inventory dashboard metrics' })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.inventoryService.getDashboard(
      query.facilityId,
      query.warehouseId,
      query.department,
    );
  }

  @Get('warehouses')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List warehouses' })
  getWarehouses(@Query() query: WarehousesQueryDto) {
    return this.inventoryService.getWarehouses(query.facilityId);
  }

  @Get('movements')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List stock movements' })
  getMovements(@Query() query: MovementsQueryDto) {
    const { inventoryId, ...filters } = query;
    return this.inventoryService.getMovements(inventoryId, filters);
  }

  @Get('items')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search inventory items (paginated)' })
  searchItems(@Query() filters: InventoryFiltersDto) {
    return this.inventoryService.searchItems(filters);
  }

  @Get('items/:inventoryId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'inventoryId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getItem(@Param('inventoryId') inventoryId: string) {
    return this.inventoryService.getItem(inventoryId);
  }

  @Post('items')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ description: 'Inventory item created' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  createItem(@Body() body: CreateInventoryBodyDto) {
    return this.inventoryService.createItem(body);
  }

  @Patch('items/:inventoryId')
  @RequireAnyPermission([...WRITE])
  @ApiParam({ name: 'inventoryId', format: 'uuid' })
  @ApiOkResponse({ description: 'Inventory item updated' })
  @ApiNotFoundResponse(ERRORS.notFound)
  updateItem(
    @Param('inventoryId') inventoryId: string,
    @Body() body: UpdateInventoryBodyDto,
  ) {
    return this.inventoryService.updateItem({ inventoryId, ...body });
  }

  @Post('items/:inventoryId/receive')
  @RequireAnyPermission([...RECEIVE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'inventoryId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  receiveStock(
    @Param('inventoryId') inventoryId: string,
    @Body() body: ReceiveStockBodyDto,
  ) {
    return this.inventoryService.receiveStock({ inventoryId, ...body });
  }

  @Post('items/:inventoryId/issue')
  @RequireAnyPermission([...ISSUE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'inventoryId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  issueStock(
    @Param('inventoryId') inventoryId: string,
    @Body() body: IssueStockBodyDto,
  ) {
    return this.inventoryService.issueStock({ inventoryId, ...body });
  }

  @Post('items/:inventoryId/adjust')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'inventoryId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  adjustStock(
    @Param('inventoryId') inventoryId: string,
    @Body() body: AdjustStockBodyDto,
  ) {
    return this.inventoryService.adjustStock({ inventoryId, ...body });
  }

  @Get('suppliers')
  @RequireAnyPermission([...READ, ...PROCURE])
  @ApiOperation({ summary: 'List suppliers' })
  getSuppliers() {
    return this.inventoryService.getSuppliers();
  }

  @Get('purchase-orders')
  @RequireAnyPermission([...READ, ...PROCURE])
  @ApiOperation({ summary: 'List purchase orders (paginated)' })
  getPurchaseOrders(@Query() filters: InventoryFiltersDto) {
    return this.inventoryService.getPurchaseOrders(filters);
  }

  @Post('purchase-orders')
  @RequireAnyPermission([...WRITE, ...PROCURE])
  @ApiCreatedResponse({ description: 'Purchase order created' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  createPurchaseOrder(@Body() body: CreatePurchaseOrderBodyDto) {
    return this.inventoryService.createPurchaseOrder(body);
  }

  @Post('purchase-orders/:purchaseOrderId/approve')
  @RequireAnyPermission([...WRITE, ...PROCURE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'purchaseOrderId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  approvePurchaseOrder(@Param('purchaseOrderId') purchaseOrderId: string) {
    return this.inventoryService.approvePurchaseOrder(purchaseOrderId);
  }

  @Post('purchase-orders/:purchaseOrderId/receive')
  @RequireAnyPermission([...RECEIVE, ...PROCURE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'purchaseOrderId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  receivePurchaseOrder(@Param('purchaseOrderId') purchaseOrderId: string) {
    return this.inventoryService.receivePurchaseOrder(purchaseOrderId);
  }
}
