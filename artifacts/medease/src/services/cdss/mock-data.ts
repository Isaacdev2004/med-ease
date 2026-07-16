import { ORDER_SET_TEMPLATES } from '@/services/cdss/order-set-engine';
import { GUIDELINE_SOURCES } from '@/services/cdss/guidelines-engine';
import type {
  AlertAudit,
  AlertType,
  AllergyAlert,
  CalculatorType,
  CdssDashboard,
  ClinicalAlert,
  ClinicalPathway,
  ClinicalProtocol,
  ClinicalRecommendation,
  ClinicalRule,
  ContraindicationAlert,
  DecisionTree,
  DrugInteractionAlert,
  DuplicateTherapyAlert,
  EvidenceArticle,
  Guideline,
  OrderSet,
  OrderSetCategory,
  PreventiveReminder,
  RiskCalculator,
  DiagnosticSuggestion,
} from '@/services/cdss/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => `fac-${String(i + 1).padStart(3, '0')}`);
const PROVIDERS = Array.from({ length: 200 }, (_, i) => `prov-${String(i + 1).padStart(4, '0')}`);
const ALERT_TYPES: AlertType[] = ['abnormal_lab', 'allergy', 'interaction', 'contraindication', 'duplicate_therapy', 'dosing', 'preventive', 'care_gap', 'guideline', 'diagnostic'];
const SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'] as const;
const STATUSES = ['active', 'acknowledged', 'overridden', 'resolved', 'expired'] as const;
const ORDER_CATEGORIES = Object.keys(ORDER_SET_TEMPLATES) as OrderSetCategory[];
const CALC_TYPES: CalculatorType[] = ['chads_vasc', 'has_bled', 'wells', 'curb65', 'news2', 'mews', 'ascvd', 'framingham', 'bmi', 'bsa', 'creatinine_clearance', 'egfr'];
const CONDITIONS = ['Diabetes', 'Hypertension', 'Heart Failure', 'COPD', 'Pneumonia', 'Stroke', 'Sepsis', 'Asthma', 'CKD', 'Atrial Fibrillation'];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0]!;
}

export const MOCK_CLINICAL_RULES: ClinicalRule[] = Array.from({ length: 1500 }, (_, i) => ({
  ruleId: `rule-${String(i + 1).padStart(5, '0')}`,
  name: `Clinical Rule ${i + 1}`,
  category: ALERT_TYPES[i % ALERT_TYPES.length]!,
  facilityId: i % 3 === 0 ? FACILITIES[i % 25] : undefined,
  enabled: i % 7 !== 0,
  priority: SEVERITIES[i % SEVERITIES.length]!,
  triggerCount: i % 500,
  lastTriggered: i % 5 === 0 ? undefined : daysAgo(i % 30),
  description: `Evaluates ${ALERT_TYPES[i % ALERT_TYPES.length]!.replace(/_/g, ' ')} criteria`,
}));

export const MOCK_GUIDELINES: Guideline[] = Array.from({ length: 800 }, (_, i) => {
  const source = GUIDELINE_SOURCES[i % GUIDELINE_SOURCES.length]!;
  const condition = CONDITIONS[i % CONDITIONS.length]!;
  return {
    guidelineId: `gl-${String(i + 1).padStart(4, '0')}`,
    title: `${source.toUpperCase()} ${condition} Guideline`,
    source,
    condition,
    status: (['published', 'published', 'draft', 'archived'] as const)[i % 4]!,
    facilityId: i % 4 === 0 ? FACILITIES[i % 25] : undefined,
    currentVersion: `v${1 + (i % 5)}.0`,
    versions: [{ versionId: `gv-${i}`, version: `v${1 + (i % 5)}.0`, publishedAt: daysAgo(i % 365), summary: `Evidence-based ${condition} management` }],
    complianceRate: 55 + (i % 40),
    lastReviewed: daysAgo(i % 180).split('T')[0]!,
  };
});

