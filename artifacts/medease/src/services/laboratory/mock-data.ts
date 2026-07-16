import type {
  BloodBankRecord,
  LabAlert,
  LabDiagnosticReport,
  LabObservation,
  LabOrder,
  LabOrderStatus,
  LabResultStatus,
  LabTimelineEntry,
  LabTrendSeries,
  LaboratoryAnalytics,
  LaboratoryDashboard,
  LaboratoryInstrument,
  MicrobiologyResult,
  PathologyResult,
  QualityControl,
  QualityDashboard,
  SpecimenRecord,
  Technologist,
} from '@/services/laboratory/types';
import { AUTH_USER_PATIENT_MAP } from '@/services/laboratory/types';
import { LAB_TEST_CATALOG, computeResultFlag, getTestById } from '@/services/laboratory/reference-ranges';

const PHYSICIANS = [
  { id: 'phys-001', name: 'Dr. Emily Chen' },
  { id: 'phys-002', name: 'Dr. Jean-Luc Martin' },
  { id: 'phys-003', name: 'Dr. Sophie Bernard' },
];
const FACILITIES = [
  { id: 'fac-001', name: 'Pitié-Salpêtrière' },
  { id: 'fac-002', name: 'Hôpital Européen Georges-Pompidou' },
  { id: 'fac-003', name: 'Hôpital Necker' },
];
const LABORATORIES = [
  { id: 'lab-001', name: 'Central Clinical Laboratory' },
  { id: 'lab-002', name: 'Regional Diagnostics Lab' },
  { id: 'lab-003', name: 'External Reference Lab' },
];
const PATIENT_NAMES = [
  'Sarah Jenkins', 'Marcus Dubois', 'Amélie Laurent', 'James Okonkwo', 'Elena Vasquez',
  'Thomas Müller', 'Fatima Hassan', 'Lucas Silva', 'Yuki Tanaka', 'Anna Kowalski',
];

const ORDER_STATUSES: LabOrderStatus[] = ['pending', 'scheduled', 'collected', 'in_progress', 'completed', 'cancelled', 'rejected'];
const RESULT_STATUSES: LabResultStatus[] = ['pending', 'processing', 'verified', 'released', 'corrected'];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]!;
}

function patientIdFromIndex(idx: number): string {
  return `phr-${String((idx % 40) + 1).padStart(3, '0')}`;
}

function numericForTest(testId: string, index: number): number {
  const base: Record<string, number> = {
    't-hgb': 14.2, 't-wbc': 7.5, 't-plt': 250, 't-glucose': 92, 't-hba1c': 5.4,
    't-creat': 1.1, 't-egfr': 88, 't-alt': 28, 't-ast': 22, 't-ldl': 118,
    't-hdl': 52, 't-tsh': 2.1, 't-na': 140, 't-k': 4.2, 't-pt': 12,
    't-inr': 1.0, 't-bnp': 45, 't-trop': 0.01, 't-vitd': 42, 't-ferr': 85, 't-cr': 1.5,
  };
  const val = base[testId] ?? 10 + (index % 20);
  if (index % 17 === 0) return val * 1.8;
  if (index % 23 === 0) return val * 0.4;
  if (index % 11 === 0) return val * 1.3;
  return val + (index % 5) * 0.2;
}

