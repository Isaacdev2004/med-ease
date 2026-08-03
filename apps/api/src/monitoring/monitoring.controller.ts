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
  AcknowledgeAlertBodyDto,
  ApiErrorResponseDto,
  AssignDeviceBodyDto,
  CreateObservationBodyDto,
  DashboardQueryDto,
  EnrollRPMBodyDto,
  MonitoringAlertDto,
  MonitoringFiltersDto,
  ObservationDto,
  PatientQueryDto,
  ResolveAlertBodyDto,
  TimelineQueryDto,
  UpdateObservationBodyDto,
} from './dto/monitoring.dto';
import { MonitoringService } from './monitoring.service';

const READ = ['monitoring.read', 'patients.read'] as const;
const WRITE = ['monitoring.write'] as const;
const ALERTS = ['monitoring.alerts', 'monitoring.write'] as const;
const DEVICES = ['monitoring.devices', 'monitoring.write'] as const;
const RPM = ['monitoring.rpm', 'monitoring.write'] as const;

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

@ApiTags('monitoring')
@ApiBearerAuth()
@Controller('monitoring')
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(
    @Inject(MonitoringService)
    private readonly monitoringService: MonitoringService,
  ) {}

  @Get('dashboard')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Get monitoring dashboard aggregates' })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.monitoringService.getDashboard(query.patientId);
  }

  @Get('vitals')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List vital signs (paginated)' })
  listVitals(@Query() filters: MonitoringFiltersDto) {
    return this.monitoringService.listVitals(filters);
  }

  @Get('observations')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search monitoring observations (paginated)' })
  listObservations(@Query() filters: MonitoringFiltersDto) {
    return this.monitoringService.listObservations(filters);
  }

  @Get('observations/all')
  @RequireAnyPermission([...READ])
  @ApiOkResponse({ type: () => ObservationDto, isArray: true })
  getAllObservations(@Query() filters: MonitoringFiltersDto) {
    return this.monitoringService.getAllObservations(filters);
  }

  @Get('observations/:observationId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'observationId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getObservation(@Param('observationId') observationId: string) {
    return this.monitoringService.getObservation(observationId);
  }

  @Post('observations')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ description: 'Observation created' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  createObservation(@Body() body: CreateObservationBodyDto) {
    return this.monitoringService.createObservation(body);
  }

  @Post('observations/:observationId/update')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'observationId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  updateObservation(
    @Param('observationId') observationId: string,
    @Body() body: UpdateObservationBodyDto,
  ) {
    return this.monitoringService.updateObservation({
      id: observationId,
      ...body,
    });
  }

  @Get('alerts')
  @RequireAnyPermission([...READ])
  @ApiOkResponse({ type: () => MonitoringAlertDto, isArray: false })
  listAlerts(@Query() filters: MonitoringFiltersDto) {
    return this.monitoringService.listAlerts(filters);
  }

  @Post('alerts/:alertId/resolve')
  @RequireAnyPermission([...ALERTS])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'alertId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  resolveAlert(
    @Param('alertId') alertId: string,
    @Body() body: ResolveAlertBodyDto,
  ) {
    return this.monitoringService.resolveAlert(alertId, body.resolvedBy);
  }

  @Post('alerts/:alertId/dismiss')
  @RequireAnyPermission([...ALERTS])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'alertId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  dismissAlert(@Param('alertId') alertId: string) {
    return this.monitoringService.dismissAlert(alertId);
  }

  @Post('alerts/:alertId/acknowledge')
  @RequireAnyPermission([...ALERTS])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'alertId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  acknowledgeAlert(
    @Param('alertId') alertId: string,
    @Body() body: AcknowledgeAlertBodyDto,
  ) {
    return this.monitoringService.acknowledgeAlert(alertId, body.by);
  }

  @Get('timeline')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Get observation timeline for a patient' })
  getTimeline(@Query() query: TimelineQueryDto) {
    return this.monitoringService.getTimeline(query.patientId);
  }

  @Get('devices')
  @RequireAnyPermission([...READ])
  listDevices(@Query() query: PatientQueryDto) {
    return this.monitoringService.listDevices(query.patientId);
  }

  @Get('devices/:deviceId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'deviceId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  getDevice(@Param('deviceId') deviceId: string) {
    return this.monitoringService.getDevice(deviceId);
  }

  @Post('devices/assign')
  @RequireAnyPermission([...DEVICES])
  @ApiCreatedResponse({ description: 'Device assigned' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  assignDevice(@Body() body: AssignDeviceBodyDto) {
    return this.monitoringService.assignDevice(body);
  }

  @Post('devices/:deviceId/sync')
  @RequireAnyPermission([...DEVICES])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'deviceId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  syncDevice(@Param('deviceId') deviceId: string) {
    return this.monitoringService.syncDevice(deviceId);
  }

  @Get('programs')
  @RequireAnyPermission([...READ])
  listPrograms(@Query() query: PatientQueryDto) {
    return this.monitoringService.listRPMPrograms(query.patientId);
  }

  @Post('programs')
  @RequireAnyPermission([...RPM])
  @ApiCreatedResponse({ description: 'RPM program enrolled' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  enrollRPM(@Body() body: EnrollRPMBodyDto) {
    return this.monitoringService.enrollRPM(body);
  }

  @Post('programs/:programId/remove')
  @RequireAnyPermission([...RPM])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'programId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  removeRPM(@Param('programId') programId: string) {
    return this.monitoringService.removeRPM(programId);
  }

  @Get('scores')
  @RequireAnyPermission([...READ])
  getScores(@Query() query: PatientQueryDto) {
    return this.monitoringService.getEarlyWarningScores(query.patientId);
  }
}