export const MOCK_ALERTS: ClinicalAlert[] = Array.from({ length: 2000 }, (_, i) => ({
  alertId: `alert-${String(i + 1).padStart(5, '0')}`,
  patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 3000) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  providerId: PROVIDERS[i % 200],
  type: ALERT_TYPES[i % ALERT_TYPES.length]!,
  severity: SEVERITIES[i % SEVERITIES.length]!,
  status: STATUSES[i % STATUSES.length]!,
  title: `${ALERT_TYPES[i % ALERT_TYPES.length]!.replace(/_/g, ' ')} alert`,
  message: `Clinical decision support triggered for patient context linked to care plan cp-${String((i % 500) + 1).padStart(4, '0')}`,
  triggeredAt: daysAgo(i % 14),
  ruleId: `rule-${String((i % 1500) + 1).padStart(5, '0')}`,
  relatedEntityId: i % 2 === 0 ? `lab-${String((i % 1000) + 1).padStart(4, '0')}` : `med-${String((i % 800) + 1).padStart(4, '0')}`,
  relatedEntityType: i % 2 === 0 ? 'labResultId' : 'medicationId',
}));

export const MOCK_RECOMMENDATIONS: ClinicalRecommendation[] = Array.from({ length: 1000 }, (_, i) => ({
  recommendationId: `rec-${String(i + 1).padStart(5, '0')}`,
  patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 3000) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  title: `Evidence-based recommendation ${i + 1}`,
  rationale: `Based on ${GUIDELINE_SOURCES[i % GUIDELINE_SOURCES.length]!.toUpperCase()} guideline for ${CONDITIONS[i % CONDITIONS.length]}`,
  evidenceLevel: (['A', 'B', 'C', 'D'] as const)[i % 4]!,
  guidelineId: `gl-${String((i % 800) + 1).padStart(4, '0')}`,
  status: (['pending', 'accepted', 'declined', 'deferred'] as const)[i % 4]!,
  createdAt: daysAgo(i % 30),
  priority: SEVERITIES[i % SEVERITIES.length]!,
}));

export const MOCK_ORDER_SETS: OrderSet[] = Array.from({ length: 500 }, (_, i) => {
  const category = ORDER_CATEGORIES[i % ORDER_CATEGORIES.length]!;
  const template = ORDER_SET_TEMPLATES[category];
  return {
    orderSetId: `os-${String(i + 1).padStart(4, '0')}`,
    name: `${category.replace(/_/g, ' ').toUpperCase()} Order Set ${(i % 20) + 1}`,
    category,
    facilityId: i % 3 === 0 ? FACILITIES[i % 25] : undefined,
    evidenceSource: GUIDELINE_SOURCES[i % GUIDELINE_SOURCES.length]!,
    itemCount: template.length,
    items: template.map((label, j) => ({ itemId: `osi-${i}-${j}`, type: (['medication', 'lab', 'imaging', 'nursing', 'consult'] as const)[j % 5]!, label })),
    usageCount: 50 + (i % 500),
    lastUpdated: daysAgo(i % 90).split('T')[0]!,
  };
});

