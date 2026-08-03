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
  ApproveReportBodyDto,
  CancelBodyDto,
  CompleteAcquisitionBodyDto,
  CompleteInterpretationBodyDto,
  CreateRadiologyOrderBodyDto,
  DevicesQueryDto,
  RadiologyReportDto,
  RadiologyStudyDto,
  ReportFiltersDto,
  StudyFiltersDto,
} from './dto/radiology.dto';
import { RadiologyService } from './radiology.service';

const READ = ['radiology.read', 'patients.read'] as const;
const WRITE = ['radiology.write'] as const;
const REPORT = ['radiology.report', 'radiology.write'] as const;

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

@ApiTags('radiology')
@ApiBearerAuth()
@Controller('radiology')
@UseGuards(JwtAuthGuard)
export class RadiologyController {
  constructor(
    @Inject(RadiologyService)
    private readonly radiologyService: RadiologyService,
  ) {}

  @Get('studies')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search radiology studies (paginated)' })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  searchStudies(@Query() filters: StudyFiltersDto) {
    return this.radiologyService.searchStudies(filters);
  }

  @Get('studies/all')
  @RequireAnyPermission([...READ])
  @ApiOkResponse({ type: () => RadiologyStudyDto, isArray: true })
  getAllStudies(@Query() filters: StudyFiltersDto) {
    return this.radiologyService.getAllStudies(filters);
  }

  @Get('studies/:studyId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'studyId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getStudy(@Param('studyId') studyId: string) {
    return this.radiologyService.getStudy(studyId);
  }

  @Post('studies/:studyId/acquire')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  completeAcquisition(
    @Param('studyId') studyId: string,
    @Body() body: CompleteAcquisitionBodyDto,
  ) {
    return this.radiologyService.completeAcquisition({
      studyId,
      ...body,
    });
  }

  @Post('studies/:studyId/archive')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  archiveStudy(@Param('studyId') studyId: string) {
    return this.radiologyService.archiveStudy(studyId);
  }

  @Post('orders')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ description: 'Radiology order created' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  createOrder(@Body() body: CreateRadiologyOrderBodyDto) {
    return this.radiologyService.createOrder(body);
  }

  @Post('orders/:orderId/cancel')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  cancelOrder(
    @Param('orderId') orderId: string,
    @Body() body: CancelBodyDto,
  ) {
    return this.radiologyService.cancelOrder({
      orderId,
      reason: body.reason,
    });
  }

  @Get('reports')
  @RequireAnyPermission([...READ])
  searchReports(@Query() filters: ReportFiltersDto) {
    return this.radiologyService.searchReports(filters);
  }

  @Get('reports/all')
  @RequireAnyPermission([...READ])
  @ApiOkResponse({ type: () => RadiologyReportDto, isArray: true })
  getAllReports(@Query() filters: ReportFiltersDto) {
    return this.radiologyService.getAllReports(filters);
  }

  @Get('reports/pending')
  @RequireAnyPermission([...REPORT])
  getPending(@Query() filters: ReportFiltersDto) {
    return this.radiologyService.getPendingReports(filters.patientId);
  }

  @Get('reports/critical')
  @RequireAnyPermission([...READ])
  getCritical(@Query() filters: ReportFiltersDto) {
    return this.radiologyService.getCriticalReports(filters.patientId);
  }

  @Get('reports/by-study/:studyId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'studyId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getReportByStudy(@Param('studyId') studyId: string) {
    return this.radiologyService.getReportByStudy(studyId);
  }

  @Get('reports/:reportId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'reportId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getReport(@Param('reportId') reportId: string) {
    return this.radiologyService.getReport(reportId);
  }

  @Post('reports/:reportId/interpret')
  @RequireAnyPermission([...REPORT])
  @HttpCode(HttpStatus.OK)
  completeInterpretation(
    @Param('reportId') reportId: string,
    @Body() body: CompleteInterpretationBodyDto,
  ) {
    return this.radiologyService.completeInterpretation({
      reportId,
      findings: body.findings,
      impression: body.impression,
      recommendations: body.recommendations,
    });
  }

  @Post('reports/:reportId/approve')
  @RequireAnyPermission([...REPORT])
  @HttpCode(HttpStatus.OK)
  approveReport(
    @Param('reportId') reportId: string,
    @Body() body: ApproveReportBodyDto,
  ) {
    return this.radiologyService.approveReport({
      reportId,
      radiologistId: body.radiologistId,
      radiologistName: body.radiologistName,
    });
  }

  @Get('devices')
  @RequireAnyPermission([...READ])
  getDevices(@Query() query: DevicesQueryDto) {
    return this.radiologyService.getDevices(query.facilityId);
  }

  @Get('radiologists')
  @RequireAnyPermission([...READ])
  getRadiologists() {
    return this.radiologyService.getRadiologists();
  }
}