export function generateLabOrder(index: number): LabOrder {
  const patientIdx = index % 40;
  const patientId = patientIdFromIndex(patientIdx);
  const physician = pick(PHYSICIANS, index);
  const facility = pick(FACILITIES, index);
  const lab = pick(LABORATORIES, index);
  const testCount = 1 + (index % 3);
  const testIds = Array.from({ length: testCount }, (_, i) => LAB_TEST_CATALOG[(index + i) % LAB_TEST_CATALOG.length]!.id);
  const testNames = testIds.map((id) => getTestById(id)!.name);
  const status = pick(ORDER_STATUSES, index);
  const priority = index % 20 === 0 ? 'stat' : index % 7 === 0 ? 'urgent' : 'routine';
  const daysBack = index % 90;

  return {
    id: `lo-${String(index + 1).padStart(5, '0')}`,
    orderNumber: `LAB-${String(100000 + index).slice(1)}`,
    patientId,
    patientName: pick(PATIENT_NAMES, patientIdx),
    orderingPhysician: physician.name,
    orderingPhysicianId: physician.id,
    facilityId: facility.id,
    facilityName: facility.name,
    department: pick(['Internal Medicine', 'Endocrinology', 'Cardiology', 'Emergency', 'Primary Care'], index),
    laboratoryId: lab.id,
    laboratoryName: lab.name,
    priority,
    status,
    collectionMethod: pick(['in_clinic', 'home_collection', 'external_lab', 'referral'] as const, index),
    clinicalIndication: pick(['Routine monitoring', 'Follow-up diabetes', 'Pre-operative screening', 'Symptom evaluation', 'Care plan milestone'], index),
    diagnosis: index % 3 === 0 ? pick(['E11.9 Type 2 diabetes', 'I10 Hypertension', 'J44.9 COPD'], index) : undefined,
    carePlanId: index % 4 === 0 ? `cp-${String((index % 120) + 1).padStart(3, '0')}` : undefined,
    appointmentId: index % 5 === 0 ? `appt-${index}` : undefined,
    testIds,
    testNames,
    notes: index % 8 === 0 ? 'Patient fasting confirmed.' : undefined,
    isRecurring: index % 15 === 0,
    isStanding: index % 25 === 0,
    scheduledAt: status === 'scheduled' ? daysAgo(-2) : daysAgo(daysBack),
    collectedAt: ['collected', 'in_progress', 'completed'].includes(status) ? daysAgo(daysBack - 1) : undefined,
    createdAt: daysAgo(daysBack + 1),
    updatedAt: daysAgo(daysBack),
  };
}

function generateObservation(order: LabOrder, testId: string, obsIndex: number): LabObservation {
  const test = getTestById(testId)!;
  const numericValue = numericForTest(testId, obsIndex);
  const flag = computeResultFlag(test, numericValue);
  return {
    id: `obs-${order.id}-${testId}`,
    reportId: `rep-${order.id}`,
    orderId: order.id,
    patientId: order.patientId,
    testId,
    testName: test.name,
    loincCode: test.loincCode,
    category: test.category,
    value: test.units ? String(Math.round(numericValue * 10) / 10) : 'See report',
    numericValue: test.units ? numericValue : undefined,
    unit: test.units,
    referenceRange: test.referenceRange,
    flag,
    interpretation: flag === 'normal' ? 'Within reference range.' : `${test.name} ${flag.replace('_', ' ')}.`,
    patientFriendlyText: flag === 'normal' ? `Your ${test.name} result is within the normal range.` : `Your ${test.name} result needs review by your care team.`,
    collectedAt: order.collectedAt ?? order.createdAt,
    resultedAt: daysAgo(obsIndex % 30),
  };
}

function generateReport(order: LabOrder, index: number): LabDiagnosticReport {
  const test = getTestById(order.testIds[0]!)!;
  const status = pick(RESULT_STATUSES, index);
  return {
    id: `rep-${order.id}`,
    orderId: order.id,
    patientId: order.patientId,
    patientName: order.patientName,
    reportNumber: `RPT-${order.orderNumber.slice(4)}`,
    status,
    category: test.category,
    title: `${order.testNames.join(', ')} Panel`,
    summary: status === 'released' ? 'Results within expected clinical context.' : undefined,
    observationIds: order.testIds.map((tid) => `obs-${order.id}-${tid}`),
    verifiedBy: ['verified', 'released', 'corrected'].includes(status) ? pick(PHYSICIANS, index).name : undefined,
    releasedAt: status === 'released' ? daysAgo(index % 14) : undefined,
    attachments: index % 10 === 0 ? ['lab-report.pdf'] : undefined,
    comments: index % 12 === 0 ? 'Repeat in 3 months if clinically indicated.' : undefined,
    createdAt: order.collectedAt ?? order.createdAt,
    updatedAt: daysAgo(index % 7),
  };
}

