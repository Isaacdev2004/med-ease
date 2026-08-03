import type { QueryParams } from '@workspace/repository-transport';
import type {
  LabCategory,
  LabDiagnosticReport,
  LabObservation,
  LabOrder,
  LabOrderFilters,
  LabOrderPriority,
  LabOrderStatus,
  LabResultFilters,
  LabResultStatus,
  LabTestDefinition,
  ResultFlag,
  SpecimenEvent,
  SpecimenRecord,
  SpecimenStatus,
  CollectionMethod,
} from '@/services/laboratory/types';

export type LabOrderListResult = {
  items: LabOrder[];
  total: number;
  page: number;
  pageSize: number;
};

export type LabResultListResult = {
  items: LabDiagnosticReport[];
  total: number;
  page: number;
  pageSize: number;
};

export type LabResultDetail = {
  report: LabDiagnosticReport;
  observations: LabObservation[];
};

export function labOrderFiltersToQuery(
  filters?: LabOrderFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    status: filters.status,
    priority: filters.priority,
    category: filters.category,
    facilityId: filters.facilityId,
    laboratoryId: filters.laboratoryId,
    carePlanId: filters.carePlanId,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function labResultFiltersToQuery(
  filters?: LabResultFilters & { patientId?: string },
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    status: filters.status,
    category: filters.category,
    flag: filters.flag,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function mapLabOrder(dto: unknown): LabOrder {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    orderNumber: asString(row.orderNumber),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    orderingPhysician: asString(row.orderingPhysician),
    orderingPhysicianId: asString(row.orderingPhysicianId),
    facilityId: asString(row.facilityId),
    facilityName: asString(row.facilityName),
    department: asString(row.department),
    laboratoryId: asString(row.laboratoryId),
    laboratoryName: asString(row.laboratoryName),
    priority: asString(row.priority, 'routine') as LabOrderPriority,
    status: asString(row.status, 'pending') as LabOrderStatus,
    collectionMethod: asString(
      row.collectionMethod,
      'in_clinic',
    ) as CollectionMethod,
    clinicalIndication: asString(row.clinicalIndication),
    diagnosis: asOptionalString(row.diagnosis),
    carePlanId: asOptionalString(row.carePlanId),
    appointmentId: asOptionalString(row.appointmentId),
    testIds: asStringArray(row.testIds),
    testNames: asStringArray(row.testNames),
    notes: asOptionalString(row.notes),
    isRecurring: asBoolean(row.isRecurring),
    isStanding: asBoolean(row.isStanding),
    scheduledAt: asOptionalString(row.scheduledAt),
    collectedAt: asOptionalString(row.collectedAt),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapLabOrderArray(dto: unknown): LabOrder[] {
  return Array.isArray(dto) ? dto.map(mapLabOrder) : [];
}

export function mapPaginatedLabOrders(dto: unknown): LabOrderListResult {
  const row = asRecord(dto);
  return {
    items: mapLabOrderArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapLabObservation(dto: unknown): LabObservation {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    reportId: asString(row.reportId),
    orderId: asString(row.orderId),
    patientId: asString(row.patientId),
    testId: asString(row.testId),
    testName: asString(row.testName),
    loincCode: asString(row.loincCode),
    category: asString(row.category, 'custom') as LabCategory,
    value: asString(row.value),
    numericValue: asOptionalNumber(row.numericValue),
    unit: asString(row.unit),
    referenceRange: asString(row.referenceRange),
    flag: asString(row.flag, 'normal') as ResultFlag,
    interpretation: asOptionalString(row.interpretation),
    patientFriendlyText: asOptionalString(row.patientFriendlyText),
    collectedAt: asString(row.collectedAt),
    resultedAt: asOptionalString(row.resultedAt),
  };
}

export function mapLabObservationArray(dto: unknown): LabObservation[] {
  return Array.isArray(dto) ? dto.map(mapLabObservation) : [];
}

export function mapLabDiagnosticReport(dto: unknown): LabDiagnosticReport {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    orderId: asString(row.orderId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    reportNumber: asString(row.reportNumber),
    status: asString(row.status, 'pending') as LabResultStatus,
    category: asString(row.category, 'custom') as LabCategory,
    title: asString(row.title),
    summary: asOptionalString(row.summary),
    observationIds: asStringArray(row.observationIds),
    verifiedBy: asOptionalString(row.verifiedBy),
    approvedBy: asOptionalString(row.approvedBy),
    digitalSignature: asOptionalString(row.digitalSignature),
    technologistId: asOptionalString(row.technologistId),
    technologistName: asOptionalString(row.technologistName),
    releasedAt: asOptionalString(row.releasedAt),
    correctedAt: asOptionalString(row.correctedAt),
    attachments: asStringArray(row.attachments),
    comments: asOptionalString(row.comments),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapLabDiagnosticReportArray(
  dto: unknown,
): LabDiagnosticReport[] {
  return Array.isArray(dto) ? dto.map(mapLabDiagnosticReport) : [];
}

export function mapPaginatedLabResults(dto: unknown): LabResultListResult {
  const row = asRecord(dto);
  return {
    items: mapLabDiagnosticReportArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapResultDetail(dto: unknown): LabResultDetail {
  const row = asRecord(dto);
  if (row.report != null) {
    return {
      report: mapLabDiagnosticReport(row.report),
      observations: mapLabObservationArray(row.observations),
    };
  }
  return {
    report: mapLabDiagnosticReport(row),
    observations: mapLabObservationArray(row.observations),
  };
}

function mapSpecimenEvent(dto: unknown): SpecimenEvent {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    timestamp: asString(row.timestamp),
    status: asString(row.status, 'pending') as SpecimenStatus,
    actor: asString(row.actor),
    notes: asOptionalString(row.notes),
  };
}

export function mapSpecimenRecord(dto: unknown): SpecimenRecord {
  const row = asRecord(dto);
  const chain = Array.isArray(row.chainOfCustody) ? row.chainOfCustody : [];
  return {
    id: asString(row.id),
    orderId: asString(row.orderId),
    patientId: asString(row.patientId),
    barcode: asString(row.barcode),
    qrCode: asString(row.qrCode),
    specimenType: asString(row.specimenType),
    status: asString(row.status, 'pending') as SpecimenStatus,
    collectedBy: asOptionalString(row.collectedBy),
    collectedAt: asOptionalString(row.collectedAt),
    receivedAt: asOptionalString(row.receivedAt),
    temperature: asOptionalString(row.temperature),
    storageLocation: asOptionalString(row.storageLocation),
    rejectionReason: asOptionalString(row.rejectionReason),
    chainOfCustody: chain.map(mapSpecimenEvent),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapSpecimenRecordArray(dto: unknown): SpecimenRecord[] {
  return Array.isArray(dto) ? dto.map(mapSpecimenRecord) : [];
}

export function mapLabTestDefinition(dto: unknown): LabTestDefinition {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    loincCode: asString(row.loincCode),
    name: asString(row.name),
    category: asString(row.category, 'custom') as LabCategory,
    description: asString(row.description),
    preparation: asOptionalString(row.preparation),
    specimenType: asString(row.specimenType),
    tubeType: asString(row.tubeType),
    collectionInstructions: asString(row.collectionInstructions),
    normalRange: asString(row.normalRange),
    criticalRange: asOptionalString(row.criticalRange),
    referenceRange: asString(row.referenceRange),
    units: asString(row.units),
    turnaroundHours: asNumber(row.turnaroundHours),
    costPlaceholder: asOptionalNumber(row.costPlaceholder),
    clinicalNotes: asOptionalString(row.clinicalNotes),
  };
}

export function mapLabTestDefinitionArray(dto: unknown): LabTestDefinition[] {
  return Array.isArray(dto) ? dto.map(mapLabTestDefinition) : [];
}
