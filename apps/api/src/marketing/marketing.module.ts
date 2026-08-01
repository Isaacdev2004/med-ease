import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';

@Module({
  imports: [PrismaModule],
  controllers: [MarketingController],
  providers: [MarketingService],
})
export class MarketingModule {}
