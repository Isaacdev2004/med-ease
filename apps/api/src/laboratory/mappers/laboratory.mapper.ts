import type {
  CollectionMethod,
  LabCategory,
  LabDiagnosticReport,
  LabObservation,
  LabOrder,
  LabOrderPriority,
  LabOrderStatus,
  LabResultStatus,
  LabTestDefinition,
  ResultFlag,
  SpecimenEvent,
  SpecimenRecord,
  SpecimenStatus,
} from '@medease/laboratory-contract';
import type { Prisma } from '@medease/prisma';

const CATALOG: LabTestDefinition[] = [
  {
    id: 't-hgb',
    loincCode: '718-7',
    name: 'Hemoglobin',
    category: 'hematology',
    description: 'Blood hemoglobin concentration',
    specimenType: 'Whole blood',
    tubeType: 'EDTA',
    collectionInstructions: 'Standard venipuncture',
    normalRange: '12–16 g/dL',
    referenceRange: '12–16 g/dL',
    units: 'g/dL',
    turnaroundHours: 4,
  },
  {
    id: 't-wbc',
    loincCode: '6690-2',
    name: 'White blood cell count',
    category: 'hematology',
    description: 'Leukocyte count',
    specimenType: 'Whole blood',
    tubeType: 'EDTA',
    collectionInstructions: 'Standard venipuncture',
    normalRange: '4.0–11.0 x10^9/L',
    referenceRange: '4.0–11.0 x10^9/L',
    units: 'x10^9/L',
    turnaroundHours: 4,
  },
  {
    id: 't-glucose',
    loincCode: '2345-7',
    name: 'Glucose',
    category: 'biochemistry',
    description: 'Serum glucose',
    specimenType: 'Serum',
    tubeType: 'SST',
    collectionInstructions: 'Fasting preferred',
    normalRange: '70–100 mg/dL',
    referenceRange: '70–100 mg/dL',
    units: 'mg/dL',
    turnaroundHours: 6,
  },
  {
    id: 't-hba1c',
    loincCode: '4548-4',
    name: 'HbA1c',
    category: 'biochemistry',
    description: 'Glycated hemoglobin',
    specimenType: 'Whole blood',
    tubeType: 'EDTA',
    collectionInstructions: 'Standard venipuncture',
    normalRange: '<5.7%',
    referenceRange: '<5.7%',
    units: '%',
    turnaroundHours: 24,
  },
  {
    id: 't-creat',
    loincCode: '2160-0',
    name: 'Creatinine',
    category: 'biochemistry',
    description: 'Serum creatinine',
    specimenType: 'Serum',
    tubeType: 'SST',
    collectionInstructions: 'Standard venipuncture',
    normalRange: '0.6–1.2 mg/dL',
    referenceRange: '0.6–1.2 mg/dL',
    units: 'mg/dL',
    turnaroundHours: 6,
  },
  {
    id: 't-tsh',
    loincCode: '3016-3',
    name: 'TSH',
    category: 'endocrinology',
    description: 'Thyroid stimulating hormone',
    specimenType: 'Serum',
    tubeType: 'SST',
    collectionInstructions: 'Standard venipuncture',
    normalRange: '0.4–4.0 mIU/L',
    referenceRange: '0.4–4.0 mIU/L',
    units: 'mIU/L',
    turnaroundHours: 24,
  },
  {
    id: 't-covid',
    loincCode: '94500-6',
    name: 'SARS-CoV-2 PCR',
    category: 'covid',
    description: 'COVID-19 PCR',
    specimenType: 'Nasopharyngeal swab',
    tubeType: 'Viral transport',
    collectionInstructions: 'NP swab',
    normalRange: 'Not detected',
    referenceRange: 'Not detected',
    units: '',
    turnaroundHours: 12,
  },
];

export function getLabCatalog(): LabTestDefinition[] {
  return CATALOG;
}

export function resolveTestNames(testIds: string[]): string[] {
  return testIds.map((id) => {
    const test = CATALOG.find((t) => t.id === id);
    return test?.name ?? id;
  });
}

export function getCatalogTest(testId: string): LabTestDefinition | undefined {
  return CATALOG.find((t) => t.id === testId);
}

export function mapOrderStatus(status: string): LabOrderStatus {
  switch (status) {
    case 'draft':
    case 'pending':
    case 'scheduled':
    case 'collected':
    case 'in_progress':
    case 'completed':
    case 'cancelled':
    case 'rejected':
      return status;
    default:
      return 'pending';
  }
}

export function mapPriority(priority: string): LabOrderPriority {
  switch (priority) {
    case 'routine':
    case 'urgent':
    case 'stat':
      return priority;
    default:
      return 'routine';
  }
}

export function mapCollectionMethod(method: string): CollectionMethod {
  switch (method) {
    case 'in_clinic':
    case 'home_collection':
    case 'external_lab':
    case 'referral':
      return method;
    default:
      return 'in_clinic';
  }
}

export function mapResultStatus(status: string): LabResultStatus {
  switch (status) {
    case 'pending':
    case 'processing':
    case 'verified':
    case 'released':
    case 'corrected':
    case 'amended':
    case 'cancelled':
    case 'rejected':
      return status;
    default:
      return 'pending';
  }
}