function generateSpecimen(order: LabOrder, index: number): SpecimenRecord {
  const test = getTestById(order.testIds[0]!)!;
  const status = pick(['collected', 'in_transit', 'received', 'processing', 'stored', 'rejected'] as const, index);
  const collectedAt = order.collectedAt ?? daysAgo(index % 20);
  return {
    id: `spec-${order.id}`,
    orderId: order.id,
    patientId: order.patientId,
    barcode: `BC-${order.orderNumber.slice(4)}`,
    qrCode: `QR-${order.id}`,
    specimenType: test.specimenType,
    status,
    collectedBy: 'Lab Tech Marie Dupont',
    collectedAt,
    receivedAt: ['received', 'processing', 'stored'].includes(status) ? daysAgo(index % 15) : undefined,
    temperature: '2–8°C',
    storageLocation: status === 'stored' ? `Rack ${index % 10}-Shelf ${index % 5}` : undefined,
    rejectionReason: status === 'rejected' ? 'Hemolyzed sample — recollection required.' : undefined,
    chainOfCustody: [
      { id: 'c1', timestamp: collectedAt, status: 'collected', actor: 'Marie Dupont' },
      { id: 'c2', timestamp: daysAgo(index % 18), status: 'in_transit', actor: 'Transport Unit' },
      { id: 'c3', timestamp: daysAgo(index % 16), status: 'received', actor: 'Lab Reception' },
    ],
    createdAt: collectedAt,
    updatedAt: daysAgo(index % 5),
  };
}

function generateAlert(obs: LabObservation, index: number): LabAlert {
  const isCritical = obs.flag.startsWith('critical');
  return {
    id: `alert-${obs.id}`,
    type: isCritical ? 'critical_result' : 'abnormal_result',
    severity: isCritical ? 'critical' : 'warning',
    patientId: obs.patientId,
    orderId: obs.orderId,
    reportId: obs.reportId,
    observationId: obs.id,
    title: isCritical ? `Critical ${obs.testName}` : `Abnormal ${obs.testName}`,
    message: `${obs.testName}: ${obs.value} ${obs.unit} (${obs.flag.replace('_', ' ')})`,
    acknowledged: index % 3 === 0,
    createdAt: obs.resultedAt ?? daysAgo(index % 10),
  };
}

export const MOCK_LAB_ORDERS: LabOrder[] = Array.from({ length: 2000 }, (_, i) => generateLabOrder(i));

const completedOrders = MOCK_LAB_ORDERS.filter((o) => o.status === 'completed');

export const MOCK_LAB_OBSERVATIONS: LabObservation[] = completedOrders.flatMap((order, i) =>
  order.testIds.map((testId, ti) => generateObservation(order, testId, i * 10 + ti)),
);

export const MOCK_LAB_REPORTS: LabDiagnosticReport[] = completedOrders.map((order, i) => generateReport(order, i));

export const MOCK_SPECIMENS: SpecimenRecord[] = MOCK_LAB_ORDERS.filter((_, i) => i % 4 === 0)
  .slice(0, 500)
  .map((order, i) => generateSpecimen(order, i));

export const MOCK_LAB_ALERTS: LabAlert[] = MOCK_LAB_OBSERVATIONS
  .filter((o) => o.flag !== 'normal')
  .slice(0, 200)
  .map((obs, i) => generateAlert(obs, i));

const MICRO_REPORTS = MOCK_LAB_REPORTS.filter((r) => r.category === 'microbiology' || r.category === 'virology');
const PATH_REPORTS = MOCK_LAB_REPORTS.filter((r) => r.category === 'pathology');

const ORGANISMS = ['E. coli', 'Staphylococcus aureus', 'Klebsiella pneumoniae', 'Pseudomonas aeruginosa', 'Streptococcus pneumoniae'];
const ANTIBIOTICS = ['Ampicillin', 'Ciprofloxacin', 'Vancomycin', 'Ceftriaxone', 'Meropenem'];
const BLOOD_GROUPS = ['A', 'B', 'AB', 'O'];
const COMPONENTS: BloodBankRecord['component'][] = ['RBC', 'Platelets', 'Plasma', 'Whole Blood', 'Cryoprecipitate'];

