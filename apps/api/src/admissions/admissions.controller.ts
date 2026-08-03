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
import { AdmissionFiltersDto } from './dto/admission-filters.dto';
import {
  AssignAdmissionBedBodyDto,
  CreateAdmissionBodyDto,
  NotesBodyDto,
  TriageAdmissionBodyDto,
} from './dto/admission-input.dto';
import {
  AdmissionBoardDto,
  AdmissionDto,
  ApiErrorResponseDto,
  PaginatedAdmissionsDto,
} from './dto/admission-response.dto';
import { AdmissionsService } from './admissions.service';

const READ = ['beds.manage', 'patients.read', 'transfers.approve'] as const;
const WRITE = ['beds.manage', 'patients.write'] as const;

const ERRORS = {
  badRequest: { description: 'Validation failed', type: () => ApiErrorResponseDto },
  unauthorized: { description: 'Authentication required', type: () => ApiErrorResponseDto },
  forbidden: { description: 'Insufficient permissions', type: () => ApiErrorResponseDto },
  notFound: { description: 'Admission not found', type: () => ApiErrorResponseDto },
} as const;

@ApiTags('admissions')
@ApiBearerAuth()
@Controller('admissions')
@UseGuards(JwtAuthGuard)
export class AdmissionsController {
  constructor(
    @Inject(AdmissionsService)
    private readonly admissionsService: AdmissionsService,
  ) {}

  @Get()
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search admissions (paginated)' })
  @ApiOkResponse({ type: () => PaginatedAdmissionsDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  search(@Query() filters: AdmissionFiltersDto) {
    return this.admissionsService.search(filters);
  }

  @Get('all')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List all admissions' })
  @ApiOkResponse({ type: () => AdmissionDto, isArray: true })
  getAll(@Query() filters: AdmissionFiltersDto) {
    return this.admissionsService.getAll(filters);
  }

  @Get('board')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Admission board summary + queue' })
  @ApiOkResponse({ type: () => AdmissionBoardDto })
  getBoard(@Query() filters: AdmissionFiltersDto) {
    return this.admissionsService.getBoard(filters);
  }

  @Get(':admissionId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'admissionId', format: 'uuid' })
  @ApiOkResponse({ type: () => AdmissionDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getById(@Param('admissionId') admissionId: string) {
    return this.admissionsService.getById(admissionId);
  }

  @Post()
  @RequireAnyPermission([...WRITE])
  @ApiOperation({ summary: 'Create admission request' })
  @ApiCreatedResponse({ type: () => AdmissionDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  create(@Body() body: CreateAdmissionBodyDto) {
    return this.admissionsService.create(body);
  }

  @Post(':admissionId/triage')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Triage admission request' })
  @ApiOkResponse({ type: () => AdmissionDto })
  triage(
    @Param('admissionId') admissionId: string,
    @Body() body: TriageAdmissionBodyDto,
  ) {
    return this.admissionsService.triage(admissionId, body);
  }

  @Post(':admissionId/assign-bed')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign bed to admission' })
  @ApiOkResponse({ type: () => AdmissionDto })
  assignBed(
    @Param('admissionId') admissionId: string,
    @Body() body: AssignAdmissionBedBodyDto,
  ) {
    return this.admissionsService.assignBed(admissionId, body);
  }

  @Post(':admissionId/admit')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admit patient (occupy bed)' })
  @ApiOkResponse({ type: () => AdmissionDto })
  admit(
    @Param('admissionId') admissionId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.admissionsService.admit(admissionId, body.notes);
  }

  @Post(':admissionId/cancel')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel admission request' })
  @ApiOkResponse({ type: () => AdmissionDto })
  cancel(
    @Param('admissionId') admissionId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.admissionsService.cancel(admissionId, body.notes);
  }

  @Post(':admissionId/discharge')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Discharge admitted patient' })
  @ApiOkResponse({ type: () => AdmissionDto })
  discharge(
    @Param('admissionId') admissionId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.admissionsService.discharge(admissionId, body.notes);
  }
}
