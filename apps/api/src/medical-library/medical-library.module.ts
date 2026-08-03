import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { MedicalLibraryController } from './medical-library.controller';
import { MedicalLibraryRepository } from './medical-library.repository';
import { MedicalLibraryService } from './medical-library.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [MedicalLibraryController],
  providers: [MedicalLibraryRepository, MedicalLibraryService],
  exports: [MedicalLibraryService, MedicalLibraryRepository],
})
export class MedicalLibraryModule {}
