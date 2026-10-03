# Canonical Entity Registry

**Med-ease Enterprise Healthcare Platform**  
**Version:** 1.0 (Architecture Freeze)  
**Source of truth for:** Table names, bounded contexts, frontend type mapping, FHIR resources  
**Related:** [08.2 Enterprise Data Model](./08.2-enterprise-data-model.md) · [Data Dictionary](./data-dictionary.md)

Each entity appears **once**. Junction/version/audit child tables reference parent entities.

---

## Legend

| Column            | Meaning                                                           |
| ----------------- | ----------------------------------------------------------------- |
| **Entity**        | Domain name (PascalCase)                                          |
| **Context**       | Bounded context / PostgreSQL schema                               |
| **Table**         | Physical table (`schema.table`)                                   |
| **Frontend Type** | Primary TypeScript interface in `artifacts/medease/src/services/` |
| **FHIR**          | FHIR R4/R4B resource (interchange; not storage format)            |
| **Aggregate**     | Root entity if part of an aggregate                               |

---

## Shared Kernel (`core`)

| Entity             | Context | Table                       | Frontend Type                                          | FHIR                       | Aggregate |
| ------------------ | ------- | --------------------------- | ------------------------------------------------------ | -------------------------- | --------- |
| Tenant             | Core    | `core.tenants`              | platform-admin.Tenant                                  | Organization (tenant root) | ✓         |
| Organization       | Core    | `core.organizations`        | iam.IamOrganization                                    | Organization               | ✓         |
| Hospital           | Core    | `core.hospitals`            | platform-admin.Hospital                                | Organization               |           |
| Facility           | Core    | `core.facilities`           | platform-admin.FacilityConfig, facilities.FacilitySite | Organization + Location    | ✓         |
| Department         | Core    | `core.departments`          | platform-admin.Department, workforce.Department        | Location                   |           |
| User               | Core    | `core.users`                | iam.IamUser                                            | Practitioner / Person      | ✓         |
| Patient            | Core    | `core.patients`             | patient-records.PatientDemographics                    | Patient                    | ✓         |
| Provider           | Core    | `core.providers`            | appointments (provider), workforce bridge              | Practitioner               | ✓         |
| Permission         | Core    | `core.permissions`          | config/permissions                                     | —                          |           |
| Role               | Core    | `core.roles`                | iam.IamRole                                            | —                          | ✓         |
| RolePermission     | Core    | `core.role_permissions`     | — (junction)                                           | —                          |           |
| UserRole           | Core    | `core.user_roles`           | — (junction)                                           | —                          |           |
| UserSession        | Core    | `core.user_sessions`        | iam.IamSession                                         | —                          |           |
| MfaDevice          | Core    | `core.mfa_devices`          | iam.MfaDevice                                          | —                          |           |
| TrustedDevice      | Core    | `core.trusted_devices`      | iam.TrustedDevice                                      | —                          |           |
| ApiKey             | Core    | `core.api_keys`             | iam.ApiKey, api-platform.ApiKey                        | —                          |           |
| OAuthClient        | Core    | `core.oauth_clients`        | iam.OAuthClient, api-platform.OAuthApp                 | —                          |           |
| ConsentRecord      | Core    | `core.consent_records`      | iam.ConsentRecord                                      | Consent                    |           |
| DelegationRecord   | Core    | `core.delegation_records`   | iam.DelegationRecord                                   | —                          |           |
| ProxyAccess        | Core    | `core.proxy_access`         | iam.ProxyAccess                                        | RelatedPerson              |           |
| BreakGlassEvent    | Core    | `core.break_glass_events`   | iam.BreakGlassEvent                                    | —                          |           |
| FeatureFlag        | Core    | `core.feature_flags`        | platform-admin.FeatureFlagConfig                       | —                          |           |
| TenantLocalization | Core    | `core.tenant_localizations` | platform-admin.Localization                            | —                          |           |
| TenantBranding     | Core    | `core.tenant_branding`      | platform-admin.BrandingConfig                          | —                          |           |
| License            | Core    | `core.licenses`             | platform-admin.License                                 | —                          |           |
| Subscription       | Core    | `core.subscriptions`        | platform-admin.Subscription                            | —                          |           |

---

## Clinical (`clinical`)

