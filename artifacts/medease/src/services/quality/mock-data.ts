import type {
  AccreditationStandard,
  AuditFinding,
  AuditRecord,
  CapaRecord,
  ComplianceRecord,
  IncidentReport,
  InfectionRecord,
  PolicyDocument,
  QualityDashboard,
  QualityIndicator,
  Risk,
  RootCauseAnalysis,
} from '@/services/quality/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => ({
  id: `fac-${String(i + 1).padStart(3, '0')}`,
  name: ['Pitié-Salpêtrière', 'Hôpital Européen', 'CHU Lyon', 'CHU Bordeaux', 'Hôpital Saint-Louis'][i % 5] ?? `Hospital ${i + 1}`,
}));

const INCIDENT_TYPES = ['patient_safety', 'near_miss', 'medication_error', 'fall', 'sentinel', 'never_event', 'equipment', 'security', 'other'] as const;
const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
const STATUSES = ['reported', 'investigating', 'escalated', 'resolved', 'closed'] as const;

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

export const MOCK_INCIDENTS: IncidentReport[] = Array.from({ length: 5000 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const severity = SEVERITIES[i % SEVERITIES.length]!;
  const status = STATUSES[i % STATUSES.length]!;
  return {
    incidentId: `inc-${String(i + 1).padStart(5, '0')}`,
    title: `Incident ${i + 1} — ${INCIDENT_TYPES[i % INCIDENT_TYPES.length]!.replace('_', ' ')}`,
    description: `Quality event reported at ${fac.name}`,
    type: INCIDENT_TYPES[i % INCIDENT_TYPES.length]!,
    severity,
    status,
    facilityId: fac.id,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
    patientId: i % 3 === 0 ? `phr-${String((i % 500) + 1).padStart(3, '0')}` : undefined,
    reportedBy: i % 10 === 0 ? 'anonymous' : `emp-${String((i % 500) + 1).padStart(5, '0')}`,
    reportedAt: daysAgo(i % 90),
    anonymous: i % 10 === 0,
    escalated: severity === 'critical' || status === 'escalated',
    equipmentId: i % 7 === 0 ? `eqp-${String((i % 10000) + 1).padStart(5, '0')}` : undefined,
    carePlanId: i % 5 === 0 ? `cp-${String((i % 2000) + 1).padStart(5, '0')}` : undefined,
    appointmentId: i % 6 === 0 ? `apt-${String((i % 8000) + 1).padStart(5, '0')}` : undefined,
  };
});

export const MOCK_RISKS: Risk[] = Array.from({ length: 2500 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const categories = ['clinical', 'operational', 'financial', 'it', 'cybersecurity', 'regulatory'] as const;
  const likelihood = 1 + (i % 5);
  const impact = 1 + ((i + 2) % 5);
  const score = likelihood * impact;
  const level = score >= 20 ? 'extreme' as const : score >= 12 ? 'high' as const : score >= 6 ? 'medium' as const : 'low' as const;
  return {
    riskId: `risk-${String(i + 1).padStart(5, '0')}`,
    title: `Risk ${i + 1} — ${categories[i % categories.length]!}`,
    description: `Enterprise risk identified in ${fac.name}`,
    category: categories[i % categories.length]!,
    likelihood,
    impact,
    riskScore: score,
    level,
    status: ['identified', 'assessed', 'mitigating', 'monitoring', 'closed'][i % 5] as Risk['status'],
    facilityId: fac.id,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
    ownerId: `emp-${String((i % 500) + 1).padStart(5, '0')}`,
    mitigationPlan: i % 2 === 0 ? 'Implement controls and monitoring' : undefined,
    reviewDate: daysFromNow(30 + (i % 60)),
  };
});

