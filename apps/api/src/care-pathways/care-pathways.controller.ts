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
import { CarePlanFiltersDto, CareTaskQueryDto } from './dto/care-pathway-filters.dto';
import {
  AssignTaskBodyDto,
  CompleteStepBodyDto,
  CompleteTaskBodyDto,
  CreateCarePlanBodyDto,
  NotesBodyDto,
} from './dto/care-pathway-input.dto';
import {
  ApiErrorResponseDto,
  CarePlanBoardDto,
  CarePlanDto,
  CarePlanStepDto,
  CareTaskDto,
  ClinicalPathwayDto,
  PaginatedCarePlansDto,
} from './dto/care-pathway-response.dto';
import { CarePathwaysService } from './care-pathways.service';

const READ = ['care-plans.read', 'patients.read'] as const;
const WRITE = ['care-plans.write', 'patients.write'] as const;

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

@ApiTags('care-pathways')
@ApiBearerAuth()
@Controller('care-pathways')
@UseGuards(JwtAuthGuard)
export class CarePathwaysController {
  constructor(
    @Inject(CarePathwaysService)
    private readonly carePathwaysService: CarePathwaysService,
  ) {}

  @Get()
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List active care pathway definitions' })
  @ApiOkResponse({ type: () => ClinicalPathwayDto, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  listPathways() {
    return this.carePathwaysService.listPathways();
  }

  @Get(':code')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'code', example: 'diabetes' })
  @ApiOkResponse({ type: () => ClinicalPathwayDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getPathway(@Param('code') code: string) {
    return this.carePathwaysService.getPathway(code);
  }
}

@ApiTags('care-plans')
@ApiBearerAuth()
@Controller('care-plans')
@UseGuards(JwtAuthGuard)
export class CarePlansController {
  constructor(
    @Inject(CarePathwaysService)
    private readonly carePathwaysService: CarePathwaysService,
  ) {}

  @Get()
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search care plan enrollments (paginated)' })
  @ApiOkResponse({ type: () => PaginatedCarePlansDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  search(@Query() filters: CarePlanFiltersDto) {
    return this.carePathwaysService.search(filters);
  }

  @Get('all')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List all care plan enrollments' })
  @ApiOkResponse({ type: () => CarePlanDto, isArray: true })
  getAll(@Query() filters: CarePlanFiltersDto) {
    return this.carePathwaysService.getAll(filters);
  }

  @Get('board')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Care plan board summary' })
  @ApiOkResponse({ type: () => CarePlanBoardDto })
  getBoard(@Query() filters: CarePlanFiltersDto) {
    return this.carePathwaysService.getBoard(filters);
  }

  @Get('tasks')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List care plan tasks' })
  @ApiOkResponse({ type: () => CareTaskDto, isArray: true })
  getTasks(@Query() query: CareTaskQueryDto) {
    return this.carePathwaysService.getTasks(query.carePlanId, query.patientId);
  }

  @Get('patient/:patientId/active')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: () => CarePlanDto })
  getActive(@Param('patientId') patientId: string) {
    return this.carePathwaysService.getActiveForPatient(patientId);
  }

  @Get(':carePlanId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'carePlanId', format: 'uuid' })
  @ApiOkResponse({ type: () => CarePlanDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getById(@Param('carePlanId') carePlanId: string) {
    return this.carePathwaysService.getById(carePlanId);
  }

  @Get(':carePlanId/steps')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'carePlanId', format: 'uuid' })
  @ApiOkResponse({ type: () => CarePlanStepDto, isArray: true })
  getSteps(@Param('carePlanId') carePlanId: string) {
    return this.carePathwaysService.getSteps(carePlanId);
  }

  @Get(':carePlanId/tasks')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'carePlanId', format: 'uuid' })
  @ApiOkResponse({ type: () => CareTaskDto, isArray: true })
  getPlanTasks(@Param('carePlanId') carePlanId: string) {
    return this.carePathwaysService.getTasks(carePlanId);
  }

  @Post()
  @RequireAnyPermission([...WRITE])
  @ApiOperation({ summary: 'Enroll patient on a care pathway / create plan' })
  @ApiCreatedResponse({ type: () => CarePlanDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  enroll(@Body() body: CreateCarePlanBodyDto) {
    return this.carePathwaysService.enroll(body);
  }

  @Post('tasks/complete')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CareTaskDto })
  completeTask(@Body() body: CompleteTaskBodyDto) {
    return this.carePathwaysService.completeTask(body);
  }

  @Post('tasks/assign')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CareTaskDto })
  assignTask(@Body() body: AssignTaskBodyDto) {
    return this.carePathwaysService.assignTask(body);
  }

  @Post(':carePlanId/activate')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CarePlanDto })
  activate(@Param('carePlanId') carePlanId: string) {
    return this.carePathwaysService.activate(carePlanId);
  }

  @Post(':carePlanId/suspend')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CarePlanDto })
  suspend(
    @Param('carePlanId') carePlanId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.carePathwaysService.suspend(carePlanId, body.notes);
  }

  @Post(':carePlanId/archive')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CarePlanDto })
  archive(
    @Param('carePlanId') carePlanId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.carePathwaysService.archive(carePlanId, body.notes);
  }

  @Post(':carePlanId/complete')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CarePlanDto })
  complete(
    @Param('carePlanId') carePlanId: string,
    @Body() body: NotesBodyDto,
  ) {
    return this.carePathwaysService.complete(carePlanId, body.notes);
  }

  @Post(':carePlanId/steps/:stepId/complete')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => CarePlanStepDto })
  completeStep(
    @Param('carePlanId') carePlanId: string,
    @Param('stepId') stepId: string,
    @Body() body: CompleteStepBodyDto,
  ) {
    return this.carePathwaysService.completeStep(carePlanId, stepId, body);
  }
}
