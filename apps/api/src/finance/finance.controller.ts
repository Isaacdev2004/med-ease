import {
  Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength, ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FinanceService } from './finance.service';

const READ = ['finance.read', 'finance.gl'] as const;
const WRITE = ['finance.write', 'finance.gl'] as const;

class FinanceFiltersDto {
  @ApiPropertyOptional() @IsOptional() @IsString() q?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() facilityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() fiscalPeriodId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() accountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountType?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) pageSize?: number;
}

class JournalLineBodyDto {
  @ApiProperty() @IsUUID() accountId!: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) debit!: number;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) credit!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

class CreateJournalBodyDto {
  @ApiProperty() @IsString() @MinLength(1) description!: string;
  @ApiProperty() @IsString() entryDate!: string;
  @ApiProperty() @IsUUID() fiscalPeriodId!: string;
  @ApiProperty({ type: [JournalLineBodyDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => JournalLineBodyDto) lines!: JournalLineBodyDto[];
  @ApiPropertyOptional() @IsOptional() @IsUUID() facilityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceModule?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceRef?: string;
}

@ApiTags('finance')
@ApiBearerAuth()
@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(@Inject(FinanceService) private readonly financeService: FinanceService) {}

  @Get('dashboard') @RequireAnyPermission([...READ]) @ApiOperation({ summary: 'GL dashboard' })
  getDashboard(@Query('facilityId') facilityId?: string) {
    return this.financeService.getDashboard(facilityId);
  }

  @Get('accounts') @RequireAnyPermission([...READ])
  getAccounts(@Query() filters: FinanceFiltersDto) {
    return this.financeService.getChartOfAccounts(filters as never);
  }

  @Get('journals') @RequireAnyPermission([...READ])
  getJournals(@Query() filters: FinanceFiltersDto) {
    return this.financeService.getJournalEntries(filters as never);
  }

  @Get('journals/:journalId') @RequireAnyPermission([...READ]) @ApiParam({ name: 'journalId' })
  getJournal(@Param('journalId') journalId: string) {
    return this.financeService.getJournal(journalId);
  }

  @Post('journals') @RequireAnyPermission([...WRITE])
  createJournal(@Body() body: CreateJournalBodyDto) {
    return this.financeService.createJournal(body);
  }

  @Post('journals/:journalId/approve') @RequireAnyPermission([...WRITE]) @HttpCode(HttpStatus.OK)
  approveJournal(@Param('journalId') journalId: string) {
    return this.financeService.approveJournal(journalId);
  }

  @Post('journals/:journalId/post') @RequireAnyPermission([...WRITE]) @HttpCode(HttpStatus.OK)
  postJournal(@Param('journalId') journalId: string) {
    return this.financeService.postJournal(journalId);
  }

  @Get('periods') @RequireAnyPermission([...READ])
  getPeriods() {
    return this.financeService.getFiscalPeriods();
  }

  @Get('trial-balance') @RequireAnyPermission([...READ])
  getTrialBalance(@Query('facilityId') facilityId?: string) {
    return this.financeService.getTrialBalance(facilityId);
  }

  @Get('ledger') @RequireAnyPermission([...READ])
  getLedger(@Query() filters: FinanceFiltersDto) {
    return this.financeService.getLedger(filters as never);
  }
}
