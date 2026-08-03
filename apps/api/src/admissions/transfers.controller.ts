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
import { TransferFiltersDto } from './dto/admission-filters.dto';
import {
  CompleteTransferBodyDto,
  CreateTransferBodyDto,
  NotesBodyDto,
} from './dto/admission-input.dto';
import {
  ApiErrorResponseDto,
  PaginatedTransfersDto,
  PatientTransferDto,
} from './dto/admission-response.dto';
import { AdmissionsService } from './admissions.service';

const READ = ['beds.manage', 'patients.read', 'transfers.approve'] as const;
const WRITE = ['beds.manage', 'transfers.approve', 'patients.write'] as const;

const ERRORS = {
  badRequest: { description: 'Validation failed', type: () => ApiErrorResponseDto },
  unauthorized: { description: 'Authentication required', type: () => ApiErrorResponseDto },
  forbidden: { description: 'Insufficient permissions', type: () => ApiErrorResponseDto },
  notFound: { description: 'Transfer not found', type: () => ApiErrorResponseDto },
} as const;

@ApiTags('transfers')
@ApiBearerAuth()
@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(
    @Inject(AdmissionsService)
    private readonly admissionsService: AdmissionsService,
  ) {}

  @Get()
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search transfers (paginated)' })
  @ApiOkResponse({ type: () => PaginatedTransfersDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  search(@Query() filters: TransferFiltersDto) {
    return this.admissionsService.searchTransfers(filters);
  }

  @Get('all')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List all transfers' })
  @ApiOkResponse({ type: () => PatientTransferDto, isArray: true })
  getAll(@Query() filters: TransferFiltersDto) {
    return this.admissionsService.getAllTransfers(filters);
  }

  @Get(':transferId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'transferId', format: 'uuid' })
  @ApiOkResponse({ type: () => PatientTransferDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getById(@Param('transferId') transferId: string) {
    return this.admissionsService.getTransfer(transferId);
  }

  @Post()
  @RequireAnyPermission([...WRITE])
  @ApiOperation({ summary: 'Request a patient transfer' })
  @ApiCreatedResponse({ type: () => PatientTransferDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  create(@Body() body: CreateTransferBodyDto) {
    return this.admissionsService.createTransfer(body);
  }

  @Post(':transferId/approve')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve transfer' })
  @ApiOkResponse({ type: () => PatientTransferDto })
  approve(
    @Param('transferId') transferId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.admissionsService.approveTransfer(transferId, body.notes);
  }

  @Post(':transferId/start')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark transfer in transit' })
  @ApiOkResponse({ type: () => PatientTransferDto })
  start(
    @Param('transferId') transferId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.admissionsService.startTransfer(transferId, body.notes);
  }

  @Post(':transferId/complete')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete transfer (reassign bed)' })
  @ApiOkResponse({ type: () => PatientTransferDto })
  complete(
    @Param('transferId') transferId: string,
    @Body() body: CompleteTransferBodyDto,
  ) {
    return this.admissionsService.completeTransfer(transferId, body);
  }

  @Post(':transferId/cancel')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel transfer' })
  @ApiOkResponse({ type: () => PatientTransferDto })
  cancel(
    @Param('transferId') transferId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.admissionsService.cancelTransfer(transferId, body.notes);
  }
}
