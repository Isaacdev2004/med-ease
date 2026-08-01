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

import {
  RequireAnyPermission,
} from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentFiltersDto } from './dto/appointment-filters.dto';
import {
  BookAppointmentBodyDto,
  CancelAppointmentBodyDto,
  RescheduleAppointmentBodyDto,
} from './dto/appointment-input.dto';
import {
  ApiErrorResponseDto,
  AppointmentDto,
  PaginatedAppointmentsDto,
  QueueEntryDto,
  WaitlistEntryDto,
} from './dto/appointment-response.dto';
import { AppointmentsService } from './appointments.service';

const APPOINTMENT_READ_PERMISSIONS = [
  'appointments.manage',
  'patients.read',
] as const;

const APPOINTMENT_WRITE_PERMISSIONS = [
  'appointments.manage',
  'patients.write',
] as const;

const APPOINTMENT_ERRORS = {
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
    description: 'Appointment not found',
    type: () => ApiErrorResponseDto,
  },
} as const;

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsService)
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Search appointments (paginated)' })
  @ApiOkResponse({
    description: 'Paginated appointment list',
    type: () => PaginatedAppointmentsDto,
  })
  @ApiBadRequestResponse(APPOINTMENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  search(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.search(filters);
  }

  @Get('all')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List all appointments matching filters' })
  @ApiOkResponse({ type: () => AppointmentDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getAll(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.getAll(filters);
  }

  @Get('upcoming')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List upcoming appointments' })
  @ApiOkResponse({ type: () => AppointmentDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getUpcoming(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.getUpcoming(filters);
  }

  @Get('past')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List past appointments' })
  @ApiOkResponse({ type: () => AppointmentDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getPast(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.getPast(filters);
  }

  @Get('today')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List today appointments' })
  @ApiOkResponse({ type: () => AppointmentDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getToday(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.getToday(filters);
  }

  @Get('telemedicine')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List telemedicine appointments' })
  @ApiOkResponse({ type: () => AppointmentDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getTelemedicine(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.getTelemedicine(filters);
  }

  @Get('waitlist')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get appointment waitlist' })
  @ApiOkResponse({ type: () => WaitlistEntryDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getWaitlist() {
    return this.appointmentsService.getWaitlist();
  }

  @Get('queue')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get check-in queue for today' })
  @ApiOkResponse({ type: () => QueueEntryDto, isArray: true })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  getQueue(@Query() filters: AppointmentFiltersDto) {
    return this.appointmentsService.getQueue(filters);
  }

  @Get(':appointmentId')
  @RequireAnyPermission([...APPOINTMENT_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get appointment by id' })
  @ApiParam({ name: 'appointmentId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Appointment', type: () => AppointmentDto })
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  @ApiNotFoundResponse(APPOINTMENT_ERRORS.notFound)
  getById(@Param('appointmentId') appointmentId: string) {
    return this.appointmentsService.getById(appointmentId);
  }

  @Post()
  @RequireAnyPermission([...APPOINTMENT_WRITE_PERMISSIONS])
  @ApiOperation({ summary: 'Book a new appointment' })
  @ApiCreatedResponse({ description: 'Booked appointment', type: () => AppointmentDto })
  @ApiBadRequestResponse(APPOINTMENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  book(@Body() body: BookAppointmentBodyDto) {
    return this.appointmentsService.book(body);
  }

  @Post(':appointmentId/reschedule')
  @RequireAnyPermission([...APPOINTMENT_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiParam({ name: 'appointmentId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Rescheduled appointment', type: () => AppointmentDto })
  @ApiBadRequestResponse(APPOINTMENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  @ApiNotFoundResponse(APPOINTMENT_ERRORS.notFound)
  reschedule(
    @Param('appointmentId') appointmentId: string,
    @Body() body: RescheduleAppointmentBodyDto,
  ) {
    return this.appointmentsService.reschedule(appointmentId, body);
  }

  @Post(':appointmentId/cancel')
  @RequireAnyPermission([...APPOINTMENT_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({ name: 'appointmentId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Cancelled appointment', type: () => AppointmentDto })
  @ApiBadRequestResponse(APPOINTMENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  @ApiNotFoundResponse(APPOINTMENT_ERRORS.notFound)
  cancel(
    @Param('appointmentId') appointmentId: string,
    @Body() body: CancelAppointmentBodyDto,
  ) {
    return this.appointmentsService.cancel(appointmentId, body);
  }

  @Post(':appointmentId/check-in')
  @RequireAnyPermission([...APPOINTMENT_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check in to an appointment' })
  @ApiParam({ name: 'appointmentId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Checked-in appointment', type: () => AppointmentDto })
  @ApiBadRequestResponse(APPOINTMENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(APPOINTMENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(APPOINTMENT_ERRORS.forbidden)
  @ApiNotFoundResponse(APPOINTMENT_ERRORS.notFound)
  checkIn(@Param('appointmentId') appointmentId: string) {
    return this.appointmentsService.checkIn(appointmentId);
  }
}
