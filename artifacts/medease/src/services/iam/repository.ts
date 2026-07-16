import {
  getIamControllerAnalyticsUrl,
  getIamControllerAssignRoleUrl,
  getIamControllerCreateOAuthClientUrl,
  getIamControllerCreatePolicyUrl,
  getIamControllerCreateUserUrl,
  getIamControllerDashboardUrl,
  getIamControllerDelegateAccessUrl,
  getIamControllerDisableMfaUrl,
  getIamControllerEnableMfaUrl,
  getIamControllerEndBreakGlassUrl,
  getIamControllerExportDataUrl,
  getIamControllerFavoriteUrl,
  getIamControllerGetApiKeysUrl,
  getIamControllerGetAuditEventsUrl,
  getIamControllerGetBreakGlassUrl,
  getIamControllerGetConsentsUrl,
  getIamControllerGetDelegationsUrl,
  getIamControllerGetFavoritesUrl,
  getIamControllerGetLoginHistoryUrl,
  getIamControllerGetMfaDevicesUrl,
  getIamControllerGetOauthClientsUrl,
  getIamControllerGetOidcProvidersUrl,
  getIamControllerGetOrganizationsUrl,
  getIamControllerGetPermissionsUrl,
  getIamControllerGetPoliciesUrl,
  getIamControllerGetProxyAccessUrl,
  getIamControllerGetRiskScoresUrl,
  getIamControllerGetRolesUrl,
  getIamControllerGetSamlProvidersUrl,
  getIamControllerGetSecurityIncidentsUrl,
  getIamControllerGetSessionsUrl,
  getIamControllerGetTenantsUrl,
  getIamControllerGetTrustedDevicesUrl,
  getIamControllerGetUserUrl,
  getIamControllerGetUsersUrl,
  getIamControllerGrantConsentUrl,
  getIamControllerInviteUserUrl,
  getIamControllerLockAccountUrl,
  getIamControllerRemoveRoleUrl,
  getIamControllerRevokeConsentUrl,
  getIamControllerRevokeSessionUrl,
  getIamControllerRotateApiKeyUrl,
  getIamControllerSearchUrl,
  getIamControllerShareUrl,
  getIamControllerStartBreakGlassUrl,
  getIamControllerUnlockAccountUrl,
} from '@workspace/api-client-react';
import { httpTransport } from '@workspace/repository-transport';
import type { IamRepositoryContract } from '@medease/iam-contract';

import {
  filtersToQuery,
  mapAnalyticsDto,
  mapApiKeyDto,
  mapAuditDto,
  mapBreakGlassDto,
  mapConsentDto,
  mapDashboardDto,
  mapDelegationDto,
  mapExportResultDto,
  mapFavoriteDto,
  mapLoginAttemptDto,
  mapMfaDeviceDto,
  mapOAuthClientDto,
  mapOidcProviderDto,
  mapOrganizationDto,
  mapPaginatedDto,
  mapPermissionDto,
  mapPolicyDto,
  mapProxyAccessDto,
  mapRiskScoreDto,
  mapRoleDto,
  mapSamlProviderDto,
  mapSearchResultDto,
  mapSecurityIncidentDto,
  mapSessionDto,
  mapShareResultDto,
  mapTenantDto,
  mapTrustedDeviceDto,
  mapUserDto,
} from '@/services/iam/dto-mappers';
import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
  IamFavorite,
  IamFilters,
  InviteUserInput,
  RevokeSessionInput,
  ShareIamInput,
  StartBreakGlassInput,
} from '@/services/iam/types';

class IamRepository implements IamRepositoryContract {
  private readonly transport = httpTransport;

  async dashboard(tenantId?: string) {
    const dto = await this.transport.get(getIamControllerDashboardUrl(), {
      query: tenantId ? { tenantId } : undefined,
    });
    return mapDashboardDto(dto);
  }

  async analytics(tenantId?: string) {
    const dto = await this.transport.get(getIamControllerAnalyticsUrl(), {
      query: tenantId ? { tenantId } : undefined,
    });
    return mapAnalyticsDto(dto);
  }

