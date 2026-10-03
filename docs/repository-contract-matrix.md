# Repository Contract Matrix

**Med-ease Enterprise Healthcare Platform**  
**Purpose:** One-to-one mapping from frozen frontend repositories to NestJS backend modules  
**Source:** `artifacts/medease/src/services/*/repository.ts`  
**Related:** [API Coverage Matrix](./api-coverage-matrix.md) · [Backend Definition of Done](./backend-definition-of-done.md)

---

## Mapping conventions

| Frontend                     | Backend                                                  |
| ---------------------------- | -------------------------------------------------------- |
| `{module}Repository`         | `modules/{module}/repositories/{module}.repository.ts`   |
| `{module}Service` (frontend) | Unchanged — HTTP adapter calls API                       |
| Repository method            | `POST/GET/PATCH/DELETE` endpoint + NestJS service method |
| Controller name              | `{PascalModule}Controller`                               |
| Service name                 | `{PascalModule}Service`                                  |
| NestJS module                | `{PascalModule}Module`                                   |

**Rule:** Every repository public method → exactly one API operation. No orphan endpoints. No missing methods.

---

## Master module map

| #   | Frontend Repository | Export name                   | Backend Module    | Controller                  | Service                  | Repository                  | Phase    |
| --- | ------------------- | ----------------------------- | ----------------- | --------------------------- | ------------------------ | --------------------------- | -------- |
| 1   | patient-records     | `patientRecordRepository`     | PatientRecords    | PatientRecordsController    | PatientRecordsService    | PatientRecordsRepository    | 08.5     |
| 2   | appointments        | `appointmentRepository`       | Appointments      | AppointmentsController      | AppointmentsService      | AppointmentsRepository      | 08.5     |
| 3   | care-plans          | `carePlanRepository`          | CarePlans         | CarePlansController         | CarePlansService         | CarePlansRepository         | 08.5     |
| 4   | medications         | `medicationRepository`        | Medications       | MedicationsController       | MedicationsService       | MedicationsRepository       | 08.5     |
| 5   | laboratory          | `laboratoryRepository`        | Laboratory        | LaboratoryController        | LaboratoryService        | LaboratoryRepository        | 08.5     |
| 6   | radiology           | `radiologyRepository`         | Radiology         | RadiologyController         | RadiologyService         | RadiologyRepository         | 08.5     |
| 7   | patient-monitoring  | `patientMonitoringRepository` | PatientMonitoring | PatientMonitoringController | PatientMonitoringService | PatientMonitoringRepository | 08.5     |
| 8   | telemedicine        | `telemedicineRepository`      | Telemedicine      | TelemedicineController      | TelemedicineService      | TelemedicineRepository      | 08.5     |
| 9   | billing             | `billingRepository`           | Billing           | BillingController           | BillingService           | BillingRepository           | 08.6     |
| 10  | inventory           | `inventoryRepository`         | Inventory         | InventoryController         | InventoryService         | InventoryRepository         | 08.6     |
| 11  | procurement         | `procurementRepository`       | Procurement       | ProcurementController       | ProcurementService       | ProcurementRepository       | 08.6     |
| 12  | workforce           | `workforceRepository`         | Workforce         | WorkforceController         | WorkforceService         | WorkforceRepository         | 08.6     |
| 13  | facilities          | `facilitiesRepository`        | Facilities        | FacilitiesController        | FacilitiesService        | FacilitiesRepository        | 08.6     |
| 14  | finance             | `financeRepository`           | Finance           | FinanceController           | FinanceService           | FinanceRepository           | 08.6     |
| 15  | quality             | `qualityRepository`           | Quality           | QualityController           | QualityService           | QualityRepository           | 08.6     |
| 16  | population-health   | `populationHealthRepository`  | PopulationHealth  | PopulationHealthController  | PopulationHealthService  | PopulationHealthRepository  | 08.7     |
| 17  | cdss                | `cdssRepository`              | Cdss              | CdssController              | CdssService              | CdssRepository              | 08.7     |
| 18  | interoperability    | `interoperabilityRepository`  | Interoperability  | InteroperabilityController  | InteroperabilityService  | InteroperabilityRepository  | 08.7     |
| 19  | research            | `researchRepository`          | Research          | ResearchController          | ResearchService          | ResearchRepository          | 08.7     |
| 20  | public-health       | `publicHealthRepository`      | PublicHealth      | PublicHealthController      | PublicHealthService      | PublicHealthRepository      | 08.7     |
| 21  | ai-intelligence     | `aiIntelligenceRepository`    | AiIntelligence    | AiIntelligenceController    | AiIntelligenceService    | AiIntelligenceRepository    | 08.7     |
| 22  | executive           | `executiveRepository`         | Executive         | ExecutiveController         | ExecutiveService         | ExecutiveRepository         | 08.7     |
| 23  | iam                 | `iamRepository`               | Iam               | IamController               | IamService               | IamRepository               | **08.3** |
| 24  | documents           | `documentRepository`          | Documents         | DocumentsController         | DocumentsService         | DocumentsRepository         | 08.8     |
| 25  | workflows           | `workflowRepository`          | Workflows         | WorkflowsController         | WorkflowsService         | WorkflowsRepository         | 08.8     |
| 26  | messaging           | `messagingRepository`         | Messaging         | MessagingController         | MessagingService         | MessagingRepository         | 08.8     |
| 27  | reporting           | `reportingRepository`         | Reporting         | ReportingController         | ReportingService         | ReportingRepository         | 08.8     |
| 28  | api-platform        | `apiPlatformRepository`       | ApiPlatform       | ApiPlatformController       | ApiPlatformService       | ApiPlatformRepository       | 08.8     |
| 29  | platform-admin      | `platformAdminRepository`     | PlatformAdmin     | PlatformAdminController     | PlatformAdminService     | PlatformAdminRepository     | 08.8     |

