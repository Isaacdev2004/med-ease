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
  DashboardQueryDto,
  JoinSessionBodyDto,
  RecordingsQueryDto,
  SaveClinicalNoteBodyDto,
  SendMessageBodyDto,
  TelemedicineFiltersDto,
  TelemedicineSessionDto,
  WaitingRoomQueryDto,
} from './dto/telemedicine.dto';
import { TelemedicineService } from './telemedicine.service';

const READ = ['telemedicine.read', 'patients.read'] as const;
const WRITE = ['telemedicine.write', 'telemedicine.join'] as const;
const HOST = ['telemedicine.host', 'telemedicine.write'] as const;

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

@ApiTags('telemedicine')
@ApiBearerAuth()
@Controller('telemedicine')
@UseGuards(JwtAuthGuard)
export class TelemedicineController {
  constructor(
    @Inject(TelemedicineService)
    private readonly telemedicineService: TelemedicineService,
  ) {}

  @Get('sessions')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search telemedicine sessions (paginated)' })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  searchSessions(@Query() filters: TelemedicineFiltersDto) {
    return this.telemedicineService.searchSessions(filters);
  }

  @Get('sessions/:sessionId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  @ApiOkResponse({ type: () => TelemedicineSessionDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getSession(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.getSession(sessionId);
  }

  @Post('sessions/:sessionId/join')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiBadRequestResponse(ERRORS.badRequest)
  joinSession(
    @Param('sessionId') sessionId: string,
    @Body() body: JoinSessionBodyDto,
  ) {
    return this.telemedicineService.joinSession(sessionId, body.participantId);
  }

  @Post('sessions/:sessionId/leave')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  leaveSession(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.leaveSession(sessionId);
  }

  @Get('sessions/:sessionId/participants')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  getParticipants(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.getParticipants(sessionId);
  }

  @Get('sessions/:sessionId/messages')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  getMessages(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.getMessages(sessionId);
  }

  @Post('sessions/:sessionId/messages')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ description: 'Message sent' })
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  @ApiNotFoundResponse(ERRORS.notFound)
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: SendMessageBodyDto,
  ) {
    return this.telemedicineService.sendMessage({
      sessionId,
      ...body,
    });
  }

  @Get('sessions/:sessionId/notes')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  getClinicalNotes(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.getClinicalNotes(sessionId);
  }

  @Post('sessions/:sessionId/notes')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ description: 'Clinical note saved' })
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  @ApiNotFoundResponse(ERRORS.notFound)
  saveClinicalNote(
    @Param('sessionId') sessionId: string,
    @Body() body: SaveClinicalNoteBodyDto,
  ) {
    return this.telemedicineService.saveClinicalNote({
      sessionId,
      ...body,
    });
  }

  @Get('sessions/:sessionId/timeline')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  getTimeline(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.getTimeline(sessionId);
  }

  @Get('sessions/:sessionId/recordings')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'sessionId', format: 'uuid' })
  getSessionRecordings(@Param('sessionId') sessionId: string) {
    return this.telemedicineService.getRecordings(sessionId);
  }

  @Get('dashboard')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Get telemedicine dashboard aggregates' })
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.telemedicineService.getDashboard(
      query.patientId,
      query.clinicianId,
    );
  }

  @Get('waiting-room')
  @RequireAnyPermission([...READ])
  getWaitingRoom(@Query() query: WaitingRoomQueryDto) {
    return this.telemedicineService.getWaitingRoom(query.sessionId);
  }

  @Post('waiting-room/:entryId/admit')
  @RequireAnyPermission([...HOST])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'entryId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  admitWaitingRoom(@Param('entryId') entryId: string) {
    return this.telemedicineService.admitWaitingRoom(entryId);
  }

  @Post('waiting-room/:entryId/reject')
  @RequireAnyPermission([...HOST])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'entryId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  rejectWaitingRoom(@Param('entryId') entryId: string) {
    return this.telemedicineService.rejectWaitingRoom(entryId);
  }

  @Get('recordings')
  @RequireAnyPermission([...READ])
  getRecordings(@Query() query: RecordingsQueryDto) {
    return this.telemedicineService.getRecordings(query.sessionId);
  }

  @Get('providers/availability')
  @RequireAnyPermission([...READ])
  getProviderAvailability() {
    return this.telemedicineService.getProviderAvailability();
  }
}
