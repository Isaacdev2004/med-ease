/** Centralized TanStack Query keys — never inline query keys in features. */
export const queryKeys = {
  health: {
    all: ['health'] as const,
    check: () => [...queryKeys.health.all, 'check'] as const,
  },
  patients: {
    all: ['patients'] as const,
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.patients.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
    dashboard: (patientId: string) =>
      [...queryKeys.patients.all, 'dashboard', patientId] as const,
    timeline: (patientId: string) =>
      [...queryKeys.patients.all, 'timeline', patientId] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.lists(), filters ?? {}] as const,
    today: (patientId?: string) =>
      [...queryKeys.appointments.all, 'today', patientId ?? 'self'] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    upcoming: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.all, 'upcoming', filters ?? {}] as const,
    past: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.all, 'past', filters ?? {}] as const,
    calendar: (filters?: Record<string, unknown>, mode?: string) =>
      [
        ...queryKeys.appointments.all,
        'calendar',
        mode ?? 'month',
        filters ?? {},
      ] as const,
    availability: (providerId: string, facilityId: string, date: string) =>
      [
        ...queryKeys.appointments.all,
        'availability',
        providerId,
        facilityId,
        date,
      ] as const,
    facilitySchedule: (facilityId: string, date: string) =>
      [
        ...queryKeys.appointments.all,
        'facility-schedule',
        facilityId,
        date,
      ] as const,
    waitlist: () => [...queryKeys.appointments.all, 'waitlist'] as const,
    queue: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.all, 'queue', filters ?? {}] as const,
    telemedicine: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.all, 'telemedicine', filters ?? {}] as const,
    analytics: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.all, 'analytics', filters ?? {}] as const,
    slots: (providerId: string, facilityId: string, date: string) =>
      [
        ...queryKeys.appointments.all,
        'slots',
        providerId,
        facilityId,
        date,
      ] as const,
  },
  medications: {
    all: ['medications'] as const,
    library: () => [...queryKeys.medications.all, 'library'] as const,
    lists: () => [...queryKeys.medications.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.medications.lists(), filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.medications.all, 'detail', id] as const,
    today: (patientId: string) =>
      [...queryKeys.medications.all, 'today', patientId] as const,
    schedule: (patientId?: string) =>
      [...queryKeys.medications.all, 'schedule', patientId ?? 'all'] as const,
    history: (patientId: string) =>
      [...queryKeys.medications.all, 'history', patientId] as const,
    timeline: (patientId: string) =>
      [...queryKeys.medications.all, 'timeline', patientId] as const,
    reminders: (patientId?: string) =>
      [...queryKeys.medications.all, 'reminders', patientId ?? 'all'] as const,
    logs: (patientId?: string) =>
      [...queryKeys.medications.all, 'logs', patientId ?? 'all'] as const,
    dashboard: (patientId: string) =>
      [...queryKeys.medications.all, 'dashboard', patientId] as const,
    adherence: (patientId: string) =>
      [...queryKeys.medications.all, 'adherence', patientId] as const,
    interactions: (patientId: string) =>
      [...queryKeys.medications.all, 'interactions', patientId] as const,
    prescriptions: (filters?: Record<string, unknown>) =>
      [...queryKeys.medications.all, 'prescriptions', filters ?? {}] as const,
    prescription: (id: string) =>
      [...queryKeys.medications.all, 'prescription', id] as const,
    refills: (patientId?: string) =>
      [...queryKeys.medications.all, 'refills', patientId ?? 'all'] as const,
    analytics: (filters?: Record<string, unknown>) =>
      [...queryKeys.medications.all, 'analytics', filters ?? {}] as const,
    calendar: (patientId: string, month?: string) =>
      [
        ...queryKeys.medications.all,
        'calendar',
        patientId,
        month ?? 'current',
      ] as const,
    pharmacyQueue: (pharmacyId?: string) =>
      [
        ...queryKeys.medications.all,
        'pharmacy-queue',
        pharmacyId ?? 'all',
      ] as const,
    administration: (patientId?: string) =>
      [
        ...queryKeys.medications.all,
        'administration',
        patientId ?? 'all',
      ] as const,
    education: (medicationId: string) =>
      [...queryKeys.medications.all, 'education', medicationId] as const,
    favorites: (patientId?: string) =>
      [...queryKeys.medications.all, 'favorites', patientId ?? 'all'] as const,
    search: (query: string, patientId?: string) =>
      [
        ...queryKeys.medications.all,
        'search',
        query,
        patientId ?? 'all',
      ] as const,
    inventory: () => [...queryKeys.medications.all, 'inventory'] as const,
  },
  carePlans: {
    all: ['care-plans'] as const,
    lists: () => [...queryKeys.carePlans.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.carePlans.lists(), filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.carePlans.all, 'detail', id] as const,
    patientPlan: (patientId: string) =>
      [...queryKeys.carePlans.all, 'patient-plan', patientId] as const,
    goals: (patientId?: string, carePlanId?: string) =>
      [
        ...queryKeys.carePlans.all,
        'goals',
        patientId ?? 'all',
        carePlanId ?? 'all',
      ] as const,
    tasks: (patientId?: string, carePlanId?: string) =>
      [
        ...queryKeys.carePlans.all,
        'tasks',
        patientId ?? 'all',
        carePlanId ?? 'all',
      ] as const,
    todayTasks: (patientId: string) =>
      [...queryKeys.carePlans.all, 'today-tasks', patientId] as const,
    timeline: (patientId: string) =>
      [...queryKeys.carePlans.all, 'timeline', patientId] as const,
    team: (carePlanId: string) =>
      [...queryKeys.carePlans.all, 'team', carePlanId] as const,
    risks: (patientId: string, carePlanId?: string) =>
      [
        ...queryKeys.carePlans.all,
        'risks',
        patientId,
        carePlanId ?? 'all',
      ] as const,
    pathways: () => [...queryKeys.carePlans.all, 'pathways'] as const,
    pathway: (id: string) =>
      [...queryKeys.carePlans.all, 'pathway', id] as const,
    dashboard: (patientId: string) =>
      [...queryKeys.carePlans.all, 'dashboard', patientId] as const,
    progress: (patientId: string) =>
      [...queryKeys.carePlans.all, 'progress', patientId] as const,
    analytics: (filters?: Record<string, unknown>) =>
      [...queryKeys.carePlans.all, 'analytics', filters ?? {}] as const,
    activity: (carePlanId?: string) =>
      [...queryKeys.carePlans.all, 'activity', carePlanId ?? 'all'] as const,
    population: (filters?: Record<string, unknown>) =>
      [...queryKeys.carePlans.all, 'population', filters ?? {}] as const,
  },
  laboratory: {
    all: ['laboratory'] as const,
    dashboard: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'dashboard', patientId ?? 'all'] as const,
    orders: (filters?: Record<string, unknown>) =>
      [...queryKeys.laboratory.all, 'orders', filters ?? {}] as const,
    allOrders: (filters?: Record<string, unknown>) =>
      [...queryKeys.laboratory.all, 'all-orders', filters ?? {}] as const,
    order: (id: string) => [...queryKeys.laboratory.all, 'order', id] as const,
    results: (filters?: Record<string, unknown>) =>
      [...queryKeys.laboratory.all, 'results', filters ?? {}] as const,
    allResults: (filters?: Record<string, unknown>) =>
      [...queryKeys.laboratory.all, 'all-results', filters ?? {}] as const,
    result: (id: string) =>
      [...queryKeys.laboratory.all, 'result', id] as const,
    patientLab: (patientId: string) =>
      [...queryKeys.laboratory.all, 'patient-lab', patientId] as const,
    timeline: (patientId: string) =>
      [...queryKeys.laboratory.all, 'timeline', patientId] as const,
    trends: (patientId: string) =>
      [...queryKeys.laboratory.all, 'trends', patientId] as const,
    alerts: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'alerts', patientId ?? 'all'] as const,
    critical: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'critical', patientId ?? 'all'] as const,
    specimens: (orderId?: string, patientId?: string) =>
      [
        ...queryKeys.laboratory.all,
        'specimens',
        orderId ?? 'all',
        patientId ?? 'all',
      ] as const,
    analytics: () => [...queryKeys.laboratory.all, 'analytics'] as const,
    search: (query: string, patientId?: string) =>
      [
        ...queryKeys.laboratory.all,
        'search',
        query,
        patientId ?? 'all',
      ] as const,
    catalog: () => [...queryKeys.laboratory.all, 'catalog'] as const,
    referenceRanges: () =>
      [...queryKeys.laboratory.all, 'reference-ranges'] as const,
    pending: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'pending', patientId ?? 'all'] as const,
    quality: () => [...queryKeys.laboratory.all, 'quality'] as const,
    favorites: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'favorites', patientId ?? 'all'] as const,
    microbiology: (patientId?: string) =>
      [
        ...queryKeys.laboratory.all,
        'microbiology',
        patientId ?? 'all',
      ] as const,
    pathology: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'pathology', patientId ?? 'all'] as const,
    bloodBank: (patientId?: string) =>
      [...queryKeys.laboratory.all, 'blood-bank', patientId ?? 'all'] as const,
    instruments: () => [...queryKeys.laboratory.all, 'instruments'] as const,
    trendAnalysis: (patientId: string, testId?: string) =>
      [
        ...queryKeys.laboratory.all,
        'trend-analysis',
        patientId,
        testId ?? 'all',
      ] as const,
  },
  radiology: {
    all: ['radiology'] as const,
    dashboard: (patientId?: string) =>
      [...queryKeys.radiology.all, 'dashboard', patientId ?? 'all'] as const,
    studies: (filters?: Record<string, unknown>) =>
      [...queryKeys.radiology.all, 'studies', filters ?? {}] as const,
    allStudies: (filters?: Record<string, unknown>) =>
      [...queryKeys.radiology.all, 'all-studies', filters ?? {}] as const,
    study: (id: string) => [...queryKeys.radiology.all, 'study', id] as const,
    report: (id: string) => [...queryKeys.radiology.all, 'report', id] as const,
    patientImaging: (patientId: string) =>
      [...queryKeys.radiology.all, 'patient-imaging', patientId] as const,
    history: (patientId: string) =>
      [...queryKeys.radiology.all, 'history', patientId] as const,
    timeline: (patientId: string) =>
      [...queryKeys.radiology.all, 'timeline', patientId] as const,
    critical: (patientId?: string) =>
      [...queryKeys.radiology.all, 'critical', patientId ?? 'all'] as const,
    pending: () => [...queryKeys.radiology.all, 'pending'] as const,
    viewer: (studyId: string) =>
      [...queryKeys.radiology.all, 'viewer', studyId] as const,
    annotations: (studyId: string) =>
      [...queryKeys.radiology.all, 'annotations', studyId] as const,
    measurements: (studyId: string) =>
      [...queryKeys.radiology.all, 'measurements', studyId] as const,
    analytics: () => [...queryKeys.radiology.all, 'analytics'] as const,
    comparison: (studyId: string, compareId: string) =>
      [...queryKeys.radiology.all, 'comparison', studyId, compareId] as const,
    favorites: (patientId?: string) =>
      [...queryKeys.radiology.all, 'favorites', patientId ?? 'all'] as const,
    devices: () => [...queryKeys.radiology.all, 'devices'] as const,
    radiologistDashboard: (id?: string) =>
      [
        ...queryKeys.radiology.all,
        'radiologist-dashboard',
        id ?? 'all',
      ] as const,
    facilityImaging: (facilityId?: string) =>
      [
        ...queryKeys.radiology.all,
        'facility-imaging',
        facilityId ?? 'all',
      ] as const,
    search: (query: string, patientId?: string) =>
      [
        ...queryKeys.radiology.all,
        'search',
        query,
        patientId ?? 'all',
      ] as const,
  },
  telemedicine: {
    all: ['telemedicine'] as const,
    dashboard: (patientId?: string, clinicianId?: string) =>
      [
        ...queryKeys.telemedicine.all,
        'dashboard',
        patientId ?? 'all',
        clinicianId ?? 'all',
      ] as const,
    sessions: (filters?: Record<string, unknown>) =>
      [...queryKeys.telemedicine.all, 'sessions', filters ?? {}] as const,
    session: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'session', sessionId] as const,
    participants: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'participants', sessionId] as const,
    messages: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'messages', sessionId] as const,
    waitingRoom: (sessionId?: string) =>
      [
        ...queryKeys.telemedicine.all,
        'waiting-room',
        sessionId ?? 'all',
      ] as const,
    recordings: (sessionId?: string) =>
      [
        ...queryKeys.telemedicine.all,
        'recordings',
        sessionId ?? 'all',
      ] as const,
    clinicalNotes: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'clinical-notes', sessionId] as const,
    transcript: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'transcript', sessionId] as const,
    analytics: () => [...queryKeys.telemedicine.all, 'analytics'] as const,
    providerAvailability: () =>
      [...queryKeys.telemedicine.all, 'provider-availability'] as const,
    deviceCheck: (sessionId?: string) =>
      [
        ...queryKeys.telemedicine.all,
        'device-check',
        sessionId ?? 'all',
      ] as const,
    bandwidth: () => [...queryKeys.telemedicine.all, 'bandwidth'] as const,
    timeline: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'timeline', sessionId] as const,
    search: (query: string, patientId?: string) =>
      [
        ...queryKeys.telemedicine.all,
        'search',
        query,
        patientId ?? 'all',
      ] as const,
    attachments: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'attachments', sessionId] as const,
    whiteboard: (sessionId: string) =>
      [...queryKeys.telemedicine.all, 'whiteboard', sessionId] as const,
    favorites: (patientId?: string) =>
      [...queryKeys.telemedicine.all, 'favorites', patientId ?? 'all'] as const,
  },
  billing: {
    all: ['billing'] as const,
    dashboard: (patientId?: string, providerId?: string, facilityId?: string) =>
      [
        ...queryKeys.billing.all,
        'dashboard',
        patientId ?? 'all',
        providerId ?? 'all',
        facilityId ?? 'all',
      ] as const,
    invoices: (filters?: Record<string, unknown>) =>
      [...queryKeys.billing.all, 'invoices', filters ?? {}] as const,
    invoice: (invoiceId: string) =>
      [...queryKeys.billing.all, 'invoice', invoiceId] as const,
    claims: (filters?: Record<string, unknown>) =>
      [...queryKeys.billing.all, 'claims', filters ?? {}] as const,
    claim: (claimId: string) =>
      [...queryKeys.billing.all, 'claim', claimId] as const,
    payments: (filters?: Record<string, unknown>) =>
      [...queryKeys.billing.all, 'payments', filters ?? {}] as const,
    receipts: (filters?: Record<string, unknown>) =>
      [...queryKeys.billing.all, 'receipts', filters ?? {}] as const,
    insurance: (patientId?: string) =>
      [...queryKeys.billing.all, 'insurance', patientId ?? 'all'] as const,
    analytics: () => [...queryKeys.billing.all, 'analytics'] as const,
    outstanding: (patientId?: string) =>
      [...queryKeys.billing.all, 'outstanding', patientId ?? 'all'] as const,
    refunds: (filters?: Record<string, unknown>) =>
      [...queryKeys.billing.all, 'refunds', filters ?? {}] as const,
    timeline: (invoiceId: string) =>
      [...queryKeys.billing.all, 'timeline', invoiceId] as const,
    search: (query: string, patientId?: string) =>
      [...queryKeys.billing.all, 'search', query, patientId ?? 'all'] as const,
    favorites: (patientId?: string) =>
      [...queryKeys.billing.all, 'favorites', patientId ?? 'all'] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    dashboard: (department?: string, warehouseId?: string) =>
      [
        ...queryKeys.inventory.all,
        'dashboard',
        department ?? 'all',
        warehouseId ?? 'all',
      ] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.inventory.all, 'list', filters ?? {}] as const,
    item: (inventoryId: string) =>
      [...queryKeys.inventory.all, 'item', inventoryId] as const,
    movements: (filters?: Record<string, unknown>) =>
      [...queryKeys.inventory.all, 'movements', filters ?? {}] as const,
    purchaseOrders: (filters?: Record<string, unknown>) =>
      [...queryKeys.inventory.all, 'purchase-orders', filters ?? {}] as const,
    suppliers: () => [...queryKeys.inventory.all, 'suppliers'] as const,
    warehouses: () => [...queryKeys.inventory.all, 'warehouses'] as const,
    assets: (filters?: Record<string, unknown>) =>
      [...queryKeys.inventory.all, 'assets', filters ?? {}] as const,
    transfers: (filters?: Record<string, unknown>) =>
      [...queryKeys.inventory.all, 'transfers', filters ?? {}] as const,
    expiry: (department?: string) =>
      [...queryKeys.inventory.all, 'expiry', department ?? 'all'] as const,
    forecast: (inventoryId?: string) =>
      [...queryKeys.inventory.all, 'forecast', inventoryId ?? 'all'] as const,
    analytics: () => [...queryKeys.inventory.all, 'analytics'] as const,
    barcode: (code: string) =>
      [...queryKeys.inventory.all, 'barcode', code] as const,
    search: (query: string, department?: string) =>
      [
        ...queryKeys.inventory.all,
        'search',
        query,
        department ?? 'all',
      ] as const,
    favorites: (userId?: string) =>
      [...queryKeys.inventory.all, 'favorites', userId ?? 'all'] as const,
  },
  procurement: {
    all: ['procurement'] as const,
    dashboard: (department?: string) =>
      [...queryKeys.procurement.all, 'dashboard', department ?? 'all'] as const,
    requests: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'requests', filters ?? {}] as const,
    request: (requestId: string) =>
      [...queryKeys.procurement.all, 'request', requestId] as const,
    purchaseOrders: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'purchase-orders', filters ?? {}] as const,
    purchaseOrder: (purchaseOrderId: string) =>
      [
        ...queryKeys.procurement.all,
        'purchase-order',
        purchaseOrderId,
      ] as const,
    rfqs: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'rfqs', filters ?? {}] as const,
    suppliers: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'suppliers', filters ?? {}] as const,
    supplier: (supplierId: string) =>
      [...queryKeys.procurement.all, 'supplier', supplierId] as const,
    contracts: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'contracts', filters ?? {}] as const,
    budgets: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'budgets', filters ?? {}] as const,
    receiving: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'receiving', filters ?? {}] as const,
    deliveries: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'deliveries', filters ?? {}] as const,
    shipments: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'shipments', filters ?? {}] as const,
    invoices: (filters?: Record<string, unknown>) =>
      [...queryKeys.procurement.all, 'invoices', filters ?? {}] as const,
    analytics: () => [...queryKeys.procurement.all, 'analytics'] as const,
    forecast: (department?: string) =>
      [...queryKeys.procurement.all, 'forecast', department ?? 'all'] as const,
    approvalQueue: () =>
      [...queryKeys.procurement.all, 'approval-queue'] as const,
    supplierPerformance: () =>
      [...queryKeys.procurement.all, 'supplier-performance'] as const,
    spendAnalysis: (department?: string) =>
      [
        ...queryKeys.procurement.all,
        'spend-analysis',
        department ?? 'all',
      ] as const,
    favorites: (userId?: string) =>
      [...queryKeys.procurement.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, department?: string) =>
      [
        ...queryKeys.procurement.all,
        'search',
        query,
        department ?? 'all',
      ] as const,
  },
  workforce: {
    all: ['workforce'] as const,
    dashboard: (facilityId?: string, departmentId?: string) =>
      [
        ...queryKeys.workforce.all,
        'dashboard',
        facilityId ?? 'all',
        departmentId ?? 'all',
      ] as const,
    employees: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'employees', filters ?? {}] as const,
    employee: (employeeId: string) =>
      [...queryKeys.workforce.all, 'employee', employeeId] as const,
    departments: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'departments', filters ?? {}] as const,
    roles: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'roles', filters ?? {}] as const,
    attendance: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'attendance', filters ?? {}] as const,
    timesheets: (employeeId?: string) =>
      [...queryKeys.workforce.all, 'timesheets', employeeId ?? 'all'] as const,
    training: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'training', filters ?? {}] as const,
    credentials: (employeeId: string) =>
      [...queryKeys.workforce.all, 'credentials', employeeId] as const,
    performance: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'performance', filters ?? {}] as const,
    leave: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'leave', filters ?? {}] as const,
    roster: (departmentId?: string) =>
      [...queryKeys.workforce.all, 'roster', departmentId ?? 'all'] as const,
    calendar: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'calendar', filters ?? {}] as const,
    analytics: () => [...queryKeys.workforce.all, 'analytics'] as const,
    organization: () => [...queryKeys.workforce.all, 'organization'] as const,
    coverage: (departmentId?: string) =>
      [...queryKeys.workforce.all, 'coverage', departmentId ?? 'all'] as const,
    availability: (employeeId?: string) =>
      [
        ...queryKeys.workforce.all,
        'availability',
        employeeId ?? 'all',
      ] as const,
    onCall: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'onCall', filters ?? {}] as const,
    payroll: (filters?: Record<string, unknown>) =>
      [...queryKeys.workforce.all, 'payroll', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.workforce.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [
        ...queryKeys.workforce.all,
        'search',
        query,
        facilityId ?? 'all',
      ] as const,
  },
  monitoring: {
    all: ['patient-monitoring'] as const,
    dashboard: (patientId?: string) =>
      [...queryKeys.monitoring.all, 'dashboard', patientId ?? 'all'] as const,
    patients: (filters?: Record<string, unknown>) =>
      [...queryKeys.monitoring.all, 'patients', filters ?? {}] as const,
    observations: (filters?: Record<string, unknown>) =>
      [...queryKeys.monitoring.all, 'observations', filters ?? {}] as const,
    observation: (id: string) =>
      [...queryKeys.monitoring.all, 'observation', id] as const,
    vitals: (patientId: string, filters?: Record<string, unknown>) =>
      [
        ...queryKeys.monitoring.all,
        'vitals',
        patientId,
        filters ?? {},
      ] as const,
    timeline: (patientId: string) =>
      [...queryKeys.monitoring.all, 'timeline', patientId] as const,
    alerts: (patientId?: string, filters?: Record<string, unknown>) =>
      [
        ...queryKeys.monitoring.all,
        'alerts',
        patientId ?? 'all',
        filters ?? {},
      ] as const,
    devices: (patientId?: string) =>
      [...queryKeys.monitoring.all, 'devices', patientId ?? 'all'] as const,
    device: (id: string) =>
      [...queryKeys.monitoring.all, 'device', id] as const,
    analytics: () => [...queryKeys.monitoring.all, 'analytics'] as const,
    rpm: (patientId?: string) =>
      [...queryKeys.monitoring.all, 'rpm', patientId ?? 'all'] as const,
    scores: (patientId?: string) =>
      [...queryKeys.monitoring.all, 'scores', patientId ?? 'all'] as const,
    history: (patientId: string) =>
      [...queryKeys.monitoring.all, 'history', patientId] as const,
    favorites: (patientId: string) =>
      [...queryKeys.monitoring.all, 'favorites', patientId] as const,
    search: (query: string, patientId?: string) =>
      [
        ...queryKeys.monitoring.all,
        'search',
        query,
        patientId ?? 'all',
      ] as const,
    trendAnalysis: (patientId: string, metric?: string) =>
      [
        ...queryKeys.monitoring.all,
        'trendAnalysis',
        patientId,
        metric ?? 'all',
      ] as const,
  },
  facilities: {
    all: ['facilities'] as const,
    list: () => [...queryKeys.facilities.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.facilities.all, 'detail', id] as const,
    beds: (facilityId: string) =>
      [...queryKeys.facilities.all, 'beds', facilityId] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.facilities.all, 'dashboard', facilityId ?? 'all'] as const,
    facilities: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'facilities', filters ?? {}] as const,
    facility: (facilityId: string) =>
      [...queryKeys.facilities.all, 'facility', facilityId] as const,
    buildings: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'buildings', filters ?? {}] as const,
    rooms: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'rooms', filters ?? {}] as const,
    bedsList: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'beds-list', filters ?? {}] as const,
    equipment: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'equipment', filters ?? {}] as const,
    devices: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'devices', filters ?? {}] as const,
    maintenance: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'maintenance', filters ?? {}] as const,
    workOrders: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'work-orders', filters ?? {}] as const,
    preventive: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'preventive', filters ?? {}] as const,
    calibration: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'calibration', filters ?? {}] as const,
    inspection: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'inspection', filters ?? {}] as const,
    utilities: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'utilities', filters ?? {}] as const,
    environment: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'environment', filters ?? {}] as const,
    vendors: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'vendors', filters ?? {}] as const,
    contracts: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'contracts', filters ?? {}] as const,
    vehicles: (filters?: Record<string, unknown>) =>
      [...queryKeys.facilities.all, 'vehicles', filters ?? {}] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.facilities.all, 'analytics', facilityId ?? 'all'] as const,
    favorites: (userId?: string) =>
      [...queryKeys.facilities.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [
        ...queryKeys.facilities.all,
        'search',
        query,
        facilityId ?? 'all',
      ] as const,
  },
  finance: {
    all: ['finance'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.finance.all, 'dashboard', facilityId ?? 'all'] as const,
    accounts: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'accounts', filters ?? {}] as const,
    journals: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'journals', filters ?? {}] as const,
    ledger: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'ledger', filters ?? {}] as const,
    trialBalance: (facilityId?: string) =>
      [...queryKeys.finance.all, 'trial-balance', facilityId ?? 'all'] as const,
    accountsPayable: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'accounts-payable', filters ?? {}] as const,
    accountsReceivable: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'accounts-receivable', filters ?? {}] as const,
    cash: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'cash', filters ?? {}] as const,
    banks: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'banks', filters ?? {}] as const,
    budgets: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'budgets', filters ?? {}] as const,
    budgetVariance: (facilityId?: string) =>
      [
        ...queryKeys.finance.all,
        'budget-variance',
        facilityId ?? 'all',
      ] as const,
    assets: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'assets', filters ?? {}] as const,
    depreciation: (filters?: Record<string, unknown>) =>
      [...queryKeys.finance.all, 'depreciation', filters ?? {}] as const,
    financialStatements: (facilityId?: string, asOfDate?: string) =>
      [
        ...queryKeys.finance.all,
        'financial-statements',
        facilityId ?? 'all',
        asOfDate ?? 'latest',
      ] as const,
    revenue: (facilityId?: string) =>
      [...queryKeys.finance.all, 'revenue', facilityId ?? 'all'] as const,
    expenses: (facilityId?: string) =>
      [...queryKeys.finance.all, 'expenses', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.finance.all, 'analytics', facilityId ?? 'all'] as const,
    favorites: (userId?: string) =>
      [...queryKeys.finance.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [...queryKeys.finance.all, 'search', query, facilityId ?? 'all'] as const,
  },
  quality: {
    all: ['quality'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.quality.all, 'dashboard', facilityId ?? 'all'] as const,
    incidents: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'incidents', filters ?? {}] as const,
    incident: (incidentId: string) =>
      [...queryKeys.quality.all, 'incident', incidentId] as const,
    risks: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'risks', filters ?? {}] as const,
    riskRegister: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'risk-register', filters ?? {}] as const,
    capa: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'capa', filters ?? {}] as const,
    audits: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'audits', filters ?? {}] as const,
    inspections: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'inspections', filters ?? {}] as const,
    policies: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'policies', filters ?? {}] as const,
    documents: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'documents', filters ?? {}] as const,
    accreditation: (framework?: string) =>
      [...queryKeys.quality.all, 'accreditation', framework ?? 'all'] as const,
    compliance: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'compliance', filters ?? {}] as const,
    infection: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'infection', filters ?? {}] as const,
    qualityIndicators: (filters?: Record<string, unknown>) =>
      [...queryKeys.quality.all, 'quality-indicators', filters ?? {}] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.quality.all, 'analytics', facilityId ?? 'all'] as const,
    favorites: (userId?: string) =>
      [...queryKeys.quality.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [...queryKeys.quality.all, 'search', query, facilityId ?? 'all'] as const,
  },
  phm: {
    all: ['phm'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.phm.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.phm.all, 'analytics', facilityId ?? 'all'] as const,
    population: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'population', filters ?? {}] as const,
    highRiskPatients: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'high-risk-patients', filters ?? {}] as const,
    registries: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'registries', filters ?? {}] as const,
    careGaps: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'care-gaps', filters ?? {}] as const,
    riskScores: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'risk-scores', filters ?? {}] as const,
    cohorts: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'cohorts', filters ?? {}] as const,
    chronicPrograms: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'chronic-programs', filters ?? {}] as const,
    preventiveCare: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'preventive-care', filters ?? {}] as const,
    outreach: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'outreach', filters ?? {}] as const,
    communityHealth: (filters?: Record<string, unknown>) =>
      [...queryKeys.phm.all, 'community-health', filters ?? {}] as const,
    geographicRegions: () =>
      [...queryKeys.phm.all, 'geographic-regions'] as const,
    favorites: (userId?: string) =>
      [...queryKeys.phm.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [...queryKeys.phm.all, 'search', query, facilityId ?? 'all'] as const,
  },
  cdss: {
    all: ['cdss'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.cdss.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.cdss.all, 'analytics', facilityId ?? 'all'] as const,
    alerts: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'alerts', filters ?? {}] as const,
    recommendations: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'recommendations', filters ?? {}] as const,
    guidelines: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'guidelines', filters ?? {}] as const,
    orderSets: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'order-sets', filters ?? {}] as const,
    pathways: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'pathways', filters ?? {}] as const,
    calculators: () => [...queryKeys.cdss.all, 'calculators'] as const,
    diagnostics: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'diagnostics', filters ?? {}] as const,
    drugSafety: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'drug-safety', filters ?? {}] as const,
    preventive: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'preventive', filters ?? {}] as const,
    rules: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'rules', filters ?? {}] as const,
    protocols: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'protocols', filters ?? {}] as const,
    evidence: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'evidence', filters ?? {}] as const,
    decisionTrees: () => [...queryKeys.cdss.all, 'decision-trees'] as const,
    audit: (filters?: Record<string, unknown>) =>
      [...queryKeys.cdss.all, 'audit', filters ?? {}] as const,
    timeline: (facilityId?: string) =>
      [...queryKeys.cdss.all, 'timeline', facilityId ?? 'all'] as const,
    favorites: (userId?: string) =>
      [...queryKeys.cdss.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [...queryKeys.cdss.all, 'search', query, facilityId ?? 'all'] as const,
  },
  interoperability: {
    all: ['interoperability'] as const,
    dashboard: (facilityId?: string) =>
      [
        ...queryKeys.interoperability.all,
        'dashboard',
        facilityId ?? 'all',
      ] as const,
    analytics: (facilityId?: string) =>
      [
        ...queryKeys.interoperability.all,
        'analytics',
        facilityId ?? 'all',
      ] as const,
    endpoints: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'endpoints', filters ?? {}] as const,
    fhirServers: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.interoperability.all,
        'fhir-servers',
        filters ?? {},
      ] as const,
    hl7: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'hl7', filters ?? {}] as const,
    dicom: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'dicom', filters ?? {}] as const,
    cda: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'cda', filters ?? {}] as const,
    mappings: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'mappings', filters ?? {}] as const,
    subscriptions: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.interoperability.all,
        'subscriptions',
        filters ?? {},
      ] as const,
    queue: () => [...queryKeys.interoperability.all, 'queue'] as const,
    jobs: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'jobs', filters ?? {}] as const,
    webhooks: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'webhooks', filters ?? {}] as const,
    apiClients: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.interoperability.all,
        'api-clients',
        filters ?? {},
      ] as const,
    smartApps: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'smart-apps', filters ?? {}] as const,
    audit: (filters?: Record<string, unknown>) =>
      [...queryKeys.interoperability.all, 'audit', filters ?? {}] as const,
    terminology: () =>
      [...queryKeys.interoperability.all, 'terminology'] as const,
    favorites: (userId?: string) =>
      [
        ...queryKeys.interoperability.all,
        'favorites',
        userId ?? 'all',
      ] as const,
    search: (query: string, facilityId?: string) =>
      [
        ...queryKeys.interoperability.all,
        'search',
        query,
        facilityId ?? 'all',
      ] as const,
  },
  research: {
    all: ['research'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.research.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.research.all, 'analytics', facilityId ?? 'all'] as const,
    trials: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'trials', filters ?? {}] as const,
    trial: (trialId: string) =>
      [...queryKeys.research.all, 'trial', trialId] as const,
    participants: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'participants', filters ?? {}] as const,
    visits: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'visits', filters ?? {}] as const,
    investigators: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'investigators', filters ?? {}] as const,
    sites: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'sites', filters ?? {}] as const,
    consent: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'consent', filters ?? {}] as const,
    protocol: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'protocol', filters ?? {}] as const,
    adverseEvents: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'adverse-events', filters ?? {}] as const,
    safetyBoard: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'safety-board', filters ?? {}] as const,
    biospecimens: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'biospecimens', filters ?? {}] as const,
    publications: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'publications', filters ?? {}] as const,
    innovation: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'innovation', filters ?? {}] as const,
    audit: (filters?: Record<string, unknown>) =>
      [...queryKeys.research.all, 'audit', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.research.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [
        ...queryKeys.research.all,
        'search',
        query,
        facilityId ?? 'all',
      ] as const,
  },
  publicHealth: {
    all: ['publicHealth'] as const,
    dashboard: (facilityId?: string) =>
      [
        ...queryKeys.publicHealth.all,
        'dashboard',
        facilityId ?? 'all',
      ] as const,
    analytics: (facilityId?: string) =>
      [
        ...queryKeys.publicHealth.all,
        'analytics',
        facilityId ?? 'all',
      ] as const,
    cases: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'cases', filters ?? {}] as const,
    case: (caseId: string) =>
      [...queryKeys.publicHealth.all, 'case', caseId] as const,
    outbreaks: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'outbreaks', filters ?? {}] as const,
    contactTracing: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.publicHealth.all,
        'contact-tracing',
        filters ?? {},
      ] as const,
    immunizations: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'immunizations', filters ?? {}] as const,
    registries: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'registries', filters ?? {}] as const,
    communityPrograms: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.publicHealth.all,
        'community-programs',
        filters ?? {},
      ] as const,
    maternalHealth: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.publicHealth.all,
        'maternal-health',
        filters ?? {},
      ] as const,
    childHealth: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'child-health', filters ?? {}] as const,
    schoolHealth: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'school-health', filters ?? {}] as const,
    occupationalHealth: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.publicHealth.all,
        'occupational-health',
        filters ?? {},
      ] as const,
    environmentalHealth: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.publicHealth.all,
        'environmental-health',
        filters ?? {},
      ] as const,
    sdoh: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'sdoh', filters ?? {}] as const,
    audit: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicHealth.all, 'audit', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.publicHealth.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [
        ...queryKeys.publicHealth.all,
        'search',
        query,
        facilityId ?? 'all',
      ] as const,
  },
  ai: {
    all: ['ai'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.ai.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.ai.all, 'analytics', facilityId ?? 'all'] as const,
    predictions: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'predictions', filters ?? {}] as const,
    prediction: (predictionId: string) =>
      [...queryKeys.ai.all, 'prediction', predictionId] as const,
    riskScores: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'risk-scores', filters ?? {}] as const,
    recommendations: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'recommendations', filters ?? {}] as const,
    copilotSessions: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'copilot-sessions', filters ?? {}] as const,
    clinicalSummaries: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'clinical-summaries', filters ?? {}] as const,
    forecasts: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'forecasts', filters ?? {}] as const,
    modelRegistry: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'model-registry', filters ?? {}] as const,
    modelPerformance: (modelId?: string) =>
      [...queryKeys.ai.all, 'model-performance', modelId ?? 'all'] as const,
    biasMonitoring: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'bias-monitoring', filters ?? {}] as const,
    explainability: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'explainability', filters ?? {}] as const,
    audit: (filters?: Record<string, unknown>) =>
      [...queryKeys.ai.all, 'audit', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.ai.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [...queryKeys.ai.all, 'search', query, facilityId ?? 'all'] as const,
  },
  executive: {
    all: ['executive'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.executive.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.executive.all, 'analytics', facilityId ?? 'all'] as const,
    enterpriseKpis: (filters?: Record<string, unknown>) =>
      [...queryKeys.executive.all, 'enterprise-kpis', filters ?? {}] as const,
    operationalMetrics: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.executive.all,
        'operational-metrics',
        filters ?? {},
      ] as const,
    departmentScorecards: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.executive.all,
        'department-scorecards',
        filters ?? {},
      ] as const,
    hospitalOperations: (facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'hospital-operations',
        facilityId ?? 'all',
      ] as const,
    capacityAnalytics: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.executive.all,
        'capacity-analytics',
        filters ?? {},
      ] as const,
    patientFlow: (facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'patient-flow',
        facilityId ?? 'all',
      ] as const,
    revenueDashboard: (facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'revenue-dashboard',
        facilityId ?? 'all',
      ] as const,
    qualityDashboard: (facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'quality-dashboard',
        facilityId ?? 'all',
      ] as const,
    workforceDashboard: (facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'workforce-dashboard',
        facilityId ?? 'all',
      ] as const,
    populationDashboard: (facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'population-dashboard',
        facilityId ?? 'all',
      ] as const,
    forecasts: (filters?: Record<string, unknown>) =>
      [...queryKeys.executive.all, 'forecasts', filters ?? {}] as const,
    strategicInitiatives: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.executive.all,
        'strategic-initiatives',
        filters ?? {},
      ] as const,
    alerts: (filters?: Record<string, unknown>) =>
      [...queryKeys.executive.all, 'alerts', filters ?? {}] as const,
    benchmarks: (filters?: Record<string, unknown>) =>
      [...queryKeys.executive.all, 'benchmarks', filters ?? {}] as const,
    audit: (filters?: Record<string, unknown>) =>
      [...queryKeys.executive.all, 'audit', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.executive.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, facilityId?: string) =>
      [
        ...queryKeys.executive.all,
        'search',
        query,
        facilityId ?? 'all',
      ] as const,
  },
  iam: {
    all: ['iam'] as const,
    dashboard: (tenantId?: string) =>
      [...queryKeys.iam.all, 'dashboard', tenantId ?? 'all'] as const,
    analytics: (tenantId?: string) =>
      [...queryKeys.iam.all, 'analytics', tenantId ?? 'all'] as const,
    users: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'users', filters ?? {}] as const,
    user: (userId: string) => [...queryKeys.iam.all, 'user', userId] as const,
    tenants: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'tenants', filters ?? {}] as const,
    organizations: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'organizations', filters ?? {}] as const,
    roles: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'roles', filters ?? {}] as const,
    permissions: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'permissions', filters ?? {}] as const,
    policies: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'policies', filters ?? {}] as const,
    sessions: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'sessions', filters ?? {}] as const,
    loginHistory: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'login-history', filters ?? {}] as const,
    mfaDevices: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'mfa-devices', filters ?? {}] as const,
    trustedDevices: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'trusted-devices', filters ?? {}] as const,
    oauthClients: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'oauth-clients', filters ?? {}] as const,
    apiKeys: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'api-keys', filters ?? {}] as const,
    consents: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'consents', filters ?? {}] as const,
    delegations: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'delegations', filters ?? {}] as const,
    proxyAccess: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'proxy-access', filters ?? {}] as const,
    breakGlass: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'break-glass', filters ?? {}] as const,
    auditEvents: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'audit-events', filters ?? {}] as const,
    securityIncidents: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'security-incidents', filters ?? {}] as const,
    riskScores: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'risk-scores', filters ?? {}] as const,
    samlProviders: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'saml-providers', filters ?? {}] as const,
    oidcProviders: (filters?: Record<string, unknown>) =>
      [...queryKeys.iam.all, 'oidc-providers', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.iam.all, 'favorites', userId ?? 'all'] as const,
    search: (query: string, tenantId?: string) =>
      [...queryKeys.iam.all, 'search', query, tenantId ?? 'all'] as const,
  },
  documents: {
    all: ['documents'] as const,
    dashboard: (tenantId?: string, facilityId?: string) =>
      [
        ...queryKeys.documents.all,
        'dashboard',
        tenantId ?? 'all',
        facilityId ?? 'all',
      ] as const,
    analytics: (tenantId?: string, facilityId?: string) =>
      [
        ...queryKeys.documents.all,
        'analytics',
        tenantId ?? 'all',
        facilityId ?? 'all',
      ] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'list', filters ?? {}] as const,
    detail: (documentId: string) =>
      [...queryKeys.documents.all, 'detail', documentId] as const,
    folders: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'folders', filters ?? {}] as const,
    categories: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'categories', filters ?? {}] as const,
    templates: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'templates', filters ?? {}] as const,
    versions: (documentId: string) =>
      [...queryKeys.documents.all, 'versions', documentId] as const,
    metadata: (documentId: string) =>
      [...queryKeys.documents.all, 'metadata', documentId] as const,
    search: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'search', query, filters ?? {}] as const,
    ocr: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'ocr', filters ?? {}] as const,
    signatureRequests: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.documents.all,
        'signature-requests',
        filters ?? {},
      ] as const,
    signatures: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'signatures', filters ?? {}] as const,
    sharedLinks: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'shared-links', filters ?? {}] as const,
    retention: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'retention', filters ?? {}] as const,
    legalHolds: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'legal-holds', filters ?? {}] as const,
    archives: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'archives', filters ?? {}] as const,
    records: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'records', filters ?? {}] as const,
    accessLogs: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, 'access-logs', filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.documents.all, 'favorites', userId ?? 'all'] as const,
  },
  apiPlatform: {
    all: ['api-platform'] as const,
    dashboard: (partnerId?: string) =>
      [...queryKeys.apiPlatform.all, 'dashboard', partnerId ?? 'all'] as const,
    analytics: (partnerId?: string) =>
      [...queryKeys.apiPlatform.all, 'analytics', partnerId ?? 'all'] as const,
    apiKeys: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'api-keys', filters ?? {}] as const,
    apiKey: (keyId: string) =>
      [...queryKeys.apiPlatform.all, 'api-key', keyId] as const,
    oauthApps: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'oauth-apps', filters ?? {}] as const,
    oauthApp: (appId: string) =>
      [...queryKeys.apiPlatform.all, 'oauth-app', appId] as const,
    webhooks: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'webhooks', filters ?? {}] as const,
    webhook: (webhookId: string) =>
      [...queryKeys.apiPlatform.all, 'webhook', webhookId] as const,
    webhookDeliveries: (filters?: Record<string, unknown>) =>
      [
        ...queryKeys.apiPlatform.all,
        'webhook-deliveries',
        filters ?? {},
      ] as const,
    sdkPackages: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'sdk-packages', filters ?? {}] as const,
    rateLimitPolicies: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'rate-limits', filters ?? {}] as const,
    endpoints: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'endpoints', filters ?? {}] as const,
    apiVersions: () => [...queryKeys.apiPlatform.all, 'api-versions'] as const,
    openApiSpecs: () =>
      [...queryKeys.apiPlatform.all, 'openapi-specs'] as const,
    openApiPreview: (specId: string) =>
      [...queryKeys.apiPlatform.all, 'openapi-preview', specId] as const,
    partners: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'partners', filters ?? {}] as const,
    partner: (partnerId: string) =>
      [...queryKeys.apiPlatform.all, 'partner', partnerId] as const,
    sandboxes: (filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'sandboxes', filters ?? {}] as const,
    search: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.apiPlatform.all, 'search', query, filters ?? {}] as const,
  },
  workflows: {
    all: ['workflows'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.workflows.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.workflows.all, 'analytics', facilityId ?? 'all'] as const,
    definitions: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'definitions', filters ?? {}] as const,
    definition: (workflowId: string) =>
      [...queryKeys.workflows.all, 'definition', workflowId] as const,
    instances: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'instances', filters ?? {}] as const,
    instance: (instanceId: string) =>
      [...queryKeys.workflows.all, 'instance', instanceId] as const,
    tasks: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'tasks', filters ?? {}] as const,
    approvals: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'approvals', filters ?? {}] as const,
    rules: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'rules', filters ?? {}] as const,
    schedules: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'schedules', filters ?? {}] as const,
    jobs: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'jobs', filters ?? {}] as const,
    events: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'events', filters ?? {}] as const,
    eventQueues: () => [...queryKeys.workflows.all, 'event-queues'] as const,
    slas: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'slas', filters ?? {}] as const,
    escalations: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'escalations', filters ?? {}] as const,
    templates: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'templates', filters ?? {}] as const,
    triggers: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'triggers', filters ?? {}] as const,
    audits: (filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'audits', filters ?? {}] as const,
    search: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.workflows.all, 'search', query, filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.workflows.all, 'favorites', userId ?? 'all'] as const,
  },
  platformAdmin: {
    all: ['platformAdmin'] as const,
    dashboard: (tenantId?: string) =>
      [...queryKeys.platformAdmin.all, 'dashboard', tenantId ?? 'all'] as const,
    analytics: (tenantId?: string) =>
      [...queryKeys.platformAdmin.all, 'analytics', tenantId ?? 'all'] as const,
    tenants: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'tenants', filters ?? {}] as const,
    tenant: (tenantId: string) =>
      [...queryKeys.platformAdmin.all, 'tenant', tenantId] as const,
    hospitals: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'hospitals', filters ?? {}] as const,
    facilities: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'facilities', filters ?? {}] as const,
    departments: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'departments', filters ?? {}] as const,
    localization: (tenantId?: string) =>
      [
        ...queryKeys.platformAdmin.all,
        'localization',
        tenantId ?? 'default',
      ] as const,
    localizations: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'localizations', filters ?? {}] as const,
    branding: (tenantId?: string) =>
      [
        ...queryKeys.platformAdmin.all,
        'branding',
        tenantId ?? 'default',
      ] as const,
    brandingList: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'branding-list', filters ?? {}] as const,
    licenses: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'licenses', filters ?? {}] as const,
    subscriptions: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'subscriptions', filters ?? {}] as const,
    storage: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'storage', filters ?? {}] as const,
    featureFlags: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'feature-flags', filters ?? {}] as const,
    jobs: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'jobs', filters ?? {}] as const,
    workers: () => [...queryKeys.platformAdmin.all, 'workers'] as const,
    queues: () => [...queryKeys.platformAdmin.all, 'queues'] as const,
    systemHealth: () =>
      [...queryKeys.platformAdmin.all, 'system-health'] as const,
    backups: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'backups', filters ?? {}] as const,
    maintenance: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'maintenance', filters ?? {}] as const,
    audits: (filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'audits', filters ?? {}] as const,
    configurations: (tenantId?: string) =>
      [
        ...queryKeys.platformAdmin.all,
        'configurations',
        tenantId ?? 'default',
      ] as const,
    search: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.platformAdmin.all, 'search', query, filters ?? {}] as const,
  },
  messaging: {
    all: ['messaging'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.messaging.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.messaging.all, 'analytics', facilityId ?? 'all'] as const,
    messages: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'messages', filters ?? {}] as const,
    message: (messageId: string) =>
      [...queryKeys.messaging.all, 'message', messageId] as const,
    inbox: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'inbox', filters ?? {}] as const,
    announcements: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'announcements', filters ?? {}] as const,
    threads: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'threads', filters ?? {}] as const,
    chatMessages: (threadId: string, filters?: Record<string, unknown>) =>
      [
        ...queryKeys.messaging.all,
        'chat-messages',
        threadId,
        filters ?? {},
      ] as const,
    secureMessages: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'secure-messages', filters ?? {}] as const,
    broadcasts: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'broadcasts', filters ?? {}] as const,
    templates: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'templates', filters ?? {}] as const,
    template: (templateId: string) =>
      [...queryKeys.messaging.all, 'template', templateId] as const,
    campaigns: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'campaigns', filters ?? {}] as const,
    campaign: (campaignId: string) =>
      [...queryKeys.messaging.all, 'campaign', campaignId] as const,
    deliveries: (filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'deliveries', filters ?? {}] as const,
    channels: () => [...queryKeys.messaging.all, 'channels'] as const,
    integrations: () => [...queryKeys.messaging.all, 'integrations'] as const,
    search: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.messaging.all, 'search', query, filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.messaging.all, 'favorites', userId ?? 'all'] as const,
  },
  reporting: {
    all: ['reporting'] as const,
    dashboard: (facilityId?: string) =>
      [...queryKeys.reporting.all, 'dashboard', facilityId ?? 'all'] as const,
    analytics: (facilityId?: string) =>
      [...queryKeys.reporting.all, 'analytics', facilityId ?? 'all'] as const,
    definitions: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'definitions', filters ?? {}] as const,
    definition: (reportId: string) =>
      [...queryKeys.reporting.all, 'definition', reportId] as const,
    instances: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'instances', filters ?? {}] as const,
    instance: (instanceId: string) =>
      [...queryKeys.reporting.all, 'instance', instanceId] as const,
    templates: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'templates', filters ?? {}] as const,
    schedules: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'schedules', filters ?? {}] as const,
    exports: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'exports', filters ?? {}] as const,
    designers: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'designers', filters ?? {}] as const,
    designer: (reportId: string) =>
      [...queryKeys.reporting.all, 'designer', reportId] as const,
    fields: (reportId: string) =>
      [...queryKeys.reporting.all, 'fields', reportId] as const,
    charts: (reportId: string) =>
      [...queryKeys.reporting.all, 'charts', reportId] as const,
    dataSources: (reportId: string) =>
      [...queryKeys.reporting.all, 'data-sources', reportId] as const,
    compliance: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'compliance', filters ?? {}] as const,
    audits: (filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'audits', filters ?? {}] as const,
    search: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.reporting.all, 'search', query, filters ?? {}] as const,
    favorites: (userId?: string) =>
      [...queryKeys.reporting.all, 'favorites', userId ?? 'all'] as const,
  },
  professionals: {
    all: ['professionals'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.professionals.all, 'list', filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.professionals.all, 'detail', id] as const,
  },
  transfers: {
    all: ['transfers'] as const,
    pending: () => [...queryKeys.transfers.all, 'pending'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.transfers.all, 'list', filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.transfers.all, 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (userId?: string) =>
      [...queryKeys.notifications.all, 'list', userId ?? 'self'] as const,
    unreadCount: (userId?: string) =>
      [
        ...queryKeys.notifications.all,
        'unread-count',
        userId ?? 'self',
      ] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.reports.all, 'list', filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.reports.all, 'detail', id] as const,
  },
  profile: {
    all: ['profile'] as const,
    current: () => [...queryKeys.profile.all, 'current'] as const,
  },
  directory: {
    all: ['directory'] as const,
    search: (filters?: Record<string, unknown>) =>
      [...queryKeys.directory.all, 'search', filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.directory.all, 'detail', id] as const,
    related: (id: string) =>
      [...queryKeys.directory.all, 'related', id] as const,
    stats: (userId: string) =>
      [...queryKeys.directory.all, 'stats', userId] as const,
    favorites: (userId: string) =>
      [...queryKeys.directory.all, 'favorites', userId] as const,
  },
  medicalLibrary: {
    all: ['medical-library'] as const,
    search: (filters?: Record<string, unknown>) =>
      [...queryKeys.medicalLibrary.all, 'search', filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.medicalLibrary.all, 'detail', id] as const,
    related: (id: string) =>
      [...queryKeys.medicalLibrary.all, 'related', id] as const,
    categories: () => [...queryKeys.medicalLibrary.all, 'categories'] as const,
    stats: (userId: string) =>
      [...queryKeys.medicalLibrary.all, 'stats', userId] as const,
    favorites: (userId: string) =>
      [...queryKeys.medicalLibrary.all, 'favorites', userId] as const,
  },
  patientRecords: {
    all: ['patient-records'] as const,
    search: (filters?: Record<string, unknown>) =>
      [...queryKeys.patientRecords.all, 'search', filters ?? {}] as const,
    record: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'record', patientId] as const,
    summary: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'summary', patientId] as const,
    timeline: (patientId: string, filters?: Record<string, unknown>) =>
      [
        ...queryKeys.patientRecords.all,
        'timeline',
        patientId,
        filters ?? {},
      ] as const,
    vitals: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'vitals', patientId] as const,
    labs: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'labs', patientId] as const,
    radiology: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'radiology', patientId] as const,
    documents: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'documents', patientId] as const,
    medications: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'medications', patientId] as const,
    allergies: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'allergies', patientId] as const,
    procedures: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'procedures', patientId] as const,
    immunizations: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'immunizations', patientId] as const,
    encounters: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'encounters', patientId] as const,
    carePlans: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'care-plans', patientId] as const,
    notes: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'notes', patientId] as const,
    emergency: (patientId: string) =>
      [...queryKeys.patientRecords.all, 'emergency', patientId] as const,
    stats: () => [...queryKeys.patientRecords.all, 'stats'] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
