import {
  AnalyticsPanel,
  AssetMap,
  BedCard,
  BiomedicalDeviceCard,
  CalibrationCard,
  ContractCard,
  EnvironmentalCard,
  EquipmentCard,
  ExportToolbar,
  FleetCard,
  MaintenanceCalendar,
  MetricsDashboard,
  PreventiveMaintenanceCard,
  RoomCard,
  UtilityCard,
  VendorCard,
  WorkOrderCard,
} from '@/features/facilities/components/FacilitiesComponents';
import {
  useBeds,
  useBiomedicalDevices,
  useBuildings,
  useCalibration,
  useContracts,
  useEnvironmentalMonitoring,
  useEquipment,
  useFacilitiesAnalytics,
  useFacilitiesDashboard,
  usePreventiveMaintenance,
  useRooms,
  useUtilities,
  useVehicles,
  useVendors,
  useWorkOrders,
} from '@/features/facilities/hooks/use-facilities';
import { useFacilitiesMutations } from '@/features/facilities/mutations/facilities.mutations';
import type { FacilitiesFilters } from '@/services/facilities/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Building2 } from 'lucide-react';

export type FacilitiesSection =
  | 'dashboard'
  | 'equipment'
  | 'maintenance'
  | 'buildings'
  | 'assets'
  | 'utilities'
  | 'environment'
  | 'housekeeping'
  | 'fleet'
  | 'workOrders'
  | 'calibration'
  | 'vendors'
  | 'contracts'
  | 'analytics'
  | 'systemHealth';

export function DashboardSection({ filters }: { filters?: FacilitiesFilters }) {
  const dashboard = useFacilitiesDashboard(filters?.facilityId);
  const workOrders = useWorkOrders(filters);
  const utilities = useUtilities(filters);
  if (dashboard.isLoading) return <LoadingView label="Loading facilities…" />;
  if (!dashboard.data) return <EmptyState icon={Building2} title="No facilities data" />;
  const utility = utilities.data?.items?.[0] ?? dashboard.data.utilitySystems[0];
  return (
    <div className="space-y-6">
      <MetricsDashboard dashboard={dashboard.data} />
      {utility ? <UtilityCard utility={utility} /> : null}
      <MaintenanceCalendar orders={workOrders.data?.items ?? dashboard.data.recentWorkOrders} />
    </div>
  );
}

export function EquipmentSection({ filters }: { filters?: FacilitiesFilters }) {
  const equipment = useEquipment(filters);
  const biomed = useBiomedicalDevices(filters);
  if (equipment.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(equipment.data?.items ?? []).slice(0, 12).map((e) => <EquipmentCard key={e.equipmentId} equipment={e} />)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(biomed.data?.items ?? []).slice(0, 6).map((d) => <BiomedicalDeviceCard key={d.equipmentId} device={d} />)}</div>
    </div>
  );
}

export function MaintenanceSection({ filters }: { filters?: FacilitiesFilters }) {
  const workOrders = useWorkOrders(filters);
  const preventive = usePreventiveMaintenance(filters);
  const { assignWorkOrder, completeWorkOrder } = useFacilitiesMutations();
  if (workOrders.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(workOrders.data?.items ?? []).slice(0, 12).map((wo) => (
          <WorkOrderCard
            key={wo.workOrderId}
            order={wo}
            onAssign={wo.status === 'open' ? () => assignWorkOrder.mutate({ workOrderId: wo.workOrderId, technicianId: 'emp-00100' }) : undefined}
            onComplete={wo.status === 'in_progress' || wo.status === 'assigned' ? () => completeWorkOrder.mutate(wo.workOrderId) : undefined}
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(preventive.data?.items ?? []).slice(0, 6).map((p) => <PreventiveMaintenanceCard key={p.scheduleId} schedule={p} />)}</div>
    </div>
  );
}

export function BuildingsSection({ filters }: { filters?: FacilitiesFilters }) {
  const buildings = useBuildings(filters);
  const rooms = useRooms(filters);
  const beds = useBeds(filters);
  if (buildings.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <AssetMap buildings={buildings.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(rooms.data?.items ?? []).slice(0, 9).map((r) => <RoomCard key={r.roomId} room={r} />)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(beds.data?.items ?? []).slice(0, 8).map((b) => <BedCard key={b.bedId} bed={b} />)}</div>
    </div>
  );
}

export function AssetsSection({ filters }: { filters?: FacilitiesFilters }) {
  return <EquipmentSection filters={filters} />;
}

export function UtilitiesSection({ filters }: { filters?: FacilitiesFilters }) {
  const utilities = useUtilities(filters);
  if (utilities.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(utilities.data?.items ?? []).map((u) => <UtilityCard key={u.utilityId} utility={u} />)}</div>;
}

export function EnvironmentSection({ filters }: { filters?: FacilitiesFilters }) {
  const env = useEnvironmentalMonitoring(filters);
  if (env.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(env.data?.items ?? []).slice(0, 12).map((r) => <EnvironmentalCard key={r.readingId} reading={r} />)}</div>;
}

export function HousekeepingSection({ filters }: { filters?: FacilitiesFilters }) {
  const rooms = useRooms(filters);
  if (rooms.isLoading) return <LoadingView />;
  const cleaning = (rooms.data?.items ?? []).filter((r) => r.status === 'cleaning' || r.status === 'maintenance');
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cleaning.slice(0, 12).map((r) => <RoomCard key={r.roomId} room={r} />)}</div>;
}