export function mapFlag(flag: string): ResultFlag {
  switch (flag) {
    case 'normal':
    case 'high':
    case 'low':
    case 'critical_high':
    case 'critical_low':
    case 'abnormal':
      return flag;
    default:
      return 'normal';
  }
}

export function mapCategory(category: string): LabCategory {
  switch (category) {
    case 'hematology':
    case 'biochemistry':
    case 'microbiology':
    case 'immunology':
    case 'virology':
    case 'pathology':
    case 'genetics':
    case 'endocrinology':
    case 'toxicology':
    case 'urinalysis':
    case 'coagulation':
    case 'blood_bank':
    case 'covid':
    case 'pregnancy':
    case 'custom':
      return category;
    default:
      return 'custom';
  }
}

export function mapSpecimenStatus(status: string): SpecimenStatus {
  switch (status) {
    case 'pending':
    case 'collected':
    case 'in_transit':
    case 'received':
    case 'processing':
    case 'rejected':
    case 'lost':
    case 'damaged':
    case 'stored':
    case 'recollected':
      return status;
    default:
      return 'pending';
  }
}

export function mapLabOrder(row: Prisma.LabOrderGetPayload<object>): LabOrder {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    patientId: row.patientId,
    patientName: row.patientName,
    orderingPhysician: row.orderingPhysician,
    orderingPhysicianId: row.orderingPhysicianId,
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    department: row.department,
    laboratoryId: row.laboratoryId,
    laboratoryName: row.laboratoryName,
    priority: mapPriority(row.priority),
    status: mapOrderStatus(row.status),
    collectionMethod: mapCollectionMethod(row.collectionMethod),
    clinicalIndication: row.clinicalIndication,
    diagnosis: row.diagnosis ?? undefined,
    carePlanId: row.carePlanId ?? undefined,
    appointmentId: row.appointmentId ?? undefined,
    testIds: row.testIds,
    testNames: row.testNames,
    notes: row.notes ?? undefined,
    isRecurring: row.isRecurring,
    isStanding: row.isStanding,
    scheduledAt: row.scheduledAt?.toISOString(),
    collectedAt: row.collectedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapObservation(
  row: Prisma.LabObservationGetPayload<object>,
): LabObservation {
  return {
    id: row.id,
    reportId: row.reportId,
    orderId: row.orderId,
    patientId: row.patientId,
    testId: row.testId,
    testName: row.testName,
    loincCode: row.loincCode,
    category: mapCategory(row.category),
    value: row.value,
    numericValue: row.numericValue ?? undefined,
    unit: row.unit,
    referenceRange: row.referenceRange,
    flag: mapFlag(row.flag),
    interpretation: row.interpretation ?? undefined,
    patientFriendlyText: row.patientFriendlyText ?? undefined,
    collectedAt: row.collectedAt.toISOString(),
    resultedAt: row.resultedAt?.toISOString(),
  };
}

export function mapReport(
  row: Prisma.LabDiagnosticReportGetPayload<object>,
  observationIds: string[] = [],
): LabDiagnosticReport {
  return {
    id: row.id,
    orderId: row.orderId,
    patientId: row.patientId,
    patientName: row.patientName,
    reportNumber: row.reportNumber,
    status: mapResultStatus(row.status),
    category: mapCategory(row.category),
    title: row.title,
    summary: row.summary ?? undefined,
    observationIds,
    verifiedBy: row.verifiedBy ?? undefined,
    approvedBy: row.approvedBy ?? undefined,
    digitalSignature: row.digitalSignature ?? undefined,
    technologistId: row.technologistId ?? undefined,
    technologistName: row.technologistName ?? undefined,
    releasedAt: row.releasedAt?.toISOString(),
    correctedAt: row.correctedAt?.toISOString(),
    attachments: row.attachments,
    comments: row.comments ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function parseChain(value: unknown): SpecimenEvent[] {
  if (!Array.isArray(value)) return [];
  const events: SpecimenEvent[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    if (!id) continue;
    events.push({
      id,
      timestamp: String(row.timestamp ?? ''),
      status: mapSpecimenStatus(String(row.status ?? 'pending')),
      actor: String(row.actor ?? ''),
      notes: typeof row.notes === 'string' ? row.notes : undefined,
    });
  }
  return events;
}

export function mapSpecimen(
  row: Prisma.LabSpecimenGetPayload<object>,
): SpecimenRecord {
  return {
    id: row.id,
    orderId: row.orderId,
    patientId: row.patientId,
    barcode: row.barcode,
    qrCode: row.qrCode,
    specimenType: row.specimenType,
    status: mapSpecimenStatus(row.status),
    collectedBy: row.collectedBy ?? undefined,
    collectedAt: row.collectedAt?.toISOString(),
    receivedAt: row.receivedAt?.toISOString(),
    temperature: row.temperature ?? undefined,
    storageLocation: row.storageLocation ?? undefined,
    rejectionReason: row.rejectionReason ?? undefined,
    chainOfCustody: parseChain(row.chainOfCustody),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