export const MOCK_CAPA: CapaRecord[] = Array.from({ length: 2000 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const statuses = ['open', 'in_progress', 'verification', 'effectiveness_review', 'closed'] as const;
  return {
    capaId: `capa-${String(i + 1).padStart(5, '0')}`,
    title: `CAPA ${i + 1} — ${i % 2 === 0 ? 'Corrective' : 'Preventive'} action`,
    type: i % 2 === 0 ? 'corrective' as const : 'preventive' as const,
    status: statuses[i % statuses.length]!,
    incidentId: i % 3 === 0 ? `inc-${String((i % 5000) + 1).padStart(5, '0')}` : undefined,
    riskId: i % 4 === 0 ? `risk-${String((i % 2500) + 1).padStart(5, '0')}` : undefined,
    facilityId: fac.id,
    assignedTo: `emp-${String((i % 500) + 1).padStart(5, '0')}`,
    dueDate: daysFromNow(14 + (i % 45)),
    rootCause: i % 2 === 0 ? 'Process deviation identified during review' : undefined,
    actionPlan: 'Update SOP, train staff, verify effectiveness',
    verificationNotes: statuses[i % statuses.length] === 'closed' ? 'Verified effective' : undefined,
    effectivenessScore: statuses[i % statuses.length] === 'closed' ? 85 + (i % 15) : undefined,
  };
});

export const MOCK_AUDITS: AuditRecord[] = Array.from({ length: 1500 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const types = ['internal', 'external', 'regulatory', 'inspection'] as const;
  const statuses = ['scheduled', 'in_progress', 'findings', 'follow_up', 'closed'] as const;
  const status = statuses[i % statuses.length]!;
  return {
    auditId: `aud-${String(i + 1).padStart(5, '0')}`,
    title: `${types[i % types.length]!.replace('_', ' ')} audit ${i + 1}`,
    type: types[i % types.length]!,
    status,
    facilityId: fac.id,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
    scheduledDate: daysFromNow(i % 60),
    completedDate: status === 'closed' ? daysAgo(i % 30) : undefined,
    auditorId: `emp-${String((i % 200) + 1).padStart(5, '0')}`,
    score: status !== 'scheduled' ? 70 + (i % 30) : undefined,
    findingsCount: i % 8,
  };
});

export const MOCK_AUDIT_FINDINGS: AuditFinding[] = Array.from({ length: 800 }, (_, i) => ({
  findingId: `fnd-${String(i + 1).padStart(5, '0')}`,
  auditId: `aud-${String((i % 1500) + 1).padStart(5, '0')}`,
  title: `Finding ${i + 1}`,
  severity: SEVERITIES[i % SEVERITIES.length]!,
  recommendation: 'Implement corrective action and document evidence',
  status: ['open', 'in_progress', 'closed'][i % 3] as AuditFinding['status'],
  evidenceAttached: i % 2 === 0,
}));

export const MOCK_POLICIES: PolicyDocument[] = Array.from({ length: 800 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const types = ['policy', 'sop', 'guideline', 'protocol'] as const;
  const statuses = ['draft', 'review', 'approved', 'published', 'archived', 'expired'] as const;
  return {
    policyId: `pol-${String(i + 1).padStart(5, '0')}`,
    title: `${types[i % types.length]!.toUpperCase()} ${i + 1} — Clinical Quality Standard`,
    type: types[i % types.length]!,
    version: `v${1 + (i % 5)}.${i % 10}`,
    status: statuses[i % statuses.length]!,
    facilityId: i % 5 === 0 ? undefined : fac.id,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
    ownerId: `emp-${String((i % 100) + 1).padStart(5, '0')}`,
    effectiveDate: daysAgo(365 - (i % 300)),
    reviewDate: daysFromNow(30 + (i % 180)),
    expiryDate: i % 20 === 0 ? daysFromNow(-5) : daysFromNow(365),
    approvedBy: i % 3 !== 0 ? `emp-${String((i % 50) + 1).padStart(5, '0')}` : undefined,
    contentSummary: 'Enterprise policy for quality, safety, and regulatory compliance.',
  };
});