export const MOCK_MICROBIOLOGY: MicrobiologyResult[] = MICRO_REPORTS.slice(0, 120).map((r, i) => ({
  id: `micro-${r.id}`,
  reportId: r.id,
  patientId: r.patientId,
  specimenType: i % 2 === 0 ? 'Blood culture' : 'Urine culture',
  status: r.status,
  gramStain: i % 3 === 0 ? 'Gram-negative rods' : 'Gram-positive cocci in clusters',
  cultures: [{
    organism: ORGANISMS[i % ORGANISMS.length]!,
    colonyCount: i % 2 === 0 ? 'Heavy growth' : 'Moderate growth',
    sensitivities: ANTIBIOTICS.slice(0, 3).map((ab, ai) => ({
      antibiotic: ab,
      interpretation: (['S', 'I', 'R'] as const)[(i + ai) % 3]!,
      mic: `${(ai + 1) * 2} µg/mL`,
    })),
  }],
  comments: r.summary,
  finalizedAt: r.releasedAt,
  technologistName: pick(PHYSICIANS, i).name.replace('Dr.', 'Tech'),
}));

export const MOCK_PATHOLOGY: PathologyResult[] = PATH_REPORTS.slice(0, 80).map((r, i) => ({
  id: `path-${r.id}`,
  reportId: r.id,
  patientId: r.patientId,
  specimenSite: ['Colon biopsy', 'Skin excision', 'Lymph node', 'Breast tissue', 'Liver biopsy'][i % 5]!,
  status: r.status,
  macroscopic: 'Specimen received in formalin, labeled and intact.',
  microscopic: 'Sections show tissue architecture with focal inflammatory changes.',
  histology: [{
    id: `hist-${r.id}`,
    reportId: r.id,
    findings: 'Cellular atypia within limits; no malignancy identified.',
    diagnosis: i % 9 === 0 ? 'Suspicious — recommend follow-up' : 'Benign histology',
    margins: i % 4 === 0 ? 'Clear margins' : undefined,
  }],
  pathologistName: pick(PHYSICIANS, i).name,
  finalizedAt: r.releasedAt,
}));

export const MOCK_BLOOD_BANK: BloodBankRecord[] = Array.from({ length: 100 }, (_, i) => ({
  id: `bb-${String(i + 1).padStart(4, '0')}`,
  patientId: patientIdFromIndex(i),
  orderId: MOCK_LAB_ORDERS[i * 7]?.id,
  component: COMPONENTS[i % COMPONENTS.length]!,
  bloodGroup: BLOOD_GROUPS[i % BLOOD_GROUPS.length]!,
  rhFactor: i % 2 === 0 ? 'Positive' : 'Negative',
  crossMatchResult: i % 11 === 0 ? 'incompatible' : i % 5 === 0 ? 'pending' : 'compatible',
  status: i % 5 === 0 ? 'processing' : 'released',
  collectedAt: daysAgo(i % 30),
  verifiedBy: i % 3 === 0 ? 'Dr. Emily Chen' : undefined,
}));

export const MOCK_TECHNOLOGISTS: Technologist[] = [
  { id: 'tech-001', name: 'Marie Dupont', credentials: 'MLT, ASCP', department: 'Hematology', activeOrders: 14 },
  { id: 'tech-002', name: 'Carlos Rivera', credentials: 'CLS', department: 'Chemistry', activeOrders: 22 },
  { id: 'tech-003', name: 'Aisha Okonkwo', credentials: 'MLT', department: 'Microbiology', activeOrders: 9 },
  { id: 'tech-004', name: 'Henri Laurent', credentials: 'MT', department: 'Blood Bank', activeOrders: 6 },
];