### Tier 2 (no repository.ts — separate contracts)

| Frontend service       | Backend module | Phase |
| ---------------------- | -------------- | ----- |
| auth/demo-auth-service | Auth           | 08.3  |
| medical-library        | MedicalLibrary | 08.8  |
| directory              | Directory      | 08.8  |
| notifications          | Notifications  | 08.4  |

---

## Method inventory by repository

Methods extracted from frontend `repository.ts` files. Backend must implement **all** listed methods.

### patient-records (`patientRecordRepository`) — 4 methods

| Method                       | HTTP (proposed)               | Notes                    |
| ---------------------------- | ----------------------------- | ------------------------ |
| `getAll()`                   | `GET /patient-records`        | Full records (clinician) |
| `getById(patientId)`         | `GET /patient-records/{id}`   |                          |
| `search(filters)`            | `GET /patient-records/search` | Paginated demographics   |
| `update(patientId, updater)` | `PATCH /patient-records/{id}` | Optimistic lock          |

### appointments (`appointmentRepository`) — 14 methods

| Method                        | HTTP (proposed)                      |
| ----------------------------- | ------------------------------------ |
| `search(filters)`             | `GET /appointments`                  |
| `getAll(filters)`             | `GET /appointments/all`              |
| `getById(id)`                 | `GET /appointments/{id}`             |
| `getUpcoming(filters)`        | `GET /appointments/upcoming`         |
| `getPast(filters)`            | `GET /appointments/past`             |
| `getToday(filters)`           | `GET /appointments/today`            |
| `getTelemedicine(filters)`    | `GET /appointments/telemedicine`     |
| `book(input)`                 | `POST /appointments`                 |
| `reschedule(id, scheduledAt)` | `POST /appointments/{id}/reschedule` |
| `cancel(id)`                  | `POST /appointments/{id}/cancel`     |
| `checkIn(id)`                 | `POST /appointments/{id}/check-in`   |
| `getWaitlist()`               | `GET /appointments/waitlist`         |
| `getQueue(filters)`           | `GET /appointments/queue`            |

### care-plans (`carePlanRepository`) — 16 methods

`listPlans`, `getAllPlans`, `getPlan`, `getActivePlan`, `getGoals`, `getTasks`, `getTeam`, `getRisks`, `getTimeline`, `getPathways`, `getPathway`, `getActivity`, `createPlan`, `updateGoal`, `completeTask`, `assignTask`, `suspendPlan`, `archivePlan`

### medications (`medicationRepository`) — 22 methods

