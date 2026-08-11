import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import {
  Public,
  RequireAnyPermission,
} from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMarketingLeadDto } from './dto/create-lead.dto';
import { MarketingService } from './marketing.service';

class ListLeadsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaId?: string;
}

@ApiTags('marketing')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Public()
  @Post('leads')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Capture a marketing CTA lead from the public website',
  })
  createLead(@Body() dto: CreateMarketingLeadDto) {
    return this.marketingService.createLead(dto);
  }

  @Get('leads')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @RequireAnyPermission(['platform.read', 'platform.admin', 'iam.read'])
  @ApiOperation({ summary: 'List marketing / concierge leads for follow-up' })
  listLeads(@Query() query: ListLeadsQueryDto) {
    return this.marketingService.listLeads(query.ctaId);
  }
}