export const MOCK_DIAGNOSTIC_SUGGESTIONS: DiagnosticSuggestion[] = Array.from({ length: 300 }, (_, i) => ({
  suggestionId: `dx-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 2000) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  presentingComplaint: ['Chest pain', 'Dyspnea', 'Fever', 'Abdominal pain', 'Headache'][i % 5]!,
  suggestedDiagnosis: CONDITIONS[i % CONDITIONS.length]!,
  probability: 30 + (i % 60),
  suggestedLabs: ['CBC', 'CMP', 'Troponin'].slice(0, 1 + (i % 3)),
  suggestedImaging: ['Chest X-ray', 'CT head', 'Echo'].slice(0, 1 + (i % 2)),
  createdAt: daysAgo(i % 7),
}));

export const MOCK_PATHWAYS: ClinicalPathway[] = Array.from({ length: 200 }, (_, i) => ({
  pathwayId: `path-${String(i + 1).padStart(4, '0')}`,
  name: `${CONDITIONS[i % CONDITIONS.length]} Pathway`,
  condition: CONDITIONS[i % CONDITIONS.length]!,
  facilityId: FACILITIES[i % 25],
  stageCount: 3 + (i % 5),
  adherenceRate: 60 + (i % 35),
  avgDurationDays: 2 + (i % 14),
}));

export const MOCK_EVIDENCE: EvidenceArticle[] = Array.from({ length: 150 }, (_, i) => ({
  articleId: `ev-${String(i + 1).padStart(4, '0')}`,
  title: `Evidence review: ${CONDITIONS[i % CONDITIONS.length]} management`,
  source: ['PubMed', 'Cochrane', 'BMJ', 'NEJM'][i % 4]!,
  pubDate: daysAgo(i % 730).split('T')[0]!,
  evidenceLevel: (['A', 'B', 'C', 'D'] as const)[i % 4]!,
  summary: `Systematic review supporting guideline gl-${String((i % 800) + 1).padStart(4, '0')}`,
  pmid: `${30000000 + i}`,
  guidelineIds: [`gl-${String((i % 800) + 1).padStart(4, '0')}`],
}));

export const MOCK_CALCULATORS: RiskCalculator[] = CALC_TYPES.map((type, i) => ({
  calculatorId: `calc-${String(i + 1).padStart(3, '0')}`,
  name: type.replace(/_/g, ' ').toUpperCase(),
  type,
  description: `Clinical risk calculator: ${type.replace(/_/g, ' ')}`,
  inputs: [
    { key: 'age', label: 'Age', type: 'number' as const },
    { key: 'sex', label: 'Sex', type: 'select' as const, options: ['male', 'female'] },
  ],
  interpretationBands: [
    { label: 'Low', min: 0, max: 2 },
    { label: 'Moderate', min: 3, max: 5 },
    { label: 'High', min: 6, max: 20 },
  ],
}));

export const MOCK_PREVENTIVE: PreventiveReminder[] = Array.from({ length: 250 }, (_, i) => ({
  reminderId: `prev-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 3000) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  category: (['vaccine', 'screening', 'wellness', 'chronic_review', 'follow_up'] as const)[i % 5]!,
  title: ['Flu vaccine', 'Mammogram', 'Annual wellness', 'Diabetic eye exam', 'HTN follow-up'][i % 5]!,
  dueDate: daysFromNow(i % 90 - 30),
  status: (['due', 'overdue', 'completed', 'scheduled'] as const)[i % 4]!,
  guidelineRef: `gl-${String((i % 800) + 1).padStart(4, '0')}`,
}));

export const MOCK_DRUG_INTERACTIONS: DrugInteractionAlert[] = Array.from({ length: 400 }, (_, i) => ({
  alertId: `dxi-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 2000) + 1}`,
  drugA: ['Warfarin', 'Metformin', 'Lisinopril', 'Atorvastatin'][i % 4]!,
  drugB: ['Aspirin', 'Ibuprofen', 'Amiodarone', 'Clarithromycin'][i % 4]!,
  severity: SEVERITIES[(i % 3) + 1]!,
  mechanism: 'CYP450 / pharmacodynamic interaction',
  recommendation: 'Monitor closely or consider alternative therapy',
}));

export const MOCK_ALLERGY_ALERTS: AllergyAlert[] = Array.from({ length: 200 }, (_, i) => ({
  alertId: `alx-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 2000) + 1}`,
  allergen: ['Penicillin', 'Sulfa', 'Latex', 'Peanuts'][i % 4]!,
  medication: ['Amoxicillin', 'Bactrim', 'Ceftriaxone', 'Morphine'][i % 4]!,
  severity: i % 5 === 0 ? 'critical' : 'high',
  reaction: ['Anaphylaxis', 'Rash', 'Angioedema', 'Urticaria'][i % 4]!,
}));

export const MOCK_CONTRAINDICATIONS: ContraindicationAlert[] = Array.from({ length: 150 }, (_, i) => ({
  alertId: `ctx-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 2000) + 1}`,
  medication: ['Metformin', 'ACE inhibitor', 'NSAID', 'Beta blocker'][i % 4]!,
  condition: ['Renal failure', 'Pregnancy', 'Active GI bleed', 'Severe asthma'][i % 4]!,
  severity: i % 3 === 0 ? 'critical' : 'high',
  recommendation: 'Do not prescribe — select alternative',
}));

