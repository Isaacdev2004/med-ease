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
import { BedFiltersDto } from './dto/bed-filters.dto';
import {
  AssignBedBodyDto,
  CreateBedBodyDto,
  ReleaseBedBodyDto,
  ReserveBedBodyDto,
  UpdateBedStatusBodyDto,
} from './dto/bed-input.dto';
import {
  ApiErrorResponseDto,
  BedAssignmentDto,
  BedBoardDto,
  BedDto,
  PaginatedBedsDto,
} from './dto/bed-response.dto';
import { BedsService } from './beds.service';

const BED_READ_PERMISSIONS = ['beds.manage', 'patients.read'] as const;
const BED_WRITE_PERMISSIONS = ['beds.manage'] as const;

const BED_ERRORS = {
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
    description: 'Bed not found',
    type: () => ApiErrorResponseDto,
  },
} as const;

@ApiTags('beds')
@ApiBearerAuth()
@Controller('beds')
@UseGuards(JwtAuthGuard)
export class BedsController {
  constructor(
    @Inject(BedsService)
    private readonly bedsService: BedsService,
  ) {}

  @Get()
  @RequireAnyPermission([...BED_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Search beds (paginated)' })
  @ApiOkResponse({ type: () => PaginatedBedsDto })
  @ApiUnauthorizedResponse(BED_ERRORS.unauthorized)
  @ApiForbiddenResponse(BED_ERRORS.forbidden)
  search(@Query() filters: BedFiltersDto) {
    return this.bedsService.search(filters);
  }

  @Get('all')
  @RequireAnyPermission([...BED_READ_PERMISSIONS])
  @ApiOperation({ summary: 'List all beds matching filters' })
  @ApiOkResponse({ type: () => BedDto, isArray: true })
  getAll(@Query() filters: BedFiltersDto) {
    return this.bedsService.getAll(filters);
  }

  @Get('board')
  @RequireAnyPermission([...BED_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Bed board summary + inventory' })
  @ApiOkResponse({ type: () => BedBoardDto })
  getBoard(@Query() filters: BedFiltersDto) {
    return this.bedsService.getBoard(filters);
  }

  @Get(':bedId')
  @RequireAnyPermission([...BED_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get bed by id' })
  @ApiParam({ name: 'bedId', type: String, format: 'uuid' })
  @ApiOkResponse({ type: () => BedDto })
  @ApiNotFoundResponse(BED_ERRORS.notFound)
  getById(@Param('bedId') bedId: string) {
    return this.bedsService.getById(bedId);
  }

  @Get(':bedId/assignments')
  @RequireAnyPermission([...BED_READ_PERMISSIONS])
  @ApiOperation({ summary: 'Get bed assignment history' })
  @ApiOkResponse({ type: () => BedAssignmentDto, isArray: true })
  getAssignments(@Param('bedId') bedId: string) {
    return this.bedsService.getAssignments(bedId);
  }

  @Post()
  @RequireAnyPermission([...BED_WRITE_PERMISSIONS])
  @ApiOperation({ summary: 'Create a bed' })
  @ApiCreatedResponse({ type: () => BedDto })
  @ApiBadRequestResponse(BED_ERRORS.badRequest)
  create(@Body() body: CreateBedBodyDto) {
    return this.bedsService.create(body);
  }

  @Post(':bedId/assign')
  @RequireAnyPermission([...BED_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a patient to a bed' })
  @ApiOkResponse({ type: () => BedDto })
  @ApiNotFoundResponse(BED_ERRORS.notFound)
  assign(@Param('bedId') bedId: string, @Body() body: AssignBedBodyDto) {
    return this.bedsService.assign(bedId, body);
  }

  @Post(':bedId/release')
  @RequireAnyPermission([...BED_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release a bed (moves to cleaning)' })
  @ApiOkResponse({ type: () => BedDto })
  release(@Param('bedId') bedId: string, @Body() body: ReleaseBedBodyDto) {
    return this.bedsService.release(bedId, body.notes);
  }

  @Post(':bedId/reserve')
  @RequireAnyPermission([...BED_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reserve a bed' })
  @ApiOkResponse({ type: () => BedDto })
  reserve(@Param('bedId') bedId: string, @Body() body: ReserveBedBodyDto) {
    return this.bedsService.reserve(bedId, body);
  }

  @Post(':bedId/status')
  @RequireAnyPermission([...BED_WRITE_PERMISSIONS])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update bed status' })
  @ApiOkResponse({ type: () => BedDto })
  updateStatus(
    @Param('bedId') bedId: string,
    @Body() body: UpdateBedStatusBodyDto,
  ) {
    return this.bedsService.updateStatus(bedId, body);
  }
}