export const MOCK_INSTRUMENTS: LaboratoryInstrument[] = [
  { id: 'inst-001', name: 'Sysmex XN-1000', manufacturer: 'Sysmex', model: 'XN-1000', department: 'Hematology', status: 'online', utilizationPercent: 78, lastCalibration: daysAgo(14) },
  { id: 'inst-002', name: 'Cobas 8000', manufacturer: 'Roche', model: 'c702', department: 'Chemistry', status: 'online', utilizationPercent: 85, lastCalibration: daysAgo(7) },
  { id: 'inst-003', name: 'VITEK 2', manufacturer: 'bioMérieux', model: 'VITEK 2', department: 'Microbiology', status: 'maintenance', utilizationPercent: 42, lastCalibration: daysAgo(30) },
  { id: 'inst-004', name: 'Architect i2000', manufacturer: 'Abbott', model: 'i2000SR', department: 'Immunology', status: 'online', utilizationPercent: 61, lastCalibration: daysAgo(10) },
  { id: 'inst-005', name: 'Ortho Vision', manufacturer: 'Ortho', model: 'Vision Max', department: 'Blood Bank', status: 'calibration', utilizationPercent: 55, lastCalibration: daysAgo(1) },
];

export const MOCK_QUALITY_CONTROL: QualityControl[] = MOCK_INSTRUMENTS.flatMap((inst, i) =>
  Array.from({ length: 8 }, (_, j) => ({
    id: `qc-${inst.id}-${j}`,
    instrumentId: inst.id,
    testName: ['Hemoglobin', 'Glucose', 'WBC', 'Creatinine', 'PT/INR'][j % 5]!,
    expectedValue: 'Within range',
    observedValue: j % 7 === 0 ? 'Out of range' : 'Within range',
    withinRange: j % 7 !== 0,
    runAt: daysAgo(j + i),
    technologistId: MOCK_TECHNOLOGISTS[j % MOCK_TECHNOLOGISTS.length]!.id,
  })),
);

export function buildQualityDashboard(): QualityDashboard {
  const pending = MOCK_LAB_REPORTS.filter((r) => r.status === 'processing' || r.status === 'pending').length;
  return {
    qualityScore: 94,
    verificationRate: 96.2,
    rejectionRate: 2.4,
    pendingVerification: pending,
    instrumentUtilization: 72,
    recentQc: MOCK_QUALITY_CONTROL.slice(0, 12),
    kpis: [
      { label: 'QC pass rate', value: 97 },
      { label: 'Pending verify', value: pending },
      { label: 'Rejected samples', value: MOCK_SPECIMENS.filter((s) => s.status === 'rejected').length },
      { label: 'Instrument util.', value: 72 },
    ],
  };
}