| Entity                   | Context  | Table                                 | Frontend Type                              | FHIR                     | Aggregate |
| ------------------------ | -------- | ------------------------------------- | ------------------------------------------ | ------------------------ | --------- |
| PatientAllergy           | Clinical | `clinical.patient_allergies`          | patient-records.Allergy                    | AllergyIntolerance       |           |
| PatientImmunization      | Clinical | `clinical.patient_immunizations`      | patient-records.Immunization               | Immunization             |           |
| VitalReading             | Clinical | `clinical.patient_vitals`             | patient-records.VitalReading               | Observation              |           |
| Encounter                | Clinical | `clinical.encounters`                 | patient-records.Encounter                  | Encounter                | ✓         |
| ClinicalNote             | Clinical | `clinical.clinical_notes`             | patient-records.ClinicalNote               | DocumentReference        |           |
| PatientProblem           | Clinical | `clinical.patient_problems`           | patient-records (conditions)               | Condition                |           |
| ProcedureRecord          | Clinical | `clinical.patient_procedures`         | patient-records.ProcedureRecord            | Procedure                |           |
| ClinicalDocument         | Clinical | `clinical.clinical_documents`         | patient-records.ClinicalDocument           | DocumentReference        |           |
| ClinicalAlert            | Clinical | `clinical.clinical_alerts`            | patient-records.ClinicalAlert              | DetectedIssue            |           |
| TimelineEntry            | Clinical | `clinical.patient_timeline_entries`   | patient-records.TimelineEntry              | —                        |           |
| Appointment              | Clinical | `clinical.appointments`               | appointments.Appointment                   | Appointment              | ✓         |
| WaitlistEntry            | Clinical | `clinical.appointment_waitlist`       | appointments.WaitlistEntry                 | —                        |           |
| QueueEntry               | Clinical | `clinical.appointment_queue`          | appointments.QueueEntry                    | —                        |           |
| ProviderAvailability     | Clinical | `clinical.provider_availability`      | appointments.ProviderAvailability          | Schedule                 |           |
| TimeSlot                 | Clinical | `clinical.time_slots`                 | appointments.TimeSlot                      | Slot                     |           |
| CalendarEvent            | Clinical | `clinical.calendar_events`            | appointments.CalendarEvent                 | —                        |           |
| CarePlan                 | Clinical | `clinical.care_plans`                 | care-plans.CarePlan                        | CarePlan                 | ✓         |
| CareGoal                 | Clinical | `clinical.care_goals`                 | care-plans.CareGoal                        | Goal                     |           |
| CareTask                 | Clinical | `clinical.care_tasks`                 | care-plans.CareTask                        | Task                     |           |
| CareTeamMember           | Clinical | `clinical.care_team_members`          | care-plans.CareTeamMember                  | CareTeam                 |           |
| CareRiskAssessment       | Clinical | `clinical.care_risk_assessments`      | care-plans.RiskAssessment                  | RiskAssessment           |           |
| ClinicalPathway          | Clinical | `clinical.clinical_pathways`          | care-plans.ClinicalPathway                 | PlanDefinition           |           |
| MedicationCatalog        | Clinical | `clinical.medication_catalog`         | medications.MedicationIdentity             | Medication               |           |
| Prescription             | Clinical | `clinical.prescriptions`              | medications.Prescription                   | MedicationRequest        | ✓         |
| PatientMedication        | Clinical | `clinical.patient_medications`        | medications.PatientMedication              | MedicationStatement      |           |
| MedicationDose           | Clinical | `clinical.medication_doses`           | medications.ScheduledDose                  | Dosage                   |           |
| DoseLog                  | Clinical | `clinical.dose_logs`                  | medications.DoseLog                        | —                        |           |
| MedicationReminder       | Clinical | `clinical.medication_reminders`       | medications.MedicationReminder             | —                        |           |
| RefillRequest            | Clinical | `clinical.refill_requests`            | medications.RefillRequest                  | —                        |           |
| DrugInteraction          | Clinical | `clinical.drug_interactions`          | medications.DrugInteraction                | DetectedIssue            |           |
| MedicationAdministration | Clinical | `clinical.medication_administrations` | medications.MedicationAdministration       | MedicationAdministration |           |
| MedicationDispense       | Clinical | `clinical.medication_dispenses`       | medications.MedicationDispense             | MedicationDispense       |           |
| LabTestDefinition        | Clinical | `clinical.lab_test_definitions`       | laboratory.LabTestDefinition               | ActivityDefinition       |           |
| LabOrder                 | Clinical | `clinical.lab_orders`                 | laboratory.LabOrder                        | ServiceRequest           | ✓         |
| LabSpecimen              | Clinical | `clinical.lab_specimens`              | laboratory.SpecimenRecord                  | Specimen                 |           |
| LabObservation           | Clinical | `clinical.lab_observations`           | laboratory.LabObservation                  | Observation              |           |
| LabReport                | Clinical | `clinical.lab_reports`                | laboratory.LabDiagnosticReport             | DiagnosticReport         | ✓         |
| LabAlert                 | Clinical | `clinical.lab_alerts`                 | laboratory.LabAlert                        | DetectedIssue            |           |
| CollectionSite           | Clinical | `clinical.collection_sites`           | laboratory.CollectionSite                  | Location                 |           |
| RadiologyStudy           | Clinical | `clinical.radiology_studies`          | radiology.RadiologyStudy                   | ImagingStudy             | ✓         |
| RadiologyOrder           | Clinical | `clinical.radiology_orders`           | radiology.RadiologyOrder                   | ServiceRequest           |           |
| RadiologyReport          | Clinical | `clinical.radiology_reports`          | radiology.DiagnosticReport                 | DiagnosticReport         | ✓         |
| ImagingSeries            | Clinical | `clinical.imaging_series`             | radiology.ImagingSeries                    | —                        |           |
| ImagingInstance          | Clinical | `clinical.imaging_instances`          | radiology.ImagingInstance                  | —                        |           |
| ImagingDevice            | Clinical | `clinical.imaging_devices`            | radiology.ImagingDevice                    | Device                   |           |
| ImageAnnotation          | Clinical | `clinical.image_annotations`          | radiology.ImageAnnotation                  | —                        |           |
| Observation              | Clinical | `clinical.observations`               | patient-monitoring.Observation             | Observation              |           |
| VitalSign                | Clinical | `clinical.vital_signs`                | patient-monitoring.VitalSign               | Observation              |           |
| MonitoringDevice         | Clinical | `clinical.monitoring_devices`         | patient-monitoring.MonitoringDevice        | Device                   |           |
| DeviceAssignment         | Clinical | `clinical.device_assignments`         | patient-monitoring.DeviceAssignment        | DeviceUseStatement       |           |
| DeviceReading            | Clinical | `clinical.device_readings`            | patient-monitoring.DeviceReading           | Observation              |           |
| MonitoringSession        | Clinical | `clinical.monitoring_sessions`        | patient-monitoring.MonitoringSession       | —                        |           |
| MonitoringProgram        | Clinical | `clinical.monitoring_programs`        | patient-monitoring.RemoteMonitoringProgram | EpisodeOfCare            |           |
| MonitoringAlert          | Clinical | `clinical.monitoring_alerts`          | patient-monitoring.MonitoringAlert         | DetectedIssue            |           |
| AlertRule                | Clinical | `clinical.alert_rules`                | patient-monitoring.AlertRule               | —                        |           |
| EarlyWarningScore        | Clinical | `clinical.early_warning_scores`       | patient-monitoring (EWS)                   | Observation              |           |
| TelemedicineSession      | Clinical | `clinical.telemedicine_sessions`      | telemedicine.TelemedicineSession           | Encounter                | ✓         |
| SessionParticipant       | Clinical | `clinical.session_participants`       | telemedicine.VideoParticipant              | —                        |           |
| SessionMessage           | Clinical | `clinical.session_messages`           | telemedicine.ChatMessage                   | Communication            |           |
| SessionAttachment        | Clinical | `clinical.session_attachments`        | telemedicine.SessionAttachment             | DocumentReference        |           |
| SessionRecording         | Clinical | `clinical.session_recordings`         | telemedicine.SessionRecording              | —                        |           |
| WaitingRoomEntry         | Clinical | `clinical.waiting_room_entries`       | telemedicine.WaitingRoomEntry              | —                        |           |
| CdssRule                 | Clinical | `clinical.cdss_rules`                 | cdss.ClinicalRule                          | ActivityDefinition       |           |
| CdssAlert                | Clinical | `clinical.cdss_alerts`                | cdss.ClinicalAlert                         | DetectedIssue            |           |
| CdssRecommendation       | Clinical | `clinical.cdss_recommendations`       | cdss.ClinicalRecommendation                | GuidanceResponse         |           |
| CdssGuideline            | Clinical | `clinical.cdss_guidelines`            | cdss.Guideline                             | PlanDefinition           |           |
| CdssOrderSet             | Clinical | `clinical.cdss_order_sets`            | cdss.OrderSet                              | RequestGroup             |           |
| CdssIntervention         | Clinical | `clinical.cdss_interventions`         | cdss.CDSIntervention                       | —                        |           |
| CdssAlertOverride        | Clinical | `clinical.cdss_alert_overrides`       | cdss.AlertOverride                         | —                        |           |

