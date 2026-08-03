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
  DirectoryFiltersDto,
  DirectorySuggestionsQueryDto,
} from './dto/directory-filters.dto';
import {
  ApiErrorResponseDto,
  DirectoryProviderDto,
  DirectorySearchResultDto,
  DirectoryStatsDto,
  ToggleFavoriteResultDto,
} from './dto/directory-response.dto';
import { DirectoryService } from './directory.service';

const READ = ['patients.read', 'facilities.read'] as const;

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

@ApiTags('directory')
@ApiBearerAuth()
@Controller('directory')
@UseGuards(JwtAuthGuard)
export class DirectoryController {
  constructor(
    @Inject(DirectoryService)
    private readonly directoryService: DirectoryService,
    private readonly requestContext: RequestContextService,
  ) {}

  private requireUserId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }

  @Get('providers')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search directory providers (paginated)' })
  @ApiOkResponse({ type: () => DirectorySearchResultDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  search(@Query() filters: DirectoryFiltersDto) {
    return this.directoryService.search(filters);
  }

  @Get('providers/:id')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: () => DirectoryProviderDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getById(@Param('id') id: string) {
    return this.directoryService.getById(id);
  }

  @Get('providers/:id/related')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: () => DirectoryProviderDto, isArray: true })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getRelated(@Param('id') id: string) {
    return this.directoryService.getRelated(id);
  }

  @Get('stats')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Directory aggregate stats for current user' })
  @ApiOkResponse({ type: () => DirectoryStatsDto })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getStats() {
    return this.directoryService.getStats(this.requireUserId());
  }

  @Get('favorites')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List favorite directory providers' })
  @ApiOkResponse({ type: () => DirectoryProviderDto, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  listFavorites() {
    return this.directoryService.listFavorites(this.requireUserId());
  }

  @Post('favorites/:providerId/toggle')
  @RequireAnyPermission([...READ])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'providerId', format: 'uuid' })
  @ApiOperation({ summary: 'Toggle favorite for a directory provider' })
  @ApiOkResponse({ type: () => ToggleFavoriteResultDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  async toggleFavorite(@Param('providerId') providerId: string) {
    const isFavorite = await this.directoryService.toggleFavorite(
      this.requireUserId(),
      providerId,
    );
    return { isFavorite };
  }

  @Get('suggestions')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Autocomplete suggestions for directory search' })
  @ApiQuery({ name: 'q', required: false })
  @ApiOkResponse({ type: String, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getSuggestions(@Query() query: DirectorySuggestionsQueryDto) {
    return this.directoryService.getSuggestions(query.q ?? '');
  }

  @Get('popular-searches')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Popular directory search terms' })
  @ApiOkResponse({ type: String, isArray: true })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getPopularSearches() {
    return this.directoryService.getPopularSearches();
  }
}
