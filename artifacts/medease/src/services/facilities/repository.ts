import { computeFacilitiesAnalytics } from '@/services/facilities/analytics';
import {
  prioritizeWorkOrder,
  schedulePreventiveMaintenance,
} from '@/services/facilities/maintenance-engine';
import {
  buildFacilitiesDashboard,
  MOCK_BEDS,
  MOCK_BIOMEDICAL_DEVICES,
  MOCK_BUILDINGS,
  MOCK_CALIBRATION,
  MOCK_CONTRACTS,
  MOCK_ENVIRONMENTAL,
  MOCK_EQUIPMENT,
  MOCK_FACILITY_SITES,
  MOCK_INCIDENTS,
  MOCK_INSPECTIONS,
  MOCK_IOT_SENSORS,
  MOCK_PREVENTIVE,
  MOCK_ROOMS,
  MOCK_UTILITIES,
  MOCK_VEHICLES,
  MOCK_VENDORS,
  MOCK_WORK_ORDERS,
} from '@/services/facilities/mock-data';
import type {
  AssignWorkOrderInput,
  CreateMaintenanceRequestInput,
  FacilitiesFavorite,
  FacilitiesFilters,
  RecordCalibrationInput,
  ReportIncidentInput,
} from '@/services/facilities/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: page ?? 1,
    pageSize: pageSize ?? 25,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class FacilitiesRepository {
  private workOrders = [...MOCK_WORK_ORDERS];
  private preventive = [...MOCK_PREVENTIVE];
  private calibration = [...MOCK_CALIBRATION];
  private inspections = [...MOCK_INSPECTIONS];
  private incidents = [...MOCK_INCIDENTS];
  private equipment = [...MOCK_EQUIPMENT];
  private favorites: FacilitiesFavorite[] = [];
  private nextId = 200000;

  listFacilities(filters?: FacilitiesFilters) {
    let items = MOCK_FACILITY_SITES;
    if (filters?.q)
      items = items.filter((f) => matchQ(filters.q, f.name, f.code, f.city));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getFacility(facilityId: string) {
    return MOCK_FACILITY_SITES.find((f) => f.facilityId === facilityId) ?? null;
  }

  getBuildings(filters?: FacilitiesFilters) {
    let items = MOCK_BUILDINGS;
    if (filters?.facilityId)
      items = items.filter((b) => b.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((b) => matchQ(filters.q, b.name, b.code));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRooms(filters?: FacilitiesFilters) {
    let items = MOCK_ROOMS;
    if (filters?.facilityId)
      items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.buildingId)
      items = items.filter((r) => r.buildingId === filters.buildingId);
    if (filters?.q)
      items = items.filter((r) => matchQ(filters.q, r.name, r.number));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBeds(filters?: FacilitiesFilters) {
    let items = MOCK_BEDS;
    if (filters?.facilityId)
      items = items.filter((b) => b.facilityId === filters.facilityId);
    if (filters?.roomId)
      items = items.filter((b) => b.roomId === filters.roomId);
    if (filters?.status)
      items = items.filter((b) => b.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEquipment(filters?: FacilitiesFilters) {
    let items = this.equipment;
    if (filters?.facilityId)
      items = items.filter((e) => e.facilityId === filters.facilityId);
    if (filters?.category)
      items = items.filter((e) => e.category === filters.category);
    if (filters?.status)
      items = items.filter((e) => e.status === filters.status);
    if (filters?.q)
      items = items.filter((e) =>
        matchQ(filters.q, e.name, e.assetTag, e.serialNumber),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBiomedicalDevices(filters?: FacilitiesFilters) {
    let items = MOCK_BIOMEDICAL_DEVICES;
    if (filters?.facilityId)
      items = items.filter((d) => d.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((d) => matchQ(filters.q, d.name, d.assetTag));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getWorkOrders(filters?: FacilitiesFilters) {
    let items = this.workOrders;
    if (filters?.facilityId)
      items = items.filter((w) => w.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((w) => w.status === filters.status);
    if (filters?.q)
      items = items.filter((w) => matchQ(filters.q, w.title, w.equipmentName));
    return paginate(
      [...items].sort(
        (a, b) => prioritizeWorkOrder(b) - prioritizeWorkOrder(a),
      ),
      filters?.page,
      filters?.pageSize,
    );
  }

  getPreventiveMaintenance(filters?: FacilitiesFilters) {
    let items = this.preventive;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((p) => p.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCalibration(filters?: FacilitiesFilters) {
    let items = this.calibration;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((c) => c.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInspections(filters?: FacilitiesFilters) {
    let items = this.inspections;
    if (filters?.facilityId)
      items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((i) => i.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getUtilities(filters?: FacilitiesFilters) {
    let items = MOCK_UTILITIES;
    if (filters?.facilityId)
      items = items.filter((u) => u.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEnvironmental(filters?: FacilitiesFilters) {
    let items = MOCK_ENVIRONMENTAL;
    if (filters?.facilityId)
      items = items.filter((e) => e.facilityId === filters.facilityId);
    return paginate(
      [...items].sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
      filters?.page,
      filters?.pageSize,
    );
  }

  getVendors(filters?: FacilitiesFilters) {
    let items = MOCK_VENDORS;
    if (filters?.q)
      items = items.filter((v) => matchQ(filters.q, v.name, v.category));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getContracts(filters?: FacilitiesFilters) {
    let items = MOCK_CONTRACTS;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getVehicles(filters?: FacilitiesFilters) {
    let items = MOCK_VEHICLES;
    if (filters?.facilityId)
      items = items.filter((v) => v.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSensors(filters?: FacilitiesFilters) {
    let items = MOCK_IOT_SENSORS;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createMaintenanceRequest(input: CreateMaintenanceRequestInput) {
    const eq = input.equipmentId
      ? this.equipment.find((e) => e.equipmentId === input.equipmentId)
      : undefined;
    const fac = MOCK_FACILITY_SITES.find(
      (f) => f.facilityId === input.facilityId,
    );
    const wo = {
      workOrderId: `wo-${String(++this.nextId)}`,
      requestId: `mr-${String(this.nextId)}`,
      title: input.title,
      description: input.description,
      facilityId: input.facilityId,
      facilityName: fac?.name ?? 'Unknown',
      equipmentId: input.equipmentId,
      equipmentName: eq?.name,
      type: 'corrective' as const,
      priority: input.priority,
      status: 'open' as const,
      slaHours:
        input.priority === 'emergency'
          ? 4
          : input.priority === 'critical'
            ? 8
            : 24,
      slaBreached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.workOrders.unshift(wo);
    return wo;
  }

  assignWorkOrder(input: AssignWorkOrderInput) {
    const idx = this.workOrders.findIndex(
      (w) => w.workOrderId === input.workOrderId,
    );
    if (idx < 0) return null;
    const wo = this.workOrders[idx]!;
    wo.status = 'assigned';
    wo.assignedTechnicianId = input.technicianId;
    wo.assignedTechnicianName = `Technician ${input.technicianId.replace('emp-', '')}`;
    wo.scheduledDate = input.scheduledDate ?? new Date().toISOString();
    wo.updatedAt = new Date().toISOString();
    this.workOrders[idx] = wo;
    return wo;
  }

  completeWorkOrder(workOrderId: string) {
    const idx = this.workOrders.findIndex((w) => w.workOrderId === workOrderId);
    if (idx < 0) return null;
    const wo = this.workOrders[idx]!;
    wo.status = 'completed';
    wo.completedDate = new Date().toISOString();
    wo.downtimeHours = Math.round(
      (Date.now() - new Date(wo.createdAt).getTime()) / (1000 * 60 * 60),
    );
    wo.updatedAt = new Date().toISOString();
    this.workOrders[idx] = wo;
    return wo;
  }

  schedulePreventive(scheduleId: string, performedDate: string) {
    const idx = this.preventive.findIndex((p) => p.scheduleId === scheduleId);
    if (idx < 0) return null;
    this.preventive[idx] = schedulePreventiveMaintenance(
      this.preventive[idx]!,
      performedDate,
    );
    return this.preventive[idx];
  }

  recordCalibration(input: RecordCalibrationInput) {
    const eq = this.equipment.find((e) => e.equipmentId === input.equipmentId);
    const record = {
      calibrationId: `cal-${String(++this.nextId)}`,
      equipmentId: input.equipmentId,
      equipmentName: eq?.name ?? 'Unknown',
      facilityId: eq?.facilityId ?? 'fac-001',
      performedDate: input.performedDate,
      nextDue: new Date(
        new Date(input.performedDate).getTime() + 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: 'valid' as const,
      technicianId: input.technicianId,
      certificateNumber: input.certificateNumber,
    };
    this.calibration.unshift(record);
    if (eq) {
      eq.status = 'operational';
      eq.lastMaintenance = input.performedDate;
    }
    return record;
  }

  recordInspection(inspectionId: string, passed: boolean) {
    const idx = this.inspections.findIndex(
      (i) => i.inspectionId === inspectionId,
    );
    if (idx < 0) return null;
    const insp = this.inspections[idx]!;
    insp.status = passed ? 'passed' : 'failed';
    insp.completedDate = new Date().toISOString();
    this.inspections[idx] = insp;
    return insp;
  }

  reportIncident(input: ReportIncidentInput) {
    const incident = {
      incidentId: `inc-${String(++this.nextId)}`,
      title: input.title,
      description: input.description,
      facilityId: input.facilityId,
      severity: input.severity,
      status: 'open' as const,
      reportedBy: input.reportedBy,
      reportedAt: new Date().toISOString(),
    };
    this.incidents.unshift(incident);
    return incident;
  }

  updateEquipment(equipmentId: string, status: string) {
    const idx = this.equipment.findIndex((e) => e.equipmentId === equipmentId);
    if (idx < 0) return null;
    this.equipment[idx]!.status =
      status as (typeof this.equipment)[0]['status'];
    return this.equipment[idx];
  }

  archiveEquipment(equipmentId: string) {
    return this.updateEquipment(equipmentId, 'decommissioned');
  }

  dashboard(facilityId?: string) {
    return buildFacilitiesDashboard(facilityId);
  }

  analytics(facilityId?: string) {
    return computeFacilitiesAnalytics(facilityId);
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const filter = <T extends { facilityId?: string }>(
      items: T[],
      ...fields: (string | undefined)[]
    ) =>
      items
        .filter(
          (item) =>
            (!facilityId || item.facilityId === facilityId) &&
            fields.some((f) => f?.toLowerCase().includes(q)),
        )
        .slice(0, 20);

    return {
      facilities: filter(
        MOCK_FACILITY_SITES,
        ...MOCK_FACILITY_SITES.map((f) => f.name),
      ),
      equipment: filter(
        this.equipment,
        ...this.equipment.slice(0, 100).flatMap((e) => [e.name, e.assetTag]),
      ),
      workOrders: filter(
        this.workOrders,
        ...this.workOrders.slice(0, 100).map((w) => w.title),
      ),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.workOrders.length,
    };
  }

  favorite(
    userId: string,
    entityType: FacilitiesFavorite['entityType'],
    entityId: string,
  ) {
    const fav: FacilitiesFavorite = {
      favoriteId: `fav-${String(++this.nextId)}`,
      userId,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    this.favorites.unshift(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  listBeds(facilityId: string) {
    return MOCK_BEDS.filter((b) => b.facilityId === facilityId);
  }
}

export const facilitiesRepository = new FacilitiesRepository();