---

## Operations (`operations`)

| Entity             | Context    | Table                             | Frontend Type                                      | FHIR              | Aggregate |
| ------------------ | ---------- | --------------------------------- | -------------------------------------------------- | ----------------- | --------- |
| Campus             | Operations | `operations.campuses`             | facilities.Campus                                  | Location          |           |
| Building           | Operations | `operations.buildings`            | facilities.Building                                | Location          |           |
| Floor              | Operations | `operations.floors`               | facilities.Floor                                   | Location          |           |
| Room               | Operations | `operations.rooms`                | facilities.Room                                    | Location          |           |
| Bed                | Operations | `operations.beds`                 | facilities.Bed                                     | Location          | ✓         |
| MedicalEquipment   | Operations | `operations.medical_equipment`    | facilities.MedicalEquipment                        | Device            |           |
| MaintenanceRequest | Operations | `operations.maintenance_requests` | facilities.MaintenanceRequest                      | —                 |           |
| WorkOrder          | Operations | `operations.work_orders`          | facilities.WorkOrder                               | —                 | ✓         |
| ServiceContract    | Operations | `operations.service_contracts`    | facilities.ServiceContract                         | Contract          |           |
| Employee           | Operations | `operations.employees`            | workforce.Employee                                 | PractitionerRole  | ✓         |
| Team               | Operations | `operations.teams`                | workforce.Team                                     | —                 |           |
| Shift              | Operations | `operations.shifts`               | workforce.Shift                                    | —                 |           |
| LeaveRequest       | Operations | `operations.leave_requests`       | workforce.LeaveRequest                             | —                 |           |
| AttendanceRecord   | Operations | `operations.attendance_records`   | workforce.Attendance                               | —                 |           |
| Timesheet          | Operations | `operations.timesheets`           | workforce.Timesheet                                | —                 |           |
| TrainingRecord     | Operations | `operations.training_records`     | workforce.Training                                 | —                 |           |
| PerformanceReview  | Operations | `operations.performance_reviews`  | workforce.PerformanceReview                        | —                 |           |
| OnCallSchedule     | Operations | `operations.on_call_schedules`    | workforce.OnCallSchedule                           | —                 |           |
| ProviderAssignment | Operations | `operations.provider_assignments` | workforce.ProviderAssignment                       | —                 |           |
| InventoryItem      | Operations | `operations.inventory_items`      | inventory.InventoryItem                            | SupplyItem        | ✓         |
| MedicalAsset       | Operations | `operations.medical_assets`       | inventory.MedicalAsset                             | Device            |           |
| Supplier           | Operations | `operations.suppliers`            | inventory.Supplier, procurement.Supplier           | Organization      |           |
| Warehouse          | Operations | `operations.warehouses`           | inventory.Warehouse                                | Location          |           |
| StockMovement      | Operations | `operations.stock_movements`      | inventory.StockMovement                            | SupplyDelivery    |           |
| StockTransfer      | Operations | `operations.stock_transfers`      | inventory.StockTransfer                            | —                 |           |
| CostCenter         | Operations | `operations.cost_centers`         | procurement.CostCenter                             | —                 |           |
| Budget             | Operations | `operations.budgets`              | procurement.Budget                                 | —                 |           |
| PurchaseRequest    | Operations | `operations.purchase_requests`    | procurement.PurchaseRequest                        | —                 |           |
| Rfq                | Operations | `operations.rfqs`                 | procurement.RFQ                                    | —                 |           |
| PurchaseOrder      | Operations | `operations.purchase_orders`      | procurement.PurchaseOrder, inventory.PurchaseOrder | SupplyRequest     | ✓         |
| GoodsReceipt       | Operations | `operations.goods_receipts`       | procurement.GoodsReceipt                           | SupplyDelivery    |           |
| ProcurementInvoice | Operations | `operations.procurement_invoices` | procurement.ProcurementInvoice                     | Invoice           |           |
| Contract           | Operations | `operations.contracts`            | procurement.Contract                               | Contract          |           |
| IncidentReport     | Operations | `operations.incident_reports`     | quality.IncidentReport                             | AdverseEvent      | ✓         |
| Risk               | Operations | `operations.risks`                | quality.Risk                                       | RiskAssessment    |           |
| CapaRecord         | Operations | `operations.capa_records`         | quality.CapaRecord                                 | —                 |           |
| QualityAudit       | Operations | `operations.audit_records`        | quality.AuditRecord                                | —                 |           |
| PolicyDocument     | Operations | `operations.policy_documents`     | quality.PolicyDocument                             | DocumentReference |           |
| InfectionRecord    | Operations | `operations.infection_records`    | quality.InfectionRecord                            | Condition         |           |
| QualityIndicator   | Operations | `operations.quality_indicators`   | quality.QualityIndicator                           | Measure           |           |

