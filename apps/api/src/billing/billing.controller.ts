import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RequireAnyPermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiErrorResponseDto,
  ApproveClaimBodyDto,
  BillingFiltersDto,
  CreateInvoiceBodyDto,
  DashboardQueryDto,
  DenyClaimBodyDto,
  InsuranceClaimDto,
  InsuranceQueryDto,
  OutstandingQueryDto,
  PatientInvoiceDto,
  PaymentDto,
  RecordPaymentBodyDto,
  RefundPaymentBodyDto,
  SubmitClaimBodyDto,
  UpdateInvoiceBodyDto,
} from './dto/billing.dto';
import { BillingService } from './billing.service';

const READ = ['billing.read', 'patients.read'] as const;
const WRITE = ['billing.write'] as const;
const CLAIMS = ['billing.claims', 'billing.write'] as const;
const PAYMENTS = ['billing.payments', 'billing.write'] as const;

const ERRORS = {
  badRequest: {
    description: 'Validation failed',
    type: () => ApiErrorResponseDto,
  },
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

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(
    @Inject(BillingService)
    private readonly billingService: BillingService,
  ) {}

  @Get('dashboard')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Billing dashboard metrics' })
  @ApiUnauthorizedResponse(ERRORS.unauthorized)
  @ApiForbiddenResponse(ERRORS.forbidden)
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.billingService.getDashboard(
      query.patientId,
      query.providerId,
      query.facilityId,
    );
  }

  @Get('invoices')
  @RequireAnyPermission([...READ])
  @ApiOperation({ summary: 'Search patient invoices (paginated)' })
  searchInvoices(@Query() filters: BillingFiltersDto) {
    return this.billingService.searchInvoices(filters);
  }

  @Get('invoices/:invoiceId')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'invoiceId', format: 'uuid' })
  @ApiOkResponse({ type: () => PatientInvoiceDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getInvoice(@Param('invoiceId') invoiceId: string) {
    return this.billingService.getInvoice(invoiceId);
  }

  @Post('invoices')
  @RequireAnyPermission([...WRITE])
  @ApiCreatedResponse({ type: () => PatientInvoiceDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  createInvoice(@Body() body: CreateInvoiceBodyDto) {
    return this.billingService.createInvoice(body);
  }

  @Patch('invoices/:invoiceId')
  @RequireAnyPermission([...WRITE])
  @ApiParam({ name: 'invoiceId', format: 'uuid' })
  @ApiOkResponse({ type: () => PatientInvoiceDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  updateInvoice(
    @Param('invoiceId') invoiceId: string,
    @Body() body: UpdateInvoiceBodyDto,
  ) {
    return this.billingService.updateInvoice({ invoiceId, ...body });
  }

  @Delete('invoices/:invoiceId')
  @RequireAnyPermission([...WRITE])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'invoiceId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  deleteInvoice(@Param('invoiceId') invoiceId: string) {
    return this.billingService.deleteInvoice(invoiceId);
  }

  @Get('invoices/:invoiceId/timeline')
  @RequireAnyPermission([...READ])
  @ApiParam({ name: 'invoiceId', format: 'uuid' })
  getPaymentTimeline(@Param('invoiceId') invoiceId: string) {
    return this.billingService.getPaymentTimeline(invoiceId);
  }

  @Get('claims')
  @RequireAnyPermission([...READ, ...CLAIMS])
  @ApiOperation({ summary: 'Search insurance claims (paginated)' })
  searchClaims(@Query() filters: BillingFiltersDto) {
    return this.billingService.searchClaims(filters);
  }

  @Get('claims/:claimId')
  @RequireAnyPermission([...READ, ...CLAIMS])
  @ApiParam({ name: 'claimId', format: 'uuid' })
  @ApiOkResponse({ type: () => InsuranceClaimDto })
  @ApiNotFoundResponse(ERRORS.notFound)
  getClaim(@Param('claimId') claimId: string) {
    return this.billingService.getClaim(claimId);
  }

  @Post('claims')
  @RequireAnyPermission([...CLAIMS])
  @ApiCreatedResponse({ type: () => InsuranceClaimDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  submitClaim(@Body() body: SubmitClaimBodyDto) {
    return this.billingService.submitClaim(body);
  }

  @Post('claims/:claimId/approve')
  @RequireAnyPermission([...CLAIMS])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'claimId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  approveClaim(
    @Param('claimId') claimId: string,
    @Body() body: ApproveClaimBodyDto,
  ) {
    return this.billingService.approveClaim(claimId, body.approvedAmount);
  }

  @Post('claims/:claimId/deny')
  @RequireAnyPermission([...CLAIMS])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'claimId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  denyClaim(
    @Param('claimId') claimId: string,
    @Body() body: DenyClaimBodyDto,
  ) {
    return this.billingService.denyClaim(claimId, body.reason);
  }

  @Post('claims/:claimId/resubmit')
  @RequireAnyPermission([...CLAIMS])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'claimId', format: 'uuid' })
  @ApiNotFoundResponse(ERRORS.notFound)
  resubmitClaim(@Param('claimId') claimId: string) {
    return this.billingService.resubmitClaim(claimId);
  }

  @Get('payments')
  @RequireAnyPermission([...READ, ...PAYMENTS])
  getPayments(@Query() filters: BillingFiltersDto) {
    return this.billingService.getPayments(filters);
  }

  @Post('payments')
  @RequireAnyPermission([...PAYMENTS])
  @ApiCreatedResponse({ type: () => PaymentDto })
  @ApiBadRequestResponse(ERRORS.badRequest)
  recordPayment(@Body() body: RecordPaymentBodyDto) {
    return this.billingService.recordPayment(body);
  }

  @Post('refunds')
  @RequireAnyPermission([...PAYMENTS])
  @ApiCreatedResponse({ description: 'Refund recorded' })
  @ApiBadRequestResponse(ERRORS.badRequest)
  refundPayment(@Body() body: RefundPaymentBodyDto) {
    return this.billingService.refundPayment(body);
  }

  @Get('receipts')
  @RequireAnyPermission([...READ])
  getReceipts(@Query() filters: BillingFiltersDto) {
    return this.billingService.getReceipts(filters);
  }

  @Get('refunds')
  @RequireAnyPermission([...READ, ...PAYMENTS])
  getRefunds(@Query() filters: BillingFiltersDto) {
    return this.billingService.getRefunds(filters);
  }

  @Get('insurance')
  @RequireAnyPermission([...READ])
  getInsurance(@Query() query: InsuranceQueryDto) {
    return this.billingService.getInsurance(query.patientId);
  }

  @Get('outstanding')
  @RequireAnyPermission([...READ])
  getOutstandingBalances(@Query() query: OutstandingQueryDto) {
    return this.billingService.getOutstandingBalances(query.patientId);
  }
}
