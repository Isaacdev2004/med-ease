import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
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
  ApiErrorResponseDto,
  ApproveBodyDto,
  CancelBodyDto,
  CollectBodyDto,
  CreateLabOrderBodyDto,
  LabOrderDto,
  LabOrderFiltersDto,
  LabReportDto,
  LabResultFiltersDto,
  ReleaseBodyDto,
  SpecimenQueryDto,
  UploadResultBodyDto,
  VerifyBodyDto,
} from './dto/laboratory.dto';
import { LaboratoryService } from './laboratory.service';

const READ = ['laboratory.read', 'patients.read'] as const;
const WRITE = ['laboratory.write'] as const;
const VERIFY = ['laboratory.verify', 'laboratory.write'] as const;
const APPROVE = ['laboratory.approve', 'laboratory.write'] as const;

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

@ApiTags('laboratory')
@ApiBearerAuth()
@Controller('laboratory')
@UseGuards(JwtAuthGuard)
export class LaboratoryController {
  constructor(
    @Inject(LaboratoryService)
    private readonly laboratoryService: LaboratoryService,
  ) {}

  @Get('orders')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search lab orders (paginated)' })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  searchOrders(@Query() filters: LabOrderFiltersDto) {
    return this.laboratoryService.searchOrders(filters);
  }

  @Get('orders/all')
  @RequireAnyPermission([...READ])
  @ApiOkResponse({ type: () => LabOrderDto, isArray: true })
  getAllOrders(@Query() filters: LabOrderFiltersDto) {
    return this.laboratoryService.getAllOrders(filters);
  }

  @Get('orders/:orderId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getOrder(@Param('orderId') orderId: string) {
    return this.laboratoryService.getOrder(orderId);
  }

  @Post('orders')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ type: () => LabOrderDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  createOrder(@Body() body: CreateLabOrderBodyDto) {
    return this.laboratoryService.createOrder(body);
  }

  @Post('orders/:orderId/cancel')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  cancelOrder(
    @Param('orderId') orderId: string,
    @Body() body: CancelBodyDto,
  ) {
    return this.laboratoryService.cancelOrder({
      orderId,
      reason: body.reason,
    });
  }

  @Post('orders/:orderId/collect')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  collect(
    @Param('orderId') orderId: string,
    @Body() body: CollectBodyDto,
  ) {
    return this.laboratoryService.collectSpecimen({
      orderId,
      collectedBy: body.collectedBy,
      temperature: body.temperature,
    });
  }

  @Post('orders/:orderId/results')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  uploadResult(
    @Param('orderId') orderId: string,
    @Body() body: UploadResultBodyDto,
  ) {
    return this.laboratoryService.uploadResult({ ...body, orderId });
  }

  @Get('results')
  @RequireAnyPermission([...READ])
  searchResults(@Query() filters: LabResultFiltersDto) {
    return this.laboratoryService.searchResults(filters);
  }

  @Get('results/all')
  @RequireAnyPermission([...READ])
  @ApiOkResponse({ type: () => LabReportDto, isArray: true })
  getAllResults(@Query() filters: LabResultFiltersDto) {
    return this.laboratoryService.getAllResults(filters);
  }

  @Get('results/pending')
  @RequireAnyPermission([...VERIFY])
  getPending(@Query() filters: LabResultFiltersDto) {
    return this.laboratoryService.getPendingResults(filters.patientId);
  }

  @Get('results/:reportId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'reportId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getResult(@Param('reportId') reportId: string) {
    return this.laboratoryService.getResult(reportId);
  }

  @Post('results/:reportId/verify')
  @RequireAnyPermission([...VERIFY])
  @HttpCode(HttpStatus.OK)
  verify(
    @Param('reportId') reportId: string,
    @Body() body: VerifyBodyDto,
  ) {
    return this.laboratoryService.verifyResult({
      reportId,
      verifiedBy: body.verifiedBy,
      comments: body.comments,
    });
  }

  @Post('results/:reportId/approve')
  @RequireAnyPermission([...APPROVE])
  @HttpCode(HttpStatus.OK)
  approve(
    @Param('reportId') reportId: string,
    @Body() body: ApproveBodyDto,
  ) {
    return this.laboratoryService.approveResult({
      reportId,
      approvedBy: body.approvedBy,
      digitalSignature: body.digitalSignature,
      comments: body.comments,
    });
  }

  @Post('results/:reportId/release')
  @RequireAnyPermission([...APPROVE])
  @HttpCode(HttpStatus.OK)
  release(
    @Param('reportId') reportId: string,
    @Body() body: ReleaseBodyDto,
  ) {
    return this.laboratoryService.releaseResult({
      reportId,
      comments: body.comments,
    });
  }

  @Get('specimens')
  @RequireAnyPermission([...READ])
  getSpecimens(@Query() query: SpecimenQueryDto) {
    return this.laboratoryService.getSpecimens(query.orderId, query.patientId);
  }

  @Get('catalog')
  @RequireAnyPermission([...READ])
  getCatalog() {
    return this.laboratoryService.getCatalog();
  }
}