---

## Financial (`financial`)

| Entity             | Context   | Table                            | Frontend Type              | FHIR            | Aggregate |
| ------------------ | --------- | -------------------------------- | -------------------------- | --------------- | --------- |
| PatientInvoice     | Financial | `financial.patient_invoices`     | billing.PatientInvoice     | Invoice / Claim | ✓         |
| InvoiceLineItem    | Financial | `financial.invoice_line_items`   | billing.InvoiceLineItem    | —               |           |
| InsuranceClaim     | Financial | `financial.insurance_claims`     | billing.InsuranceClaim     | Claim           | ✓         |
| Payment            | Financial | `financial.payments`             | billing.Payment            | PaymentNotice   |           |
| Receipt            | Financial | `financial.receipts`             | billing.Receipt            | —               |           |
| Refund             | Financial | `financial.refunds`              | billing.Refund             | —               |           |
| InsurancePolicy    | Financial | `financial.insurance_policies`   | billing.InsurancePolicy    | Coverage        |           |
| ChartOfAccount     | Financial | `financial.chart_of_accounts`    | finance.ChartOfAccount     | —               |           |
| JournalEntry       | Financial | `financial.journal_entries`      | finance.JournalEntry       | —               | ✓         |
| FiscalPeriod       | Financial | `financial.fiscal_periods`       | finance.FiscalPeriod       | —               |           |
| VendorBill         | Financial | `financial.vendor_bills`         | finance.VendorBill         | Invoice         |           |
| CustomerReceivable | Financial | `financial.customer_receivables` | finance.CustomerReceivable | Account         |           |
| BankAccount        | Financial | `financial.bank_accounts`        | finance.BankAccount        | —               |           |
| FinanceBudget      | Financial | `financial.budgets_finance`      | finance.Budget             | —               |           |
| FixedAsset         | Financial | `financial.fixed_assets`         | finance.FixedAsset         | —               |           |
| DepreciationEntry  | Financial | `financial.depreciation_entries` | finance.DepreciationEntry  | —               |           |