export function buildLabTimeline(patientId: string): LabTimelineEntry[] {
  const entries: LabTimelineEntry[] = [];
  for (const order of MOCK_LAB_ORDERS.filter((o) => o.patientId === patientId).slice(0, 15)) {
    entries.push({
      id: `tl-o-${order.id}`,
      patientId,
      type: 'order',
      title: `Order ${order.orderNumber}`,
      description: order.testNames.join(', '),
      timestamp: order.createdAt,
      orderId: order.id,
    });
  }
  for (const spec of MOCK_SPECIMENS.filter((s) => s.patientId === patientId).slice(0, 8)) {
    entries.push({
      id: `tl-s-${spec.id}`,
      patientId,
      type: 'specimen',
      title: `Specimen ${spec.barcode}`,
      description: spec.status.replace('_', ' '),
      timestamp: spec.collectedAt ?? spec.createdAt,
      orderId: spec.orderId,
    });
  }
  for (const rep of MOCK_LAB_REPORTS.filter((r) => r.patientId === patientId).slice(0, 12)) {
    entries.push({
      id: `tl-r-${rep.id}`,
      patientId,
      type: 'result',
      title: rep.title,
      description: rep.status,
      timestamp: rep.releasedAt ?? rep.createdAt,
      orderId: rep.orderId,
      reportId: rep.id,
    });
  }
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function buildDashboard(patientId?: string): LaboratoryDashboard {
  const orders = patientId
    ? MOCK_LAB_ORDERS.filter((o) => o.patientId === patientId)
    : MOCK_LAB_ORDERS;
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
  const pendingCollection = orders.filter((o) => ['pending', 'scheduled'].includes(o.status)).length;
  const collectedSamples = orders.filter((o) => o.status === 'collected').length;
  const inProcessing = orders.filter((o) => o.status === 'in_progress').length;
  const resultsReady = MOCK_LAB_REPORTS.filter((r) =>
    patientId ? r.patientId === patientId && r.status === 'released' : r.status === 'released',
  ).length;
  const criticalResults = MOCK_LAB_ALERTS.filter((a) =>
    patientId ? a.patientId === patientId && a.severity === 'critical' : a.severity === 'critical',
  ).length;

  return {
    patientId,
    todayOrders: todayOrders || orders.filter((_, i) => i % 50 === 0).length,
    pendingCollection,
    collectedSamples,
    inProcessing,
    resultsReady,
    criticalResults,
    rejectedSamples: MOCK_SPECIMENS.filter((s) => s.status === 'rejected').length,
    cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
    averageTurnaroundHours: 18,
    recentActivity: buildLabTimeline(patientId ?? 'phr-001').slice(0, 8),
    kpis: [
      { label: 'Orders today', value: todayOrders || 12 },
      { label: 'Pending', value: pendingCollection },
      { label: 'Critical', value: criticalResults },
    ],
    chartData: [
      { label: 'Hematology', value: 420 },
      { label: 'Biochemistry', value: 680 },
      { label: 'Microbiology', value: 210 },
      { label: 'Immunology', value: 180 },
      { label: 'Other', value: 510 },
    ],
  };
}

export function buildTrends(patientId: string): LabTrendSeries[] {
  const trendTests = ['t-glucose', 't-hba1c', 't-hgb', 't-ldl', 't-creat'];
  return trendTests.map((testId, ti) => {
    const test = getTestById(testId)!;
    const obs = MOCK_LAB_OBSERVATIONS.filter((o) => o.patientId === patientId && o.testId === testId)
      .slice(0, 8)
      .sort((a, b) => new Date(a.resultedAt ?? a.collectedAt).getTime() - new Date(b.resultedAt ?? b.collectedAt).getTime());
    const points = obs.length
      ? obs.map((o) => ({ date: o.resultedAt ?? o.collectedAt, value: o.numericValue ?? 0 }))
      : Array.from({ length: 6 }, (_, i) => ({
          date: daysAgo(90 - i * 15),
          value: numericForTest(testId, ti * 10 + i),
        }));
    return { testId, testName: test.name, unit: test.units, referenceRange: test.referenceRange, points };
  });
}

export function buildAnalytics(): LaboratoryAnalytics {
  const completed = MOCK_LAB_ORDERS.filter((o) => o.status === 'completed').length;
  return {
    totalOrders: MOCK_LAB_ORDERS.length,
    completedOrders: completed,
    averageTurnaroundHours: 18.4,
    criticalResultCount: MOCK_LAB_ALERTS.filter((a) => a.severity === 'critical').length,
    rejectionRate: 2.4,
    qualityScore: 94,
    verificationRate: 96.2,
    pendingVerification: MOCK_LAB_REPORTS.filter((r) => r.status === 'processing' || r.status === 'pending').length,
    instrumentUtilization: 72,
    specimenQualityScore: 97.5,
    ordersByCategory: [
      { label: 'Hematology', value: 420 },
      { label: 'Biochemistry', value: 680 },
      { label: 'Microbiology', value: 210 },
      { label: 'Endocrinology', value: 240 },
      { label: 'Other', value: 450 },
    ],
    turnaroundByDepartment: [
      { label: 'Central Lab', value: 14 },
      { label: 'Regional Lab', value: 22 },
      { label: 'External Lab', value: 36 },
    ],
    criticalByMonth: [
      { label: 'Jan', value: 18 }, { label: 'Feb', value: 22 }, { label: 'Mar', value: 15 },
      { label: 'Apr', value: 28 }, { label: 'May', value: 19 }, { label: 'Jun', value: 24 },
    ],
  };
}

export function getPatientIdForUser(userId: string): string | null {
  return AUTH_USER_PATIENT_MAP[userId] ?? null;
}

export { AUTH_USER_PATIENT_MAP };
