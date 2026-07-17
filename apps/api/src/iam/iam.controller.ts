import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermission } from '../authorization/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  IamExportDto,
  IamFavoriteDto,
  IamFavoritesQueryDto,
  IamFiltersDto,
  IamSearchQueryDto,
} from './dto/iam-filters.dto';
import {
  AssignRoleDto,
  CreateOAuthClientDto,
  CreatePolicyDto,
  CreateUserDto,
  DelegateAccessDto,
  GrantConsentDto,
  InviteUserDto,
  MfaUserDto,
  RotateApiKeyDto,
  ShareIamDto,
  StartBreakGlassDto,
  IamScopeQueryDto,
} from './dto/iam-input.dto';
import { IamService } from './iam.service';

@ApiTags('iam')
@ApiBearerAuth()
@Controller('iam')
@UseGuards(JwtAuthGuard)
export class IamController {
  constructor(@Inject(IamService) private readonly iamService: IamService) {}

  @Get('dashboard')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'IAM dashboard metrics' })
  dashboard(@Query() query: IamScopeQueryDto) {
    return this.iamService.dashboard(query.tenantId);
  }

  @Get('analytics')
  @RequirePermission('iam.analytics')
  @ApiOperation({ summary: 'IAM analytics metrics' })
  analytics(@Query() query: IamScopeQueryDto) {
    return this.iamService.analytics(query.tenantId);
  }

  @Get('users')
  @RequirePermission('iam.users')
  @ApiOperation({ summary: 'List IAM users' })
  getUsers(@Query() filters: IamFiltersDto) {
    return this.iamService.getUsers(filters);
  }

  @Get('users/:id')
  @RequirePermission('iam.users')
  @ApiOperation({ summary: 'Get IAM user by id' })
  @ApiParam({ name: 'id', required: true })
  getUser(@Param('id') userId: string) {
    return this.iamService.getUser(userId);
  }

  @Get('tenants')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'List tenants' })
  getTenants(@Query() filters: IamFiltersDto) {
    return this.iamService.getTenants(filters);
  }

  @Get('organizations')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'List organizations' })
  getOrganizations(@Query() filters: IamFiltersDto) {
    return this.iamService.getOrganizations(filters);
  }

  @Get('roles')
  @RequirePermission('iam.roles')
  @ApiOperation({ summary: 'List IAM roles' })
  getRoles(@Query() filters: IamFiltersDto) {
    return this.iamService.getRoles(filters);
  }

  @Get('permissions')
  @RequirePermission('iam.permissions')
  @ApiOperation({ summary: 'List IAM permissions catalog' })
  getPermissions(@Query() filters: IamFiltersDto) {
    return this.iamService.getPermissions(filters);
  }

  @Get('policies')
  @RequirePermission('iam.policies')
  @ApiOperation({ summary: 'List IAM policies' })
  getPolicies(@Query() filters: IamFiltersDto) {
    return this.iamService.getPolicies(filters);
  }

  @Get('sessions')
  @RequirePermission('iam.sessions')
  @ApiOperation({ summary: 'List user sessions' })
  getSessions(@Query() filters: IamFiltersDto) {
    return this.iamService.getSessions(filters);
  }

  @Get('login-history')
  @RequirePermission('iam.audit')
  @ApiOperation({ summary: 'List login history' })
  getLoginHistory(@Query() filters: IamFiltersDto) {
    return this.iamService.getLoginHistory(filters);
  }

  @Get('mfa-devices')
  @RequirePermission('iam.mfa')
  @ApiOperation({ summary: 'List MFA devices' })
  getMfaDevices(@Query() filters: IamFiltersDto) {
    return this.iamService.getMfaDevices(filters);
  }

  @Get('trusted-devices')
  @RequirePermission('iam.mfa')
  @ApiOperation({ summary: 'List trusted devices' })
  getTrustedDevices(@Query() filters: IamFiltersDto) {
    return this.iamService.getTrustedDevices(filters);
  }

  @Get('oauth-clients')
  @RequirePermission('iam.oauth')
  @ApiOperation({ summary: 'List OAuth clients' })
  getOauthClients(@Query() filters: IamFiltersDto) {
    return this.iamService.getOauthClients(filters);
  }

  @Get('api-keys')
  @RequirePermission('iam.apiKeys')
  @ApiOperation({ summary: 'List API keys' })
  getApiKeys(@Query() filters: IamFiltersDto) {
    return this.iamService.getApiKeys(filters);
  }

  @Get('consents')
  @RequirePermission('iam.consent')
  @ApiOperation({ summary: 'List consent records' })
  getConsents(@Query() filters: IamFiltersDto) {
    return this.iamService.getConsents(filters);
  }

  @Get('delegations')
  @RequirePermission('iam.users')
  @ApiOperation({ summary: 'List delegations' })
  getDelegations(@Query() filters: IamFiltersDto) {
    return this.iamService.getDelegations(filters);
  }

  @Get('proxy-access')
  @RequirePermission('iam.consent')
  @ApiOperation({ summary: 'List proxy access records' })
  getProxyAccess(@Query() filters: IamFiltersDto) {
    return this.iamService.getProxyAccess(filters);
  }

  @Get('break-glass')
  @RequirePermission('iam.breakGlass')
  @ApiOperation({ summary: 'List break-glass events' })
  getBreakGlass(@Query() filters: IamFiltersDto) {
    return this.iamService.getBreakGlass(filters);
  }

  @Get('audit-events')
  @RequirePermission('iam.audit')
  @ApiOperation({ summary: 'List IAM audit events' })
  getAuditEvents(@Query() filters: IamFiltersDto) {
    return this.iamService.getAuditEvents(filters);
  }

  @Get('security-incidents')
  @RequirePermission('iam.audit')
  @ApiOperation({ summary: 'List security incidents' })
  getSecurityIncidents(@Query() filters: IamFiltersDto) {
    return this.iamService.getSecurityIncidents(filters);
  }

  @Get('risk-scores')
  @RequirePermission('iam.analytics')
  @ApiOperation({ summary: 'List risk scores' })
  getRiskScores(@Query() filters: IamFiltersDto) {
    return this.iamService.getRiskScores(filters);
  }

  @Get('saml-providers')
  @RequirePermission('iam.sso')
  @ApiOperation({ summary: 'List SAML providers' })
  getSamlProviders(@Query() filters: IamFiltersDto) {
    return this.iamService.getSamlProviders(filters);
  }

  @Get('oidc-providers')
  @RequirePermission('iam.sso')
  @ApiOperation({ summary: 'List OIDC providers' })
  getOidcProviders(@Query() filters: IamFiltersDto) {
    return this.iamService.getOidcProviders(filters);
  }

  @Post('users')
  @RequirePermission('iam.write')
  @ApiOperation({ summary: 'Create IAM user' })
  createUser(@Body() input: CreateUserDto) {
    return this.iamService.createUser(input);
  }

  @Post('users/invite')
  @RequirePermission('iam.write')
  @ApiOperation({ summary: 'Invite IAM user' })
  inviteUser(@Body() input: InviteUserDto) {
    return this.iamService.inviteUser(input);
  }

  @Post('users/:id/lock')
  @RequirePermission('iam.write')
  @ApiOperation({ summary: 'Lock user account' })
  @ApiParam({ name: 'id', required: true })
  lockAccount(@Param('id') userId: string) {
    return this.iamService.lockAccount(userId);
  }

  @Post('users/:id/unlock')
  @RequirePermission('iam.write')
  @ApiOperation({ summary: 'Unlock user account' })
  @ApiParam({ name: 'id', required: true })
  unlockAccount(@Param('id') userId: string) {
    return this.iamService.unlockAccount(userId);
  }

  @Post('users/assign-role')
  @RequirePermission('iam.roles')
  @ApiOperation({ summary: 'Assign role to user' })
  assignRole(@Body() input: AssignRoleDto) {
    return this.iamService.assignRole(input);
  }

  @Post('users/remove-role')
  @RequirePermission('iam.roles')
  @ApiOperation({ summary: 'Remove role from user' })
  removeRole(@Body() input: AssignRoleDto) {
    return this.iamService.removeRole(input);
  }

  @Post('policies')
  @RequirePermission('iam.policies')
  @ApiOperation({ summary: 'Create IAM policy' })
  createPolicy(@Body() input: CreatePolicyDto) {
    return this.iamService.createPolicy(input);
  }

  @Post('mfa/enable')
  @RequirePermission('iam.mfa')
  @ApiOperation({ summary: 'Enable MFA for user' })
  enableMfa(@Body() input: MfaUserDto) {
    return this.iamService.enableMfa(input.userId);
  }

  @Post('mfa/disable')
  @RequirePermission('iam.mfa')
  @ApiOperation({ summary: 'Disable MFA for user' })
  disableMfa(@Body() input: MfaUserDto) {
    return this.iamService.disableMfa(input.userId);
  }

  @Post('sessions/:id/revoke')
  @RequirePermission('iam.sessions')
  @ApiOperation({ summary: 'Revoke user session' })
  @ApiParam({ name: 'id', required: true })
  revokeSession(@Param('id') sessionId: string) {
    return this.iamService.revokeSession({ sessionId });
  }

  @Post('oauth-clients')
  @RequirePermission('iam.oauth')
  @ApiOperation({ summary: 'Create OAuth client' })
  createOAuthClient(@Body() input: CreateOAuthClientDto) {
    return this.iamService.createOAuthClient(input.name, input.tenantId);
  }

  @Post('api-keys/rotate')
  @RequirePermission('iam.apiKeys')
  @ApiOperation({ summary: 'Rotate API key' })
  rotateApiKey(@Body() input: RotateApiKeyDto) {
    return this.iamService.rotateApiKey(input.keyId);
  }

  @Post('consents')
  @RequirePermission('iam.consent')
  @ApiOperation({ summary: 'Grant consent' })
  grantConsent(@Body() input: GrantConsentDto) {
    return this.iamService.grantConsent(input);
  }

  @Post('consents/:id/revoke')
  @RequirePermission('iam.consent')
  @ApiOperation({ summary: 'Revoke consent' })
  @ApiParam({ name: 'id', required: true })
  revokeConsent(@Param('id') consentId: string) {
    return this.iamService.revokeConsent(consentId);
  }

  @Post('delegations')
  @RequirePermission('iam.users')
  @ApiOperation({ summary: 'Delegate access' })
  delegateAccess(@Body() input: DelegateAccessDto) {
    return this.iamService.delegateAccess(input);
  }

  @Post('break-glass/start')
  @RequirePermission('iam.breakGlass')
  @ApiOperation({ summary: 'Start break-glass event' })
  startBreakGlass(@Body() input: StartBreakGlassDto) {
    return this.iamService.startBreakGlass(input);
  }

  @Post('break-glass/:id/end')
  @RequirePermission('iam.breakGlass')
  @ApiOperation({ summary: 'End break-glass event' })
  @ApiParam({ name: 'id', required: true })
  endBreakGlass(@Param('id') eventId: string) {
    return this.iamService.endBreakGlass({ eventId });
  }

  @Get('search')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'Search IAM users and policies' })
  search(@Query() query: IamSearchQueryDto) {
    return this.iamService.search(query.q, query.tenantId);
  }

  @Post('export')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'Export IAM data' })
  exportData(@Body() input: IamExportDto) {
    return this.iamService.exportData(input.format);
  }

  @Post('favorites')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'Favorite IAM entity' })
  favorite(@Body() input: IamFavoriteDto) {
    return this.iamService.favorite(
      input.userId,
      input.entityType,
      input.entityId,
    );
  }

  @Get('favorites')
  @RequirePermission('iam.read')
  @ApiOperation({ summary: 'List IAM favorites' })
  getFavorites(@Query() query: IamFavoritesQueryDto) {
    return this.iamService.getFavorites(query.userId);
  }

  @Post('share')
  @RequirePermission('iam.write')
  @ApiOperation({ summary: 'Share IAM entity' })
  share(@Body() input: ShareIamDto) {
    return this.iamService.share(input);
  }
}
