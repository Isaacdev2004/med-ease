import {
  Body,
  Controller,
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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnterpriseService } from './enterprise.service';

const READ = [
  'platform.read',
  'platform.admin',
  'finance.read',
  'inventory.read',
  'procurement.read',
  'iam.read',
] as const;
const WRITE = ['platform.write', 'platform.admin', 'iam.write'] as const;

class ListQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() q?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeKey?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
}

class ActionBodyDto {
  @ApiProperty({ type: [Object] })
  @IsArray()
  args!: unknown[];
}

@ApiTags('enterprise')
@ApiBearerAuth()
@Controller('enterprise')
@UseGuards(JwtAuthGuard)
export class EnterpriseController {
  constructor(
    @Inject(EnterpriseService) private readonly service: EnterpriseService,
  ) {}

  @Get(':module/dashboard')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Enterprise module dashboard snapshot' })
  @ApiParam({ name: 'module' })
  getDashboard(
    @Param('module') module: string,
    @Query('scopeKey') scopeKey?: string,
  ) {
    return this.service.getDashboard(module, scopeKey);
  }

  @Get(':module/analytics')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'module' })
  getAnalytics(
    @Param('module') module: string,
    @Query('scopeKey') scopeKey?: string,
  ) {
    return this.service.getAnalytics(module, scopeKey);
  }

  @Get(':module/resources/:resourceType')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'module' })
  @ApiParam({ name: 'resourceType' })
  listResources(
    @Param('module') module: string,
    @Param('resourceType') resourceType: string,
    @Query() query: ListQueryDto,
  ) {
    return this.service.listResources(module, resourceType, query);
  }

  @Get(':module/resources/:resourceType/:id')
  @RequireAnyPermission([...READ])
  getResource(
    @Param('module') module: string,
    @Param('resourceType') resourceType: string,
    @Param('id') id: string,
  ) {
    return this.service.getResource(module, resourceType, id);
  }

  @Post(':module/actions/:action')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  runAction(
    @Param('module') module: string,
    @Param('action') action: string,
    @Body() body: ActionBodyDto,
  ) {
    return this.service.runAction(module, action, body.args ?? []);
  }
}
