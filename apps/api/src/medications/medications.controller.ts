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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicationFiltersDto } from './dto/medication-filters.dto';
import {
  CreatePrescriptionBodyDto,
  LogDoseBodyDto,
  RefillRequestBodyDto,
} from './dto/medication-input.dto';
import {
  ApiErrorResponseDto,
  DoseLogDto,
  MedicationReminderDto,
  MedicationSearchResultDto,
  PaginatedMedicationsDto,
  PatientMedicationDto,
  PrescriptionDto,
  RefillRequestDto,
  ScheduledDoseDto,
} from './dto/medication-response.dto';
import { MedicationsService } from './medications.service';

const MEDICATION_READ_PERMISSIONS = [
  'medications.read',
  'medications.admin',
] as const;

const MEDICATION_WRITE_PERMISSIONS = [
  'medications.write',
  'medications.prescribe',
  'medications.admin',
] as const;

const MEDICATION_DOSE_PERMISSIONS = [
  'medications.write',
  'medications.administer',
  'medications.admin',
] as const;

const MEDICATION_REFILL_PERMISSIONS = [
  'medications.refill',
  'medications.write',
  'medications.admin',
] as const;

const MEDICATION_ERRORS = {
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

@ApiTags('medications')
@ApiBearerAuth()
@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
  constructor(
    @Inject(MedicationsService)
    private readonly medicationsService: MedicationsService,
  ) {}

  @Get()
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Search medications (paginated)' })
  @ApiOkResponse({ type: () => PaginatedMedicationsDto })
  @ApiUnauthorizedResponse(MEDICATION_ERRORS.unauthorized)
  @ApiForbiddenResponse(MEDICATION_ERRORS.forbidden)
  list(@Query() filters: MedicationFiltersDto) {
    return this.medicationsService.listMedications(filters);
  }

  @Get('all')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List all medications matching filters' })
  @ApiOkResponse({ type: () => PatientMedicationDto, isArray: true })
  @ApiUnauthorizedResponse(MEDICATION_ERRORS.unauthorized)
  @ApiForbiddenResponse(MEDICATION_ERRORS.forbidden)
  getAll(@Query() filters: MedicationFiltersDto) {
    return this.medicationsService.getAllMedications(filters);
  }

  @Get('prescriptions')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List prescriptions' })
  @ApiOkResponse({ type: () => PrescriptionDto, isArray: true })
  @ApiUnauthorizedResponse(MEDICATION_ERRORS.unauthorized)
  @ApiForbiddenResponse(MEDICATION_ERRORS.forbidden)
  listPrescriptions(@Query() filters: MedicationFiltersDto) {
    return this.medicationsService.listPrescriptions(filters);
  }

  @Get('prescriptions/:prescriptionId')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get prescription by id' })
  @ApiParam({ name: 'prescriptionId', type: String, format: 'uuid' })
  @ApiOkResponse({ type: () => PrescriptionDto })
  @ApiNotFoundResponse(MEDICATION_ERRORS.notFound)
  getPrescription(@Param('prescriptionId') prescriptionId: string) {
    return this.medicationsService.getPrescription(prescriptionId);
  }

  @Get('schedule')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get medication schedule / pill organizer doses' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiOkResponse({ type: () => ScheduledDoseDto, isArray: true })
  getSchedule(@Query('patientId') patientId?: string) {
    return this.medicationsService.getSchedule(patientId);
  }

  @Get('logs')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get dose logs' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiOkResponse({ type: () => DoseLogDto, isArray: true })
  getLogs(@Query('patientId') patientId?: string) {
    return this.medicationsService.getLogs(patientId);
  }

  @Get('reminders')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get medication reminders' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiOkResponse({ type: () => MedicationReminderDto, isArray: true })
  getReminders(@Query('patientId') patientId?: string) {
    return this.medicationsService.getReminders(patientId);
  }

  @Get('refills')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get refill requests' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiOkResponse({ type: () => RefillRequestDto, isArray: true })
  getRefills(@Query('patientId') patientId?: string) {
    return this.medicationsService.getRefills(patientId);
  }

  @Get('search')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Search medications and prescriptions' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiOkResponse({ type: () => MedicationSearchResultDto })
  search(@Query('q') q: string, @Query('patientId') patientId?: string) {
    return this.medicationsService.search(q ?? '', patientId);
  }

  @Get(':medicationId')
  @RequireAnyPermission([...MEDICATION_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get medication by id' })
  @ApiParam({ name: 'medicationId', type: String, format: 'uuid' })
  @ApiOkResponse({ type: () => PatientMedicationDto })
  @ApiNotFoundResponse(MEDICATION_ERRORS.notFound)
  getMedication(@Param('medicationId') medicationId: string) {
    return this.medicationsService.getMedication(medicationId);
  }

  @Post('prescriptions')
  @RequireAnyPermission([...MEDICATION_WRITE_PERMISSIONS])
  @ApiOperation({ summary: 'Create a prescription (and active medication)' })
  @ApiCreatedResponse({ type: () => PrescriptionDto })
  @ApiBadRequestResponse(MEDICATION_ERRORS.badRequest)
  createPrescription(@Body() body: CreatePrescriptionBodyDto) {
    return this.medicationsService.createPrescription(body);
  }

  @Post('prescriptions/:prescriptionId/cancel')
  @RequireAnyPermission([...MEDICATION_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a prescription' })
  @ApiOkResponse({ type: () => PrescriptionDto })
  @ApiNotFoundResponse(MEDICATION_ERRORS.notFound)
  cancelPrescription(@Param('prescriptionId') prescriptionId: string) {
    return this.medicationsService.cancelPrescription(prescriptionId);
  }

  @Post('prescriptions/:prescriptionId/renew')
  @RequireAnyPermission([...MEDICATION_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew a prescription' })
  @ApiOkResponse({ type: () => PrescriptionDto })
  @ApiNotFoundResponse(MEDICATION_ERRORS.notFound)
  renewPrescription(@Param('prescriptionId') prescriptionId: string) {
    return this.medicationsService.renewPrescription(prescriptionId);
  }

  @Post('doses/log')
  @RequireAnyPermission([...MEDICATION_DOSE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log a dose (pill organizer)' })
  @ApiOkResponse({ type: () => DoseLogDto })
  @ApiBadRequestResponse(MEDICATION_ERRORS.badRequest)
  logDose(@Body() body: LogDoseBodyDto) {
    return this.medicationsService.logDose(body);
  }

  @Post('refills')
  @RequireAnyPermission([...MEDICATION_REFILL_PERMISSIONS])
  @ApiOperation({ summary: 'Request a refill' })
  @ApiCreatedResponse({ type: () => RefillRequestDto })
  requestRefill(@Body() body: RefillRequestBodyDto) {
    return this.medicationsService.requestRefill(body);
  }

  @Post('refills/:refillId/approve')
  @RequireAnyPermission([...MEDICATION_REFILL_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a refill request' })
  @ApiOkResponse({ type: () => RefillRequestDto })
  approveRefill(@Param('refillId') refillId: string) {
    return this.medicationsService.approveRefill(refillId);
  }

  @Post('refills/:refillId/reject')
  @RequireAnyPermission([...MEDICATION_REFILL_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a refill request' })
  @ApiOkResponse({ type: () => RefillRequestDto })
  rejectRefill(@Param('refillId') refillId: string) {
    return this.medicationsService.rejectRefill(refillId);
  }

  @Post('reminders/:reminderId/done')
  @RequireAnyPermission([...MEDICATION_DOSE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark reminder done' })
  @ApiOkResponse({ type: () => MedicationReminderDto })
  markReminderDone(@Param('reminderId') reminderId: string) {
    return this.medicationsService.markReminderDone(reminderId);
  }

  @Post(':medicationId/pause')
  @RequireAnyPermission([...MEDICATION_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause a medication' })
  @ApiOkResponse({ type: () => PatientMedicationDto })
  pauseMedication(@Param('medicationId') medicationId: string) {
    return this.medicationsService.pauseMedication(medicationId);
  }

  @Post(':medicationId/resume')
  @RequireAnyPermission([...MEDICATION_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume a medication' })
  @ApiOkResponse({ type: () => PatientMedicationDto })
  resumeMedication(@Param('medicationId') medicationId: string) {
    return this.medicationsService.resumeMedication(medicationId);
  }

  @Post(':medicationId/complete')
  @RequireAnyPermission([...MEDICATION_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark medication course complete' })
  @ApiOkResponse({ type: () => PatientMedicationDto })
  completeCourse(@Param('medicationId') medicationId: string) {
    return this.medicationsService.completeCourse(medicationId);
  }
}
