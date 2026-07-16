import type { FacilitiesAnalytics } from '@/services/facilities/types';
import {
  MOCK_CALIBRATION,
  MOCK_EQUIPMENT,
  MOCK_ENVIRONMENTAL,
  MOCK_INCIDENTS,
  MOCK_PREVENTIVE,
  MOCK_VENDORS,
  MOCK_WORK_ORDERS,
} from '@/services/facilities/mock-data';

export function computeFacilitiesAnalytics(facilityId?: string): FacilitiesAnalytics {
  const equipment = facilityId ? MOCK_EQUIPMENT.filter((e) => e.facilityId === facilityId) : MOCK_EQUIPMENT;
  const workOrders = facilityId ? MOCK_WORK_ORDERS.filter((w) => w.facilityId === facilityId) : MOCK_WORK_ORDERS;
  const pm = facilityId ? MOCK_PREVENTIVE.filter((p) => p.facilityId === facilityId) : MOCK_PREVENTIVE;
  const cal = facilityId ? MOCK_CALIBRATION.filter((c) => c.facilityId === facilityId) : MOCK_CALIBRATION;
  const env = facilityId ? MOCK_ENVIRONMENTAL.filter((e) => e.facilityId === facilityId) : MOCK_ENVIRONMENTAL;
  const incidents = facilityId ? MOCK_INCIDENTS.filter((i) => i.facilityId === facilityId) : MOCK_INCIDENTS;

  const avgUtil = equipment.length ? equipment.reduce((s, e) => s + e.utilizationPercent, 0) / equipment.length : 0;
  const pmCompliant = pm.filter((p) => p.status === 'compliant').length;
  const slaOk = workOrders.filter((w) => !w.slaBreached).length;
  const completed = workOrders.filter((w) => w.status === 'completed');
  const totalDowntime = completed.reduce((s, w) => s + (w.downtimeHours ?? 0), 0);
  const calOk = cal.filter((c) => c.status === 'valid').length;
  const envOk = env.filter((e) => e.status === 'normal').length;

  return {
    equipmentUtilization: Math.round(avgUtil),
    preventiveCompliance: pm.length ? Math.round((pmCompliant / pm.length) * 100) : 100,
    slaCompliance: workOrders.length ? Math.round((slaOk / workOrders.length) * 100) : 100,
    mtbf: completed.length ? Math.round(720 / (completed.length / 100)) : 720,
    mttr: completed.length ? Math.round(totalDowntime / completed.length) : 4,
    downtimeHours: Math.round(totalDowntime),
    calibrationCompliance: cal.length ? Math.round((calOk / cal.length) * 100) : 100,
    energyUsageKwh: 45000 + (facilityId ? parseInt(facilityId.replace(/\D/g, ''), 10) * 1000 : 0),
    utilityConsumption: 12000 + equipment.length * 2,
    environmentalCompliance: env.length ? Math.round((envOk / env.length) * 100) : 100,
    openIncidents: incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length,
    vendorPerformance: MOCK_VENDORS.length ? Math.round(MOCK_VENDORS.reduce((s, v) => s + v.rating, 0) / MOCK_VENDORS.length * 20) : 85,
    workOrderTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
      label,
      value: 20 + (i * 3) + (workOrders.length % 10),
    })),
    maintenanceByType: [
      { label: 'Preventive', value: workOrders.filter((w) => w.type === 'preventive').length },
      { label: 'Corrective', value: workOrders.filter((w) => w.type === 'corrective').length },
      { label: 'Emergency', value: workOrders.filter((w) => w.type === 'emergency').length },
    ],
  };
}

export function computeEquipmentUtilization(facilityId?: string): number {
  return computeFacilitiesAnalytics(facilityId).equipmentUtilization;
}