`listMedications`, `getAllMedications`, `getMedication`, `getPrescription`, `listPrescriptions`, `getSchedule`, `getLogs`, `getReminders`, `getRefills`, `getInteractions`, `getAdministrations`, `getDispenses`, `getCourses`, `getEducation`, `getFavorites`, `toggleFavorite`, `getTimeline`, `getPharmacyQueue`, `dispense`, `administer`, `markReminderDone`, `exportMedications`, `shareMedication`, `search`

### laboratory (`laboratoryRepository`) — 28 methods

`listOrders`, `getAllOrders`, `getOrder`, `listResults`, `getAllResults`, `getResult`, `getObservationsForReport`, `getObservations`, `getSpecimens`, `getAlerts`, `getCriticalAlerts`, `getPendingResults`, `getMicrobiology`, `getPathology`, `getBloodBank`, `getInstruments`, `getTechnologists`, `getQualityControl`, `getQualityDashboard`, `getFavorites`, `toggleFavorite`, `approveResult`, `uploadResult`, `exportResult`, `shareResult`, `getTimeline`, `getTestCatalog`, `createOrder`, `cancelOrder`, `verifyResult`, `releaseResult`, `collectSpecimen`, `search`

### radiology (`radiologyRepository`) — 24 methods

`listStudies`, `getAllStudies`, `getStudy`, `getReport`, `getReportByStudy`, `getAllReports`, `getPendingReports`, `getCriticalReports`, `getUnreadReports`, `getTimeline`, `getComparison`, `getRadiologists`, `getDevices`, `getAnnotations`, `getMeasurements`, `getFavorites`, `completeInterpretation`, `approveReport`, `addAnnotation`, `deleteAnnotation`, `addMeasurement`, `toggleFavorite`, `shareStudy`, `exportStudy`, `archiveStudy`, `search`

### patient-monitoring (`patientMonitoringRepository`) — 18 methods

`getDashboard`, `listVitals`, `listObservations`, `getObservation`, `listAlerts`, `resolveAlert`, `dismissAlert`, `acknowledgeAlert`, `getTimeline`, `listDevices`, `getDevice`, `assignDevice`, `syncDevice`, `listRPMPrograms`, `removeRPM`, `getTrendAnalysis`, `getEarlyWarningScores`, `getSessions`, `getHistory`, `getFavorites`, `toggleFavorite`

### telemedicine (`telemedicineRepository`) — 24 methods

`searchSessions`, `getSession`, `getParticipants`, `inviteParticipant`, `removeParticipant`, `getMessages`, `sendMessage`, `uploadFile`, `getAttachments`, `recordSession`, `stopRecording`, `saveClinicalNote`, `getClinicalNotes`, `getWaitingRoom`, `admitWaitingRoom`, `rejectWaitingRoom`, `getRecordings`, `generateTranscript`, `getDashboard`, `getTimeline`, `getProviderAvailability`, `getWhiteboard`, `toggleParticipantMedia`, `toggleScreenShare`, `search`, `toggleFavorite`, `getFavorites`

### billing (`billingRepository`) — 20 methods

`searchInvoices`, `getInvoice`, `createInvoice`, `updateInvoice`, `deleteInvoice`, `searchClaims`, `getClaim`, `submitClaim`, `approveClaim`, `denyClaim`, `resubmitClaim`, `refundPayment`, `getPayments`, `getReceipts`, `getInsurance`, `getRefunds`, `getDashboard`, `getOutstandingBalances`, `getPaymentTimeline`, `favoriteInvoice`, `shareInvoice`, `downloadInvoice`, `search`

### inventory (`inventoryRepository`) — 22 methods

`searchInventory`, `getInventoryItem`, `createInventoryItem`, `updateInventory`, `deleteInventory`, `receiveStock`, `issueStock`, `transferStock`, `adjustInventory`, `getStockMovements`, `getPurchaseOrders`, `createPurchaseOrder`, `approvePurchaseOrder`, `receivePurchaseOrder`, `getSuppliers`, `getWarehouses`, `getAssets`, `getTransfers`, `getExpiryAlerts`, `getCycleCounts`, `getDashboard`, `scanBarcode`, `generateBarcode`, `forecastDemand`, `favoriteItem`, `search`

### procurement (`procurementRepository`) — 28 methods