export const MOCK_ACCREDITATION: AccreditationStandard[] = Array.from({ length: 200 }, (_, i) => {
  const frameworks = ['jci', 'nabh', 'iso_9001', 'iso_15189', 'iso_27001', 'cap', 'moh'] as const;
  const score = 60 + (i % 40);
  return {
    standardId: `std-${String(i + 1).padStart(4, '0')}`,
    framework: frameworks[i % frameworks.length]!,
    code: `${frameworks[i % frameworks.length]!.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    title: `Standard ${i + 1} — ${frameworks[i % frameworks.length]!.replace('_', ' ')}`,
    description: 'Accreditation requirement for clinical quality and safety',
    complianceScore: score,
    evidenceCount: 5 + (i % 20),
    gapCount: score < 80 ? 1 + (i % 5) : 0,
    status: score >= 90 ? 'compliant' as const : score >= 75 ? 'partial' as const : score >= 60 ? 'non_compliant' as const : 'not_assessed' as const,
  };
});

export const MOCK_COMPLIANCE: ComplianceRecord[] = Array.from({ length: 150 }, (_, i) => {
  const domains = ['hipaa', 'gdpr', 'hds', 'fhir', 'audit_log', 'consent', 'documentation'] as const;
  const fac = FACILITIES[i % 25]!;
  const score = 75 + (i % 25);
  return {
    complianceId: `cmp-${String(i + 1).padStart(4, '0')}`,
    domain: domains[i % domains.length]!,
    title: `${domains[i % domains.length]!.replace('_', ' ').toUpperCase()} compliance`,
    status: score >= 90 ? 'compliant' as const : score >= 75 ? 'partial' as const : 'non_compliant' as const,
    score,
    facilityId: fac.id,
    lastReviewed: daysAgo(i % 60),
    findings: i % 6,
  };
});

export const MOCK_INFECTIONS: InfectionRecord[] = Array.from({ length: 500 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const types = ['clabsi', 'cauti', 'ssi', 'vap', 'other_hai'] as const;
  return {
    infectionId: `inf-${String(i + 1).padStart(5, '0')}`,
    type: types[i % types.length]!,
    facilityId: fac.id,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
    patientId: i % 2 === 0 ? `phr-${String((i % 500) + 1).padStart(3, '0')}` : undefined,
    detectedDate: daysAgo(i % 120),
    isolated: i % 3 !== 0,
    outbreakId: i % 15 === 0 ? `obk-${String((i % 20) + 1).padStart(3, '0')}` : undefined,
    organism: ['MRSA', 'C. diff', 'E. coli', 'Klebsiella'][i % 4],
  };
});

export const MOCK_QUALITY_INDICATORS: QualityIndicator[] = [
  'Mortality Rate', 'Readmission Rate', 'Length of Stay', 'Bed Occupancy', 'Surgical Site Infection',
  'Medication Error Rate', 'Patient Falls', 'Wait Times', 'Door-to-Needle', 'Door-to-Balloon',
  'Patient Satisfaction', 'Staff Compliance',
].flatMap((name, idx) =>
  FACILITIES.slice(0, 5).map((f, fi) => ({
    indicatorId: `qi-${idx}-${fi}`,
    name,
    category: ['clinical', 'operational', 'safety', 'experience'][idx % 4]!,
    value: 2 + (idx * 3 + fi) % 20,
    unit: idx < 4 ? '%' : idx < 8 ? 'min' : 'score',
    target: 5 + (idx % 10),
    trend: (['up', 'down', 'stable'] as const)[(idx + fi) % 3]!,
    facilityId: f.id,
    period: '2025-Q2',
  })),
);

export const MOCK_RCA: RootCauseAnalysis[] = Array.from({ length: 300 }, (_, i) => ({
  rcaId: `rca-${String(i + 1).padStart(4, '0')}`,
  capaId: `capa-${String((i % 2000) + 1).padStart(5, '0')}`,
  method: (['fishbone', 'five_whys', 'timeline'] as const)[i % 3]!,
  summary: `Root cause analysis for CAPA ${i + 1}`,
  categories: i % 3 === 0 ? ['People', 'Process', 'Equipment', 'Environment'] : undefined,
  whys: i % 3 === 1 ? ['Why 1', 'Why 2', 'Why 3', 'Why 4', 'Why 5'] : undefined,
  createdAt: daysAgo(i % 45),
}));

export function buildQualityDashboard(facilityId?: string): QualityDashboard {
  const incidents = facilityId ? MOCK_INCIDENTS.filter((i) => i.facilityId === facilityId) : MOCK_INCIDENTS;
  const risks = facilityId ? MOCK_RISKS.filter((r) => r.facilityId === facilityId) : MOCK_RISKS;
  const capa = facilityId ? MOCK_CAPA.filter((c) => c.facilityId === facilityId) : MOCK_CAPA;
  const audits = facilityId ? MOCK_AUDITS.filter((a) => a.facilityId === facilityId) : MOCK_AUDITS;
  const infections = facilityId ? MOCK_INFECTIONS.filter((i) => i.facilityId === facilityId) : MOCK_INFECTIONS;
  const compliance = facilityId ? MOCK_COMPLIANCE.filter((c) => c.facilityId === facilityId) : MOCK_COMPLIANCE;
  const policies = facilityId ? MOCK_POLICIES.filter((p) => !p.facilityId || p.facilityId === facilityId) : MOCK_POLICIES;

  const openIncidents = incidents.filter((i) => !['resolved', 'closed'].includes(i.status)).length;
  const closedCapa = capa.filter((c) => c.status === 'closed').length;
  const avgAudit = audits.filter((a) => a.score != null).reduce((s, a) => s + (a.score ?? 0), 0) / Math.max(audits.filter((a) => a.score != null).length, 1);
  const openFindings = MOCK_AUDIT_FINDINGS.filter((f) => f.status !== 'closed').length / (facilityId ? 25 : 1);
  const infectionRate = Math.round((infections.length / Math.max(incidents.length, 1)) * 1000) / 10;
  const accreditationReadiness = Math.round(MOCK_ACCREDITATION.reduce((s, a) => s + a.complianceScore, 0) / MOCK_ACCREDITATION.length);
  const compliancePercent = Math.round(compliance.reduce((s, c) => s + c.score, 0) / Math.max(compliance.length, 1));
  const publishedPolicies = policies.filter((p) => p.status === 'published').length;
  const policyCompliance = policies.length ? Math.round((publishedPolicies / policies.length) * 100) : 92;

  return {
    facilityId,
    openIncidents: facilityId ? openIncidents : Math.round(openIncidents / 25),
    escalatedIncidents: incidents.filter((i) => i.escalated).length / (facilityId ? 1 : 25),
    openRisks: risks.filter((r) => r.status !== 'closed').length / (facilityId ? 1 : 25),
    highRisks: risks.filter((r) => r.level === 'high' || r.level === 'extreme').length / (facilityId ? 1 : 25),
    openCapa: capa.filter((c) => c.status !== 'closed').length / (facilityId ? 1 : 25),
    capaCompletionRate: capa.length ? Math.round((closedCapa / capa.length) * 100) : 88,
    auditScore: Math.round(avgAudit),
    openFindings: Math.round(openFindings),
    infectionRate,
    accreditationReadiness,
    compliancePercent,
    policyCompliance,
    recentIncidents: incidents.filter((i) => i.severity === 'high' || i.severity === 'critical').slice(0, 8),
    recentCapa: capa.filter((c) => c.status !== 'closed').slice(0, 6),
    riskHeatMap: [
      { label: 'Clinical', likelihood: 4, impact: 4, count: risks.filter((r) => r.category === 'clinical').length },
      { label: 'Operational', likelihood: 3, impact: 3, count: risks.filter((r) => r.category === 'operational').length },
      { label: 'IT/Cyber', likelihood: 4, impact: 5, count: risks.filter((r) => r.category === 'it' || r.category === 'cybersecurity').length },
      { label: 'Financial', likelihood: 2, impact: 4, count: risks.filter((r) => r.category === 'financial').length },
      { label: 'Regulatory', likelihood: 3, impact: 5, count: risks.filter((r) => r.category === 'regulatory').length },
    ],
  };
}
