import { Global, Module } from '@nestjs/common';

import { MedeaseConfigService } from './config.service';

@Global()
@Module({
  providers: [MedeaseConfigService],
  exports: [MedeaseConfigService],
})
export class MedeaseConfigModule {}