`searchRequests`, `getRequest`, `createRequisition`, `approveRequest`, `rejectRequest`, `searchOrders`, `getOrder`, `createPO`, `approvePO`, `receiveGoods`, `cancelOrder`, `closeOrder`, `searchRFQs`, `createRFQ`, `awardRFQ`, `searchSuppliers`, `getSupplier`, `searchContracts`, `getBudgets`, `searchReceiving`, `searchInvoices`, `createInvoice`, `matchInvoice`, `approveInvoice`, `searchDeliveries`, `getShipments`, `getApprovalQueue`, `dashboard`, `analytics`, `spendAnalysis`, `supplierPerformance`, `forecast`, `search`, `favorite`, `getFavorites`, `archiveRequest`

### workforce (`workforceRepository`) — 24 methods

`searchEmployees`, `getEmployee`, `createEmployee`, `updateEmployee`, `getDepartments`, `getSchedules`, `assignShift`, `getRoster`, `getAttendance`, `clock`, `getLeaveRequests`, `createLeaveRequest`, `approveLeave`, `rejectLeave`, `getTraining`, `assignTraining`, `getPerformance`, `getCredentials`, `renewCredential`, `getPayroll`, `getOnCall`, `getOrganization`, `dashboard`, `analytics`, `coverage`, `search`, `exportData`, `favorite`, `getFavorites`, `archiveEmployee`

### facilities (`facilitiesRepository`) — 28 methods

`listFacilities`, `getFacility`, `getBuildings`, `getRooms`, `getBeds`, `getEquipment`, `getBiomedicalDevices`, `getWorkOrders`, `getPreventiveMaintenance`, `getCalibration`, `getInspections`, `getUtilities`, `getEnvironmental`, `getVendors`, `getContracts`, `getVehicles`, `getSensors`, `createMaintenanceRequest`, `assignWorkOrder`, `completeWorkOrder`, `schedulePreventive`, `recordCalibration`, `recordInspection`, `reportIncident`, `updateEquipment`, `archiveEquipment`, `dashboard`, `analytics`, `search`, `exportData`, `favorite`, `getFavorites`, `listBeds`

### finance (`financeRepository`) — 32 methods

`getChartOfAccounts`, `getJournalEntries`, `getJournal`, `getLedger`, `getTrialBalance`, `getFiscalPeriods`, `getAccountsPayable`, `getAccountsReceivable`, `getCashAccounts`, `getBankAccounts`, `getBudgets`, `getBudgetVariance`, `getFixedAssets`, `getDepreciation`, `getFinancialStatements`, `createJournal`, `approveJournal`, `postJournal`, `reverseJournal`, `createBudget`, `approveBudget`, `createVendorBill`, `recordPayment`, `reconcileBank`, `createAsset`, `disposeAsset`, `dashboard`, `analytics`, `revenueAnalytics`, `expenseAnalytics`, `apAging`, `arAging`, `cashForecast`, `threeWayMatch`, `search`, `exportData`, `favorite`, `getFavorites`, `archiveJournal`

### quality (`qualityRepository`) — 26 methods

`getIncidents`, `getIncident`, `getRisks`, `getRiskRegister`, `getCapa`, `getAudits`, `getInspections`, `getPolicies`, `getDocuments`, `getAccreditation`, `getCompliance`, `getInfectionControl`, `getQualityIndicators`, `createIncident`, `escalateIncident`, `createRisk`, `updateRisk`, `createCapa`, `closeCapa`, `scheduleAudit`, `uploadEvidence`, `publishPolicy`, `archivePolicy`, `getRootCauseAnalyses`, `dashboard`, `analytics`, `accreditationGaps`, `accreditationFrameworkScores`, `search`, `exportData`, `favorite`, `getFavorites`, `openFindingsTotal`

### population-health — 16 methods | cdss — 22 methods | interoperability — 24 methods | research — 24 methods | public-health — 24 methods | ai-intelligence — 24 methods | executive — 22 methods

_(Full method lists mirror repository.ts — implement 1:1 per module)_

### iam (`iamRepository`) — 38 methods — **Phase 08.3 first domain module**