---

## Population (`population`)

| Entity                | Context    | Table                                | Frontend Type                       | FHIR            | Aggregate |
| --------------------- | ---------- | ------------------------------------ | ----------------------------------- | --------------- | --------- |
| PopulationMember      | Population | `population.population_members`      | population-health.PopulationMember  | Group member    |           |
| DiseaseRegistry       | Population | `population.disease_registries`      | population-health.DiseaseRegistry   | Measure         |           |
| CareGap               | Population | `population.care_gaps`               | population-health.CareGap           | —               |           |
| PopulationRiskScore   | Population | `population.population_risk_scores`  | population-health.RiskScore         | RiskAssessment  |           |
| PatientCohort         | Population | `population.patient_cohorts`         | population-health.PatientCohort     | Group           |           |
| ChronicProgram        | Population | `population.chronic_programs`        | population-health.ChronicProgram    | EpisodeOfCare   |           |
| OutreachCampaign      | Population | `population.outreach_campaigns`      | population-health.OutreachCampaign  | —               |           |
| CommunityMember       | Population | `population.community_members`       | public-health.CommunityMember       | —               |           |
| DiseaseCase           | Population | `population.disease_cases`           | public-health.DiseaseCase           | Condition       |           |
| OutbreakInvestigation | Population | `population.outbreak_investigations` | public-health.OutbreakInvestigation | —               |           |
| ContactTracingRecord  | Population | `population.contact_tracing_records` | public-health.ContactTracingRecord  | —               |           |
| ImmunizationRecordPh  | Population | `population.immunization_records_ph` | public-health.ImmunizationRecord    | Immunization    |           |
| ClinicalTrial         | Population | `population.clinical_trials`         | research.ClinicalTrial              | ResearchStudy   | ✓         |
| TrialParticipant      | Population | `population.trial_participants`      | research.ResearchParticipant        | ResearchSubject |           |
| StudyVisit            | Population | `population.study_visits`            | research.StudyVisit                 | —               |           |
| AdverseEvent          | Population | `population.adverse_events`          | research.AdverseEvent               | AdverseEvent    |           |
| TrialConsent          | Population | `population.trial_consents`          | research.ConsentRecord              | Consent         |           |

