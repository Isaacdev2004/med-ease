import {
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
  ApiBearerAuth,
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
import { RequestContextService } from '../tenant/request-context.service';
import {
  MedicationLibraryFiltersDto,
  MedicationSuggestionsQueryDto,
} from './dto/medical-library-filters.dto';
import {
  ApiErrorResponseDto,
  MedicationCategoryInfoDto,
  MedicationLibraryStatsDto,
  MedicationRecordDto,
  MedicationSearchResultDto,
  ToggleFavoriteResponseDto,
} from './dto/medical-library-response.dto';
import { MedicalLibraryService } from './medical-library.service';

const READ = ['medications.read', 'patients.read'] as const;

const ERRORS = {
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

@ApiTags('medical-library')
@ApiBearerAuth()
@Controller('medical-library')
@UseGuards(JwtAuthGuard)
export class MedicalLibraryController {
  constructor(
    @Inject(MedicalLibraryService)
    private readonly medicalLibraryService: MedicalLibraryService,
    @Inject(RequestContextService)
    private readonly requestContext: RequestContextService,
  ) {}

  @Get('medications')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search medication catalog (paginated)' })
  @ApiOkResponse({ type: () => MedicationSearchResultDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  search(@Query() filters: MedicationLibraryFiltersDto) {
    return this.medicalLibraryService.search(filters);
  }

  @Get('medications/:id')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Get medication catalog entry by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: () => MedicationRecordDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getById(@Param('id') id: string) {
    return this.medicalLibraryService.getById(id);
  }

  @Get('medications/:id/related')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Get related medications' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: () => MedicationRecordDto, isArray: true })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getRelated(@Param('id') id: string) {
    return this.medicalLibraryService.getRelated(id);
  }

  @Get('categories')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List medication categories with counts' })
  @ApiOkResponse({ type: () => MedicationCategoryInfoDto, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getCategories() {
    return this.medicalLibraryService.getCategories();
  }

  @Get('stats')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Medication library stats for current user' })
  @ApiOkResponse({ type: () => MedicationLibraryStatsDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getStats() {
    return this.medicalLibraryService.getStats(this.userId());
  }

  @Get('favorites')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List favorite medications for current user' })
  @ApiOkResponse({ type: () => MedicationRecordDto, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  listFavorites() {
    return this.medicalLibraryService.listFavorites(this.userId());
  }

  @Post('favorites/:medicationId/toggle')
  @RequireAnyPermission([...READ])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle favorite medication for current user' })
  @ApiParam({ name: 'medicationId', format: 'uuid' })
  @ApiOkResponse({ type: () => ToggleFavoriteResponseDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  async toggleFavorite(@Param('medicationId') medicationId: string) {
    const isFavorite = await this.medicalLibraryService.toggleFavorite(
      this.userId(),
      medicationId,
    );
    return { isFavorite };
  }

  @Get('suggestions')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Autocomplete medication name suggestions' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiOkResponse({ type: String, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getSuggestions(@Query() query: MedicationSuggestionsQueryDto) {
    return this.medicalLibraryService.getSuggestions(query.q ?? '');
  }

  @Get('popular')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Popular medication search terms' })
  @ApiOkResponse({ type: String, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getPopular() {
    return this.medicalLibraryService.getPopular();
  }

  private userId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