export function FleetSection({ filters }: { filters?: FacilitiesFilters }) {
  const vehicles = useVehicles(filters);
  if (vehicles.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(vehicles.data?.items ?? []).slice(0, 12).map((v) => <FleetCard key={v.vehicleId} vehicle={v} />)}</div>;
}

export function WorkOrdersSection({ filters }: { filters?: FacilitiesFilters }) {
  return <MaintenanceSection filters={filters} />;
}

export function CalibrationSection({ filters }: { filters?: FacilitiesFilters }) {
  const calibration = useCalibration(filters);
  if (calibration.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(calibration.data?.items ?? []).slice(0, 12).map((c) => <CalibrationCard key={c.calibrationId} record={c} />)}</div>;
}

export function VendorsSection() {
  const vendors = useVendors();
  if (vendors.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(vendors.data?.items ?? []).slice(0, 12).map((v) => <VendorCard key={v.vendorId} vendor={v} />)}</div>;
}

export function ContractsSection({ filters }: { filters?: FacilitiesFilters }) {
  const contracts = useContracts(filters);
  if (contracts.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(contracts.data?.items ?? []).slice(0, 12).map((c) => <ContractCard key={c.contractId} contract={c} />)}</div>;
}

export function AnalyticsSection({ filters }: { filters?: FacilitiesFilters }) {
  const analytics = useFacilitiesAnalytics(filters?.facilityId);
  const { exportData } = useFacilitiesMutations();
  if (analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data ? <AnalyticsPanel analytics={analytics.data} /> : null}
      <ExportToolbar onExport={(f) => exportData.mutate(f)} />
    </div>
  );
}

export function SystemHealthSection({ filters }: { filters?: FacilitiesFilters }) {
  const utilities = useUtilities(filters);
  const env = useEnvironmentalMonitoring(filters);
  if (utilities.isLoading) return <LoadingView />;
  const alerts = [...(utilities.data?.items ?? []).filter((u) => u.status !== 'normal'), ...(env.data?.items ?? []).filter((e) => e.status !== 'normal').slice(0, 6)];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(utilities.data?.items ?? []).map((u) => <UtilityCard key={u.utilityId} utility={u} />)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{alerts.slice(0, 6).map((a) => 'utilityId' in a ? <UtilityCard key={a.utilityId} utility={a} /> : <EnvironmentalCard key={a.readingId} reading={a} />)}</div>
    </div>
  );
}

export function FacilitiesSectionContent({ section, filters }: { section: FacilitiesSection; filters?: FacilitiesFilters }) {
  switch (section) {
    case 'equipment': return <EquipmentSection filters={filters} />;
    case 'maintenance': return <MaintenanceSection filters={filters} />;
    case 'buildings': return <BuildingsSection filters={filters} />;
    case 'assets': return <AssetsSection filters={filters} />;
    case 'utilities': return <UtilitiesSection filters={filters} />;
    case 'environment': return <EnvironmentSection filters={filters} />;
    case 'housekeeping': return <HousekeepingSection filters={filters} />;
    case 'fleet': return <FleetSection filters={filters} />;
    case 'workOrders': return <WorkOrdersSection filters={filters} />;
    case 'calibration': return <CalibrationSection filters={filters} />;
    case 'vendors': return <VendorsSection />;
    case 'contracts': return <ContractsSection filters={filters} />;
    case 'analytics': return <AnalyticsSection filters={filters} />;
    case 'systemHealth': return <SystemHealthSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