---

## Intelligence (`intelligence`)

| Entity              | Context      | Table                                | Frontend Type                      | FHIR              | Aggregate |
| ------------------- | ------------ | ------------------------------------ | ---------------------------------- | ----------------- | --------- |
| AiPrediction        | Intelligence | `intelligence.ai_predictions`        | ai-intelligence.AiPrediction       | —                 |           |
| AiRiskAssessment    | Intelligence | `intelligence.ai_risk_assessments`   | ai-intelligence.RiskAssessment     | RiskAssessment    |           |
| CopilotSession      | Intelligence | `intelligence.copilot_sessions`      | ai-intelligence.CopilotSession     | —                 |           |
| ClinicalSummary     | Intelligence | `intelligence.clinical_summaries`    | ai-intelligence.ClinicalSummary    | DocumentReference |           |
| ModelVersion        | Intelligence | `intelligence.model_versions`        | ai-intelligence.ModelVersion       | —                 |           |
| ModelEvaluation     | Intelligence | `intelligence.model_evaluations`     | ai-intelligence.ModelEvaluation    | —                 |           |
| EnterpriseKpi       | Intelligence | `intelligence.enterprise_kpis`       | executive.EnterpriseKpi            | Measure           |           |
| ExecutiveDashboard  | Intelligence | `intelligence.executive_dashboards`  | executive.ExecutiveDashboardConfig | —                 |           |
| OperationalMetric   | Intelligence | `intelligence.operational_metrics`   | executive.OperationalMetric        | Measure           |           |
| StrategicInitiative | Intelligence | `intelligence.strategic_initiatives` | executive.StrategicInitiative      | —                 |           |
| CapacitySnapshot    | Intelligence | `intelligence.capacity_snapshots`    | executive.CapacitySnapshot         | —                 |           |

---

## Platform (`platform`)

| Entity             | Context  | Table                           | Frontend Type                   | FHIR                | Aggregate |
| ------------------ | -------- | ------------------------------- | ------------------------------- | ------------------- | --------- |
| Document           | Platform | `platform.documents`            | documents.Document              | DocumentReference   | ✓         |
| DocumentFolder     | Platform | `platform.document_folders`     | documents.DocumentFolder        | —                   |           |
| DocumentVersion    | Platform | `platform.document_versions`    | documents.DocumentVersion       | —                   |           |
| DocumentSignature  | Platform | `platform.document_signatures`  | documents.DocumentSignature     | —                   |           |
| SignatureRequest   | Platform | `platform.signature_requests`   | documents.SignatureRequest      | —                   |           |
| RetentionPolicy    | Platform | `platform.retention_policies`   | documents.RetentionPolicy       | —                   |           |
| WorkflowDefinition | Platform | `platform.workflow_definitions` | workflows.WorkflowDefinition    | PlanDefinition      | ✓         |
| WorkflowInstance   | Platform | `platform.workflow_instances`   | workflows.WorkflowInstance      | Task / RequestGroup | ✓         |
| WorkflowTask       | Platform | `platform.workflow_tasks`       | workflows.WorkflowTask          | Task                |           |
| WorkflowApproval   | Platform | `platform.workflow_approvals`   | workflows.Approval              | —                   |           |
| WorkflowEvent      | Platform | `platform.workflow_events`      | workflows.WorkflowEvent         | —                   |           |
| Message            | Platform | `platform.messages`             | messaging.Message               | Communication       | ✓         |
| InboxItem          | Platform | `platform.inbox_items`          | messaging.InboxItem             | —                   |           |
| ChatThread         | Platform | `platform.chat_threads`         | messaging.ChatThread            | —                   |           |
| ChatMessage        | Platform | `platform.chat_messages`        | messaging.ChatMessage           | Communication       |           |
| Announcement       | Platform | `platform.announcements`        | messaging.Announcement          | —                   |           |
| MessageTemplate    | Platform | `platform.message_templates`    | messaging.MessageTemplate       | —                   |           |
| Campaign           | Platform | `platform.campaigns`            | messaging.Campaign              | —                   |           |
| DeliveryRecord     | Platform | `platform.delivery_records`     | messaging.DeliveryRecord        | —                   |           |
| ReportDefinition   | Platform | `platform.report_definitions`   | reporting.ReportDefinition      | MeasureReport       | ✓         |
| ReportInstance     | Platform | `platform.report_instances`     | reporting.ReportInstance        | MeasureReport       |           |
| ReportSchedule     | Platform | `platform.report_schedules`     | reporting.ReportSchedule        | —                   |           |
| ApiPartner         | Platform | `platform.api_partners`         | api-platform.ApiPartner         | —                   |           |
| Webhook            | Platform | `platform.webhooks`             | api-platform.Webhook            | Subscription        |           |
| WebhookDelivery    | Platform | `platform.webhook_deliveries`   | api-platform.WebhookDelivery    | —                   |           |
| RateLimitPolicy    | Platform | `platform.rate_limit_policies`  | api-platform.RateLimitPolicy    | —                   |           |
| SandboxEnvironment | Platform | `platform.sandbox_environments` | api-platform.SandboxEnvironment | —                   |           |

