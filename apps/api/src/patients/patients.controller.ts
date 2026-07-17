import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
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

import { RequirePermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ExportPatientsBodyDto,
  PatientFiltersDto,
  PatientSearchQueryDto,
} from './dto/patient-filters.dto';
import {
  CreatePatientAllergyBodyDto,
  CreatePatientPreferenceBodyDto,
  RegisterPatientBodyDto,
  UpdatePatientBodyDto,
  ValidatePatientMergeBodyDto,
} from './dto/patient-input.dto';
import {
  ApiErrorResponseDto,
  ExportPatientsResultDto,
  PaginatedPatientsDto,
  PatientAddressDto,
  PatientAllergyDto,
  PatientContactDto,
  PatientDto,
  PatientEmergencyContactDto,
  PatientIdentifierDto,
  PatientMergeValidationResultDto,
  PatientPreferenceDto,
} from './dto/patient-response.dto';
import { PatientsService } from './patients.service';

const PATIENT_ERRORS = {
  badRequest: {
    description: 'Validation failed',
    type: () => ApiErrorResponseDto,
  },
  unauthorized: {
    description: 'Authentication required',
    type: () => ApiErrorResponseDto,
  },
  forbidden: {
    description: 'Insufficient permissions or ABAC policy denial',
    type: () => ApiErrorResponseDto,
  },
  notFound: {
    description: 'Patient not found',
    type: () => ApiErrorResponseDto,
  },
} as const;

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(
    @Inject(PatientsService) private readonly patientsService: PatientsService,
  ) {}

  @Get()
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'List patients (paginated)' })
  @ApiOkResponse({
    description: 'Paginated patient list',
    type: () => PaginatedPatientsDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  listPatients(@Query() filters: PatientFiltersDto) {
    return this.patientsService.listPatients(filters);
  }

  @Get('search')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'Search patients' })
  @ApiOkResponse({
    description: 'Paginated search results',
    type: () => PaginatedPatientsDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  searchPatients(@Query() filters: PatientSearchQueryDto) {
    return this.patientsService.searchPatients(filters);
  }

  @Post('export')
  @RequirePermission('patients.read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export patients' })
  @ApiOkResponse({
    description: 'Export metadata',
    type: () => ExportPatientsResultDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  exportPatients(@Body() body: ExportPatientsBodyDto) {
    return this.patientsService.exportPatients(body);
  }

  @Post('validate-merge')
  @RequirePermission('patients.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate patient merge candidates (execution deferred)',
  })
  @ApiOkResponse({
    description: 'Merge validation result',
    type: () => PatientMergeValidationResultDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  validateMerge(@Body() body: ValidatePatientMergeBodyDto) {
    return this.patientsService.validateMerge(body);
  }

  @Get(':patientId')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'Get patient by id' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Patient record', type: () => PatientDto })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getPatient(@Param('patientId') patientId: string) {
    return this.patientsService.getPatient(patientId);
  }

  @Post()
  @RequirePermission('patients.write')
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiCreatedResponse({
    description: 'Registered patient',
    type: () => PatientDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  registerPatient(@Body() body: RegisterPatientBodyDto) {
    return this.patientsService.registerPatient(body);
  }

  @Patch(':patientId')
  @RequirePermission('patients.write')
  @ApiOperation({ summary: 'Update patient demographics' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Updated patient', type: () => PatientDto })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  updatePatient(
    @Param('patientId') patientId: string,
    @Body() body: UpdatePatientBodyDto,
  ) {
    return this.patientsService.updatePatient(patientId, body);
  }

  @Delete(':patientId')
  @RequirePermission('patients.delete')
  @ApiOperation({ summary: 'Archive (soft-delete) a patient' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Archived patient', type: () => PatientDto })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  archivePatient(@Param('patientId') patientId: string) {
    return this.patientsService.archivePatient(patientId);
  }

  @Post(':patientId/restore')
  @RequirePermission('patients.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived patient' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Restored patient', type: () => PatientDto })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  restorePatient(@Param('patientId') patientId: string) {
    return this.patientsService.restorePatient(patientId);
  }

  @Get(':patientId/identifiers')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'List patient identifiers' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient identifiers',
    type: PatientIdentifierDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getIdentifiers(@Param('patientId') patientId: string) {
    return this.patientsService.getIdentifiers(patientId);
  }

  @Get(':patientId/contacts')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'List patient contacts' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient contacts',
    type: PatientContactDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getContacts(@Param('patientId') patientId: string) {
    return this.patientsService.getContacts(patientId);
  }

  @Get(':patientId/addresses')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'List patient addresses' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient addresses',
    type: PatientAddressDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getAddresses(@Param('patientId') patientId: string) {
    return this.patientsService.getAddresses(patientId);
  }

  @Get(':patientId/emergency-contacts')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'List patient emergency contacts' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Emergency contacts',
    type: PatientEmergencyContactDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getEmergencyContacts(@Param('patientId') patientId: string) {
    return this.patientsService.getEmergencyContacts(patientId);
  }

  @Get(':patientId/allergies')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'List patient allergies' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient allergies',
    type: PatientAllergyDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getAllergies(@Param('patientId') patientId: string) {
    return this.patientsService.getAllergies(patientId);
  }

  @Get(':patientId/preferences')
  @RequirePermission('patients.read')
  @ApiOperation({ summary: 'Get patient preferences' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient preferences',
    type: () => PatientPreferenceDto,
  })
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  getPreferences(@Param('patientId') patientId: string) {
    return this.patientsService.getPreferences(patientId);
  }

  @Post(':patientId/allergies')
  @RequirePermission('patients.write')
  @ApiOperation({ summary: 'Add a patient allergy' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiCreatedResponse({
    description: 'Created allergy',
    type: () => PatientAllergyDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  addAllergy(
    @Param('patientId') patientId: string,
    @Body() body: CreatePatientAllergyBodyDto,
  ) {
    return this.patientsService.addAllergy(patientId, body);
  }

  @Put(':patientId/preferences')
  @RequirePermission('patients.write')
  @ApiOperation({ summary: 'Create or update patient preferences' })
  @ApiParam({ name: 'patientId', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient preferences',
    type: () => PatientPreferenceDto,
  })
  @ApiBadRequestResponse(PATIENT_ERRORS.badRequest)
  @ApiUnauthorizedResponse(PATIENT_ERRORS.unauthorized)
  @ApiForbiddenResponse(PATIENT_ERRORS.forbidden)
  @ApiNotFoundResponse(PATIENT_ERRORS.notFound)
  updatePreferences(
    @Param('patientId') patientId: string,
    @Body() body: CreatePatientPreferenceBodyDto,
  ) {
    return this.patientsService.updatePreferences(patientId, body);
  }
}
