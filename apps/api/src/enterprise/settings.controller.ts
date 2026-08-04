import {
  Body,
  Controller,
  Get,
  Inject,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnterpriseService } from './enterprise.service';

const READ = ['platform.read', 'platform.admin', 'iam.read'] as const;
const WRITE = ['platform.write', 'platform.admin', 'iam.write'] as const;

class PrefsBodyDto {
  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  preferences!: Record<string, unknown>;
}

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    @Inject(EnterpriseService) private readonly service: EnterpriseService,
  ) {}

  @Get('preferences')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Get current user preferences' })
  getPreferences() {
    return this.service.getPreferences();
  }

  @Put('preferences')
  @RequireAnyPermission([...WRITE])
  putPreferences(@Body() body: PrefsBodyDto | Record<string, unknown>) {
    const prefs =
      body && typeof body === 'object' && 'preferences' in body
        ? ((body as PrefsBodyDto).preferences ?? {})
        : (body as Record<string, unknown>);
    return this.service.putPreferences(prefs);
  }
}