| Method                           | HTTP (proposed)                  |
| -------------------------------- | -------------------------------- |
| `dashboard(tenantId?)`           | `GET /iam/dashboard`             |
| `analytics(tenantId?)`           | `GET /iam/analytics`             |
| `getUsers(filters?)`             | `GET /iam/users`                 |
| `getUser(userId)`                | `GET /iam/users/{id}`            |
| `getTenants(filters?)`           | `GET /iam/tenants`               |
| `getOrganizations(filters?)`     | `GET /iam/organizations`         |
| `getRoles(filters?)`             | `GET /iam/roles`                 |
| `getPermissions(filters?)`       | `GET /iam/permissions`           |
| `getPolicies(filters?)`          | `GET /iam/policies`              |
| `getSessions(filters?)`          | `GET /iam/sessions`              |
| `getLoginHistory(filters?)`      | `GET /iam/login-history`         |
| `getMfaDevices(filters?)`        | `GET /iam/mfa-devices`           |
| `getTrustedDevices(filters?)`    | `GET /iam/trusted-devices`       |
| `getOauthClients(filters?)`      | `GET /iam/oauth-clients`         |
| `getApiKeys(filters?)`           | `GET /iam/api-keys`              |
| `getConsents(filters?)`          | `GET /iam/consents`              |
| `getDelegations(filters?)`       | `GET /iam/delegations`           |
| `getProxyAccess(filters?)`       | `GET /iam/proxy-access`          |
| `getBreakGlass(filters?)`        | `GET /iam/break-glass`           |
| `getAuditEvents(filters?)`       | `GET /iam/audit-events`          |
| `getSecurityIncidents(filters?)` | `GET /iam/security-incidents`    |
| `getRiskScores(filters?)`        | `GET /iam/risk-scores`           |
| `getSamlProviders(filters?)`     | `GET /iam/saml-providers`        |
| `getOidcProviders(filters?)`     | `GET /iam/oidc-providers`        |
| `createUser(input)`              | `POST /iam/users`                |
| `inviteUser(input)`              | `POST /iam/users/invite`         |
| `lockAccount(userId)`            | `POST /iam/users/{id}/lock`      |
| `unlockAccount(userId)`          | `POST /iam/users/{id}/unlock`    |
| `assignRole(input)`              | `POST /iam/users/assign-role`    |
| `removeRole(input)`              | `POST /iam/users/remove-role`    |
| `createPolicy(input)`            | `POST /iam/policies`             |
| `enableMfa(input)`               | `POST /iam/mfa/enable`           |
| `disableMfa(input)`              | `POST /iam/mfa/disable`          |
| `revokeSession(sessionId)`       | `POST /iam/sessions/{id}/revoke` |
| `createOAuthClient(input)`       | `POST /iam/oauth-clients`        |
| `rotateApiKey(input)`            | `POST /iam/api-keys/rotate`      |
| `grantConsent(input)`            | `POST /iam/consents`             |
| `revokeConsent(consentId)`       | `POST /iam/consents/{id}/revoke` |
| `delegateAccess(input)`          | `POST /iam/delegations`          |
| `startBreakGlass(input)`         | `POST /iam/break-glass/start`    |
| `endBreakGlass(sessionId)`       | `POST /iam/break-glass/{id}/end` |
| `search(query, filters?)`        | `GET /iam/search`                |
| `exportData(format)`             | `POST /iam/export`               |
| `favorite(...)`                  | `POST /iam/favorites`            |
| `getFavorites(userId)`           | `GET /iam/favorites`             |
| `share(input)`                   | `POST /iam/share`                |

### documents — 34 methods | workflows — 30 methods | messaging — 26 methods | reporting — 26 methods | api-platform — 24 methods | platform-admin — 36 methods

_(Full 1:1 mapping required — see repository.ts files)_

---

## Cross-cutting repository patterns

Most modules implement these optional methods — backend should use consistent routes:

| Pattern   | Methods                                 | Route pattern                  |
| --------- | --------------------------------------- | ------------------------------ |
| Dashboard | `dashboard(scopeId?)`                   | `GET /{module}/dashboard`      |
| Analytics | `analytics(scopeId?)`                   | `GET /{module}/analytics`      |
| Search    | `search(q, filters?)`                   | `GET /{module}/search`         |
| Export    | `exportData(format)`                    | `POST /{module}/export`        |
| Favorites | `favorite(...)`, `getFavorites(userId)` | `POST/GET /{module}/favorites` |
| Share     | `share(input)`                          | `POST /{module}/share`         |

---

## Verification

```bash
# Future CI script: compare frontend repository exports vs OpenAPI operationIds
pnpm run verify:repository-contracts
```

Contract is satisfied when: `frontend_methods == openapi_operations == nestjs_controller_handlers`