---

## Interoperability (`interop`)

| Entity                | Context | Table                              | Frontend Type                        | FHIR                       | Aggregate |
| --------------------- | ------- | ---------------------------------- | ------------------------------------ | -------------------------- | --------- |
| IntegrationEndpoint   | Interop | `interop.integration_endpoints`    | interoperability.IntegrationEndpoint | Endpoint                   |           |
| FhirServer            | Interop | `interop.fhir_servers`             | interoperability.FhirServer          | CapabilityStatement        |           |
| Hl7Message            | Interop | `interop.hl7_messages`             | interoperability.Hl7Message          | MessageHeader (conceptual) |           |
| FhirResource          | Interop | `interop.fhir_resources`           | interoperability.FhirResource        | Any                        |           |
| DicomStudy            | Interop | `interop.dicom_studies`            | interoperability.DicomStudy          | ImagingStudy               |           |
| IntegrationJob        | Interop | `interop.integration_jobs`         | interoperability.IntegrationJob      | —                          |           |
| IntegrationEvent      | Interop | `interop.integration_events`       | interoperability.IntegrationEvent    | —                          |           |
| MappingProfile        | Interop | `interop.mapping_profiles`         | interoperability.MappingProfile      | ConceptMap                 |           |
| TerminologyCodeSystem | Interop | `interop.terminology_code_systems` | interoperability.CodeSystem          | CodeSystem                 |           |

---

## Audit (`audit`) — append-only

| Entity              | Context | Table                          | Frontend Type                                   | FHIR       | Aggregate |
| ------------------- | ------- | ------------------------------ | ----------------------------------------------- | ---------- | --------- |
| AuditLog            | Audit   | `audit.audit_logs`             | iam.IamAuditEvent, platform-admin.PlatformAudit | AuditEvent |           |
| SecurityEvent       | Audit   | `audit.security_events`        | iam (login, break glass)                        | AuditEvent |           |
| DataAccessLog       | Audit   | `audit.data_access_logs`       | documents.AccessLog                             | AuditEvent |           |
| IntegrationAuditLog | Audit   | `audit.integration_audit_logs` | interoperability.AuditLog                       | AuditEvent |           |
| PlatformAuditLog    | Audit   | `audit.platform_audit_logs`    | platform-admin.PlatformAudit                    | AuditEvent |           |

---

## Entity count summary

| Schema       | Entities                                                   |
| ------------ | ---------------------------------------------------------- |
| core         | 26                                                         |
| clinical     | 72                                                         |
| operations   | 38                                                         |
| financial    | 16                                                         |
| population   | 17                                                         |
| intelligence | 11                                                         |
| platform     | 27                                                         |
| interop      | 9                                                          |
| audit        | 5                                                          |
| **Total**    | **221** (+ junction/version tables → ~340 physical tables) |

---

## Maintenance rules

1. **One row per logical entity** — no duplicates across modules
2. **New entity** → add row here before Prisma model
3. **Table rename** → forbidden post-freeze; use ADR
4. **Frontend type change** → requires frontend team approval (frozen)

_Registry version increments on each approved schema change._
