import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../authorization/decorators/require-permission.decorator';
import { CreateMarketingLeadDto } from './dto/create-lead.dto';
import { MarketingService } from './marketing.service';

@ApiTags('marketing')
@Controller('marketing')
@Public()
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('leads')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a marketing CTA lead from the public website' })
  createLead(@Body() dto: CreateMarketingLeadDto) {
    return this.marketingService.createLead(dto);
  }
}
