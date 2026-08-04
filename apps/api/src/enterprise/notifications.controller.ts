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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnterpriseService } from './enterprise.service';

const READ = ['platform.read', 'platform.admin', 'iam.read'] as const;
const WRITE = ['platform.write', 'platform.admin', 'iam.write'] as const;

class NotifQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean() unreadOnly?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
}

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @Inject(EnterpriseService) private readonly service: EnterpriseService,
  ) {}

  @Get()
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'List in-app notifications' })
  list(@Query() query: NotifQueryDto) {
    return this.service.listNotifications(query);
  }

  @Post(':id/read')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  markRead(@Param('id') id: string) {
    return this.service.markNotificationRead(id);
  }

  @Post('read-all')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  markAllRead() {
    return this.service.markAllNotificationsRead();
  }
}