  async getUsers(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetUsersUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapUserDto);
  }

  async getUser(userId: string) {
    const dto = await this.transport.get(getIamControllerGetUserUrl(userId));
    return mapUserDto(dto);
  }

  async getTenants(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetTenantsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapTenantDto);
  }

  async getOrganizations(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetOrganizationsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapOrganizationDto);
  }

  async getRoles(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetRolesUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapRoleDto);
  }

  async getPermissions(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetPermissionsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapPermissionDto);
  }

  async getPolicies(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetPoliciesUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapPolicyDto);
  }

  async getSessions(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetSessionsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapSessionDto);
  }

  async getLoginHistory(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetLoginHistoryUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapLoginAttemptDto);
  }

  async getMfaDevices(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetMfaDevicesUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapMfaDeviceDto);
  }

  async getTrustedDevices(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetTrustedDevicesUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapTrustedDeviceDto);
  }

  async getOauthClients(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetOauthClientsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapOAuthClientDto);
  }

  async getApiKeys(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetApiKeysUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapApiKeyDto);
  }

  async getConsents(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetConsentsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapConsentDto);
  }

  async getDelegations(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetDelegationsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapDelegationDto);
  }

  async getProxyAccess(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetProxyAccessUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapProxyAccessDto);
  }

  async getBreakGlass(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetBreakGlassUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapBreakGlassDto);
  }

  async getAuditEvents(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetAuditEventsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapAuditDto);
  }

  async getSecurityIncidents(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetSecurityIncidentsUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapSecurityIncidentDto);
  }

  async getRiskScores(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetRiskScoresUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapRiskScoreDto);
  }

  async getSamlProviders(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetSamlProvidersUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapSamlProviderDto);
  }

  async getOidcProviders(filters?: IamFilters) {
    const dto = await this.transport.get(getIamControllerGetOidcProvidersUrl(), { query: filtersToQuery(filters) });
    return mapPaginatedDto(dto, mapOidcProviderDto);
  }

  async createUser(input: CreateUserInput) {
    const dto = await this.transport.post(getIamControllerCreateUserUrl(), { body: input });
    return mapUserDto(dto);
  }

  async inviteUser(input: InviteUserInput) {
    const dto = await this.transport.post(getIamControllerInviteUserUrl(), { body: input });
    return mapUserDto(dto);
  }

  async lockAccount(userId: string) {
    const dto = await this.transport.post(getIamControllerLockAccountUrl(userId));
    return mapUserDto(dto);
  }

  async unlockAccount(userId: string) {
    const dto = await this.transport.post(getIamControllerUnlockAccountUrl(userId));
    return mapUserDto(dto);
  }

  async assignRole(input: AssignRoleInput) {
    const dto = await this.transport.post(getIamControllerAssignRoleUrl(), { body: input });
    return mapUserDto(dto);
  }

  async removeRole(input: AssignRoleInput) {
    const dto = await this.transport.post(getIamControllerRemoveRoleUrl(), { body: input });
    return mapUserDto(dto);
  }

  async createPolicy(input: CreatePolicyInput) {
    const dto = await this.transport.post(getIamControllerCreatePolicyUrl(), { body: input });
    return mapPolicyDto(dto);
  }

  async enableMfa(userId: string) {
    const dto = await this.transport.post(getIamControllerEnableMfaUrl(), { body: { userId } });
    return mapUserDto(dto);
  }

  async disableMfa(userId: string) {
    const dto = await this.transport.post(getIamControllerDisableMfaUrl(), { body: { userId } });
    return mapUserDto(dto);
  }

  async revokeSession(input: RevokeSessionInput) {
    const dto = await this.transport.post(getIamControllerRevokeSessionUrl(input.sessionId));
    return mapSessionDto(dto);
  }

  async createOAuthClient(name: string, tenantId: string) {
    const dto = await this.transport.post(getIamControllerCreateOAuthClientUrl(), { body: { name, tenantId } });
    return mapOAuthClientDto(dto);
  }

  async rotateApiKey(keyId: string) {
    const dto = await this.transport.post(getIamControllerRotateApiKeyUrl(), { body: { keyId } });
    return mapApiKeyDto(dto);
  }

  async grantConsent(input: GrantConsentInput) {
    const dto = await this.transport.post(getIamControllerGrantConsentUrl(), { body: input });
    return mapConsentDto(dto);
  }

  async revokeConsent(consentId: string) {
    const dto = await this.transport.post(getIamControllerRevokeConsentUrl(consentId));
    return mapConsentDto(dto);
  }

  async delegateAccess(input: DelegateAccessInput) {
    const dto = await this.transport.post(getIamControllerDelegateAccessUrl(), { body: input });
    return mapDelegationDto(dto);
  }

  async startBreakGlass(input: StartBreakGlassInput) {
    const dto = await this.transport.post(getIamControllerStartBreakGlassUrl(), { body: input });
    return mapBreakGlassDto(dto);
  }

  async endBreakGlass(input: EndBreakGlassInput) {
    const dto = await this.transport.post(getIamControllerEndBreakGlassUrl(input.eventId));
    return mapBreakGlassDto(dto);
  }

  async search(query: string, tenantId?: string) {
    const dto = await this.transport.get(getIamControllerSearchUrl(), {
      query: { q: query, tenantId },
    });
    return mapSearchResultDto(dto);
  }

  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    const dto = await this.transport.post(getIamControllerExportDataUrl(), { body: { format } });
    return mapExportResultDto(dto);
  }

  async favorite(userId: string, entityType: IamFavorite['entityType'], entityId: string) {
    const dto = await this.transport.post(getIamControllerFavoriteUrl(), {
      body: { userId, entityType, entityId },
    });
    return mapFavoriteDto(dto);
  }

  async getFavorites(userId: string) {
    const dto = await this.transport.get(getIamControllerGetFavoritesUrl(), { query: { userId } });
    return Array.isArray(dto) ? dto.map(mapFavoriteDto) : [];
  }

  async share(input: ShareIamInput) {
    const dto = await this.transport.post(getIamControllerShareUrl(), { body: input });
    return mapShareResultDto(dto);
  }
}

export const iamRepository = new IamRepository();
