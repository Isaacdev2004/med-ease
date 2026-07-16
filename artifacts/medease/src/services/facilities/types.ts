export type FacilityType = 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'radiology' | 'theatre';
export type RoomType = 'patient' | 'operating' | 'icu' | 'isolation' | 'consultation' | 'utility' | 'storage' | 'office';
export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'blocked';
export type EquipmentStatus = 'operational' | 'maintenance' | 'calibration_due' | 'out_of_service' | 'decommissioned';
export type WorkOrderStatus = 'draft' | 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical' | 'emergency';
export type MaintenanceType = 'preventive' | 'corrective' | 'predictive' | 'emergency';
export type CalibrationStatus = 'valid' | 'due' | 'overdue' | 'failed' | 'pending';
export type InspectionStatus = 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'overdue';
export type UtilityStatus = 'normal' | 'warning' | 'critical' | 'offline';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ContractStatus = 'active' | 'expiring' | 'expired' | 'pending' | 'terminated';

export interface FacilitiesFilters {
  q?: string;
  facilityId?: string;
  buildingId?: string;
  floorId?: string;
  roomId?: string;
  departmentId?: string;
  status?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FacilitySite {
  facilityId: string;
  name: string;
  code: string;
  type: FacilityType;
  campusId?: string;
  address: string;
  city: string;
  country: string;
  bedCapacity: number;
  buildingCount: number;
  equipmentCount: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Campus {
  campusId: string;
  name: string;
  facilityId: string;
  address: string;
}

export interface Building {
  buildingId: string;
  name: string;
  code: string;
  facilityId: string;
  facilityName: string;
  campusId?: string;
  floors: number;
  yearBuilt: number;
  status: 'active' | 'renovation' | 'closed';
}

export interface Floor {
  floorId: string;
  buildingId: string;
  buildingName: string;
  facilityId: string;
  level: number;
  name: string;
  roomCount: number;
}

export interface Room {
  roomId: string;
  number: string;
  name: string;
  floorId: string;
  buildingId: string;
  facilityId: string;
  type: RoomType;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  departmentId?: string;
}

export interface Bed {
  bedId: string;
  label: string;
  roomId: string;
  ward: string;
  facilityId: string;
  status: BedStatus;
  patientId?: string;
}

export interface MedicalEquipment {
  equipmentId: string;
  assetTag: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  facilityId: string;
  facilityName: string;
  buildingId?: string;
  roomId?: string;
  departmentId?: string;
  inventoryAssetId?: string;
  status: EquipmentStatus;
  purchaseDate: string;
  warrantyExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  utilizationPercent: number;
}

export interface BiomedicalDevice extends MedicalEquipment {
  deviceClass: 'class_i' | 'class_ii' | 'class_iii';
  calibrationDue?: string;
  lastCalibration?: string;
  fhirDeviceId?: string;
}

export interface MaintenanceRequest {
  requestId: string;
  title: string;
  description: string;
  facilityId: string;
  equipmentId?: string;
  roomId?: string;
  requestedBy: string;
  priority: WorkOrderPriority;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  createdAt: string;
}

export interface WorkOrder {
  workOrderId: string;
  requestId?: string;
  title: string;
  description: string;
  facilityId: string;
  facilityName: string;
  equipmentId?: string;
  equipmentName?: string;
  type: MaintenanceType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  scheduledDate?: string;
  completedDate?: string;
  slaHours: number;
  slaBreached: boolean;
  downtimeHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PreventiveMaintenance {
  scheduleId: string;
  equipmentId: string;
  equipmentName: string;
  facilityId: string;
  frequencyDays: number;
  lastPerformed?: string;
  nextDue: string;
  status: 'compliant' | 'due' | 'overdue';
  assignedTeamId?: string;
}

export interface CalibrationRecord {
  calibrationId: string;
  equipmentId: string;
  equipmentName: string;
  facilityId: string;
  performedDate: string;
  nextDue: string;
  status: CalibrationStatus;
  technicianId?: string;
  certificateNumber?: string;
}

export interface Inspection {
  inspectionId: string;
  title: string;
  facilityId: string;
  buildingId?: string;
  type: 'safety' | 'fire' | 'electrical' | 'hygiene' | 'regulatory';
  scheduledDate: string;
  completedDate?: string;
  status: InspectionStatus;
  inspectorId?: string;
}

export interface ServiceContract {
  contractId: string;
  vendorId: string;
  vendorName: string;
  title: string;
  facilityId: string;
  startDate: string;
  endDate: string;
  value: number;
  status: ContractStatus;
  coverageType: string;
}

export interface Vendor {
  vendorId: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  category: string;
  rating: number;
  contractCount: number;
  status: 'active' | 'inactive';
}

export interface UtilitySystem {
  utilityId: string;
  name: string;
  type: 'electrical' | 'hvac' | 'water' | 'medical_gas' | 'generator' | 'ups' | 'fire_safety' | 'security';
  facilityId: string;
  facilityName: string;
  status: UtilityStatus;
  lastReading?: number;
  unit?: string;
  threshold?: number;
}

export interface EnvironmentalReading {
  readingId: string;
  sensorId: string;
  facilityId: string;
  location: string;
  metric: 'temperature' | 'humidity' | 'pressure' | 'co2' | 'air_quality';
  value: number;
  unit: string;
  timestamp: string;
  status: UtilityStatus;
}

export interface IoTSensor {
  sensorId: string;
  name: string;
  type: string;
  facilityId: string;
  buildingId?: string;
  roomId?: string;
  status: 'online' | 'offline' | 'maintenance';
  lastReading?: string;
}

export interface Incident {
  incidentId: string;
  title: string;
  description: string;
  facilityId: string;
  severity: IncidentSeverity;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface Vehicle {
  vehicleId: string;
  registration: string;
  make: string;
  model: string;
  facilityId: string;
  type: 'ambulance' | 'van' | 'car' | 'utility';
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  mileage: number;
}

export interface FacilitiesDashboard {
  facilityId?: string;
  totalBuildings: number;
  totalRooms: number;
  totalBeds: number;
  availableBeds: number;
  totalEquipment: number;
  operationalEquipment: number;
  openWorkOrders: number;
  overdueMaintenance: number;
  calibrationDue: number;
  utilityAlerts: number;
  recentWorkOrders: WorkOrder[];
  utilitySystems: UtilitySystem[];
}

export interface FacilitiesAnalytics {
  equipmentUtilization: number;
  preventiveCompliance: number;
  slaCompliance: number;
  mtbf: number;
  mttr: number;
  downtimeHours: number;
  calibrationCompliance: number;
  energyUsageKwh: number;
  utilityConsumption: number;
  environmentalCompliance: number;
  openIncidents: number;
  vendorPerformance: number;
  workOrderTrend: { label: string; value: number }[];
  maintenanceByType: { label: string; value: number }[];
}

export interface FacilitiesPermissions {
  canView: boolean;
  canWrite: boolean;
  canManageMaintenance: boolean;
  canManageCalibration: boolean;
  canManageInspection: boolean;
  canManageUtilities: boolean;
  canManageAssets: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface FacilitiesFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'equipment' | 'building' | 'work_order' | 'room';
  entityId: string;
  createdAt: string;
}

export interface CreateMaintenanceRequestInput {
  title: string;
  description: string;
  facilityId: string;
  equipmentId?: string;
  roomId?: string;
  requestedBy: string;
  priority: WorkOrderPriority;
}

export interface AssignWorkOrderInput {
  workOrderId: string;
  technicianId: string;
  scheduledDate?: string;
}

export interface RecordCalibrationInput {
  equipmentId: string;
  performedDate: string;
  technicianId?: string;
  certificateNumber?: string;
}

export interface ReportIncidentInput {
  title: string;
  description: string;
  facilityId: string;
  severity: IncidentSeverity;
  reportedBy: string;
}