export const MOCK_DUPLICATE_THERAPY: DuplicateTherapyAlert[] = Array.from({ length: 100 }, (_, i) => ({
  alertId: `dup-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 2000) + 1}`,
  medications: ['Ibuprofen', 'Naproxen'],
  therapeuticClass: 'NSAID',
  recommendation: 'Avoid duplicate NSAID therapy',
}));

export const MOCK_PROTOCOLS: ClinicalProtocol[] = Array.from({ length: 120 }, (_, i) => ({
  protocolId: `proto-${String(i + 1).padStart(4, '0')}`,
  name: `${CONDITIONS[i % CONDITIONS.length]} Protocol`,
  condition: CONDITIONS[i % CONDITIONS.length]!,
  facilityId: FACILITIES[i % 25]!,
  status: (['active', 'active', 'draft', 'retired'] as const)[i % 4]!,
  steps: ['Assessment', 'Diagnostics', 'Treatment', 'Monitoring', 'Discharge planning'].slice(0, 3 + (i % 3)),
  complianceRate: 65 + (i % 30),
  version: `v${1 + (i % 3)}.0`,
}));

export const MOCK_DECISION_TREES: DecisionTree[] = Array.from({ length: 20 }, (_, i) => ({
  treeId: `tree-${String(i + 1).padStart(3, '0')}`,
  name: `${CONDITIONS[i % CONDITIONS.length]} Decision Tree`,
  condition: CONDITIONS[i % CONDITIONS.length]!,
  rootNodeId: 'n1',
  nodes: [
    { nodeId: 'n1', question: 'Is patient hemodynamically stable?', yesBranch: 'n2', noBranch: 'n3' },
    { nodeId: 'n2', question: 'Are diagnostics complete?', yesBranch: 'n4', noBranch: 'n5' },
    { nodeId: 'n3', recommendation: 'Activate emergency protocol and ICU consult' },
    { nodeId: 'n4', recommendation: 'Proceed with standard pathway' },
    { nodeId: 'n5', recommendation: 'Order recommended investigations' },
  ],
}));

export const MOCK_AUDIT: AlertAudit[] = Array.from({ length: 500 }, (_, i) => ({
  auditId: `aud-${String(i + 1).padStart(4, '0')}`,
  alertId: `alert-${String((i % 2000) + 1).padStart(5, '0')}`,
  action: (['triggered', 'acknowledged', 'overridden', 'resolved'] as const)[i % 4]!,
  providerId: PROVIDERS[i % 200],
  timestamp: daysAgo(i % 60),
  notes: i % 3 === 0 ? 'Documented in chart' : undefined,
}));

export function buildCdssDashboard(facilityId?: string): CdssDashboard {
  const alerts = facilityId ? MOCK_ALERTS.filter((a) => a.facilityId === facilityId) : MOCK_ALERTS;
  const recs = facilityId ? MOCK_RECOMMENDATIONS.filter((r) => r.facilityId === facilityId) : MOCK_RECOMMENDATIONS;
  const orderSets = facilityId ? MOCK_ORDER_SETS.filter((o) => !o.facilityId || o.facilityId === facilityId) : MOCK_ORDER_SETS;
  const preventive = facilityId ? MOCK_PREVENTIVE.filter((p) => p.facilityId === facilityId) : MOCK_PREVENTIVE;
  const active = alerts.filter((a) => a.status === 'active');
  return {
    facilityId,
    activeAlerts: active.length,
    criticalAlerts: active.filter((a) => a.severity === 'critical').length,
    pendingRecommendations: recs.filter((r) => r.status === 'pending').length,
    guidelineCompliance: Math.round(MOCK_GUIDELINES.reduce((s, g) => s + g.complianceRate, 0) / MOCK_GUIDELINES.length),
    orderSetsApplied: orderSets.reduce((s, o) => s + o.usageCount, 0),
    preventiveDue: preventive.filter((p) => p.status === 'due' || p.status === 'overdue').length,
    recentAlerts: [...alerts].sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()).slice(0, 8),
    recentRecommendations: recs.slice(0, 6),
    topOrderSets: [...orderSets].sort((a, b) => b.usageCount - a.usageCount).slice(0, 6),
  };
}
