import { format } from 'date-fns';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Gauge,
  MapPin,
  Settings,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';

import type {
  Bed,
  BiomedicalDevice,
  Building,
  CalibrationRecord,
  EnvironmentalReading,
  FacilitiesAnalytics,
  FacilitiesDashboard,
  FacilitySite,
  Inspection,
  MedicalEquipment,
  PreventiveMaintenance,
  Room,
  ServiceContract,
  UtilitySystem,
  Vendor,
  WorkOrder,
} from '@/services/facilities/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function FacilityCard({ facility }: { facility: FacilitySite }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{facility.name}</CardTitle>
          <Badge className="capitalize">{facility.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground">
          {facility.code} · {facility.type}
        </p>
        <p>
          {facility.city}, {facility.country}
        </p>
        <p className="text-xs">
          {facility.bedCapacity} beds · {facility.buildingCount} buildings
        </p>
      </CardContent>
    </Card>
  );
}

export function BuildingCard({ building }: { building: Building }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary shrink-0" />
        <div>
          <p className="font-medium text-sm">{building.name}</p>
          <p className="text-xs text-muted-foreground">
            {building.facilityName} · {building.floors} floors · Built{' '}
            {building.yearBuilt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoomCard({ room }: { room: Room }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{room.name}</span>
          <Badge className="capitalize">{room.status}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {room.type.replace('_', ' ')} · Capacity {room.capacity}
        </p>
      </CardContent>
    </Card>
  );
}

export function BedCard({ bed }: { bed: Bed }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{bed.label}</span>
          <Badge className="capitalize">{bed.status}</Badge>
        </div>
        <p className="text-muted-foreground">{bed.ward}</p>
      </CardContent>
    </Card>
  );
}

export function EquipmentCard({ equipment }: { equipment: MedicalEquipment }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{equipment.name}</CardTitle>
          <Badge className="capitalize">
            {equipment.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground">
          {equipment.assetTag} · {equipment.manufacturer}
        </p>
        <p>{equipment.facilityName}</p>
        <p className="text-xs">Utilization: {equipment.utilizationPercent}%</p>
      </CardContent>
    </Card>
  );
}

export function BiomedicalDeviceCard({ device }: { device: BiomedicalDevice }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{device.name}</span>
          <Badge variant="outline" className="capitalize">
            {device.deviceClass.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">{device.assetTag}</p>
        {device.calibrationDue ? (
          <p className="text-xs">
            Calibration due:{' '}
            {format(new Date(device.calibrationDue), 'MMM d, yyyy')}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function WorkOrderCard({
  order,
  onAssign,
  onComplete,
}: {
  order: WorkOrder;
  onAssign?: () => void;
  onComplete?: () => void;
}) {
  const priorityColor = {
    emergency: 'destructive',
    critical: 'destructive',
    high: 'default',
    medium: 'secondary',
    low: 'outline',
  } as const;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{order.title}</span>
          <Badge variant={priorityColor[order.priority]} className="capitalize">
            {order.priority}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {order.facilityName}
          {order.equipmentName ? ` · ${order.equipmentName}` : ''}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">
            {order.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {order.type}
          </Badge>
          {order.slaBreached ? (
            <Badge variant="destructive">SLA Breached</Badge>
          ) : null}
        </div>
        {order.assignedTechnicianName ? (
          <p className="text-xs">Assigned: {order.assignedTechnicianName}</p>
        ) : null}
        <div className="flex gap-2">
          {onAssign ? (
            <Button size="sm" variant="outline" onClick={onAssign}>
              Assign
            </Button>
          ) : null}
          {onComplete ? (
            <Button size="sm" onClick={onComplete}>
              Complete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export const MaintenanceCard = WorkOrderCard;

export function InspectionCard({ inspection }: { inspection: Inspection }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{inspection.title}</span>
          <Badge className="capitalize">{inspection.status}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {inspection.type} ·{' '}
          {format(new Date(inspection.scheduledDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function CalibrationCard({ record }: { record: CalibrationRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{record.equipmentName}</span>
          <Badge className="capitalize">{record.status}</Badge>
        </div>
        <p className="text-muted-foreground">
          Next due: {format(new Date(record.nextDue), 'MMM d, yyyy')}
        </p>
        {record.certificateNumber ? (
          <p className="text-xs">{record.certificateNumber}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function UtilityCard({ utility }: { utility: UtilitySystem }) {
  const statusColor = {
    normal: 'default',
    warning: 'secondary',
    critical: 'destructive',
    offline: 'outline',
  } as const;
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Zap
          className={cn(
            'h-8 w-8 shrink-0',
            utility.status === 'critical' ? 'text-destructive' : 'text-primary',
          )}
        />
        <div className="text-sm">
          <div className="flex justify-between gap-2">
            <span className="font-medium">{utility.name}</span>
            <Badge variant={statusColor[utility.status]} className="capitalize">
              {utility.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{utility.facilityName}</p>
          {utility.lastReading != null ? (
            <p className="text-xs">
              {utility.lastReading} {utility.unit}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function EnvironmentalCard({
  reading,
}: {
  reading: EnvironmentalReading;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium capitalize">
            {reading.metric.replace('_', ' ')}
          </span>
          <Badge className="capitalize">{reading.status}</Badge>
        </div>
        <p className="text-lg font-semibold">
          {reading.value} {reading.unit}
        </p>
        <p className="text-xs text-muted-foreground">
          {reading.location} ·{' '}
          {format(new Date(reading.timestamp), 'MMM d, HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{vendor.name}</p>
        <p className="text-muted-foreground">{vendor.category}</p>
        <p className="text-xs">
          Rating: {vendor.rating.toFixed(1)} · {vendor.contractCount} contracts
        </p>
      </CardContent>
    </Card>
  );
}

export function ContractCard({ contract }: { contract: ServiceContract }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{contract.title}</span>
          <Badge className="capitalize">{contract.status}</Badge>
        </div>
        <p className="text-muted-foreground">{contract.vendorName}</p>
        <p className="text-xs">
          Expires: {format(new Date(contract.endDate), 'MMM d, yyyy')} · €
          {contract.value.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}

export function MetricsDashboard({
  dashboard,
}: {
  dashboard: FacilitiesDashboard;
}) {
  const metrics = [
    { label: 'Buildings', value: dashboard.totalBuildings, icon: Building2 },
    { label: 'Rooms', value: dashboard.totalRooms, icon: MapPin },
    {
      label: 'Beds Available',
      value: `${dashboard.availableBeds}/${dashboard.totalBeds}`,
      icon: Gauge,
    },
    {
      label: 'Equipment Operational',
      value: `${dashboard.operationalEquipment}/${dashboard.totalEquipment}`,
      icon: Settings,
    },
    {
      label: 'Open Work Orders',
      value: dashboard.openWorkOrders,
      icon: Wrench,
    },
    {
      label: 'Overdue PM',
      value: dashboard.overdueMaintenance,
      icon: AlertTriangle,
    },
    {
      label: 'Calibration Due',
      value: dashboard.calibrationDue,
      icon: Calendar,
    },
    { label: 'Utility Alerts', value: dashboard.utilityAlerts, icon: Zap },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardContent className="pt-4 flex items-center gap-3">
            <m.icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: FacilitiesAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Equipment Utilization',
            value: `${analytics.equipmentUtilization}%`,
          },
          {
            label: 'PM Compliance',
            value: `${analytics.preventiveCompliance}%`,
          },
          { label: 'SLA Compliance', value: `${analytics.slaCompliance}%` },
          {
            label: 'Calibration Compliance',
            value: `${analytics.calibrationCompliance}%`,
          },
          { label: 'MTBF (hrs)', value: analytics.mtbf },
          { label: 'MTTR (hrs)', value: analytics.mttr },
          { label: 'Downtime (hrs)', value: analytics.downtimeHours },
          { label: 'Open Incidents', value: analytics.openIncidents },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartPanel
          title="Work Order Trend"
          data={analytics.workOrderTrend}
        />
        <BarChartPanel
          title="Maintenance by Type"
          data={analytics.maintenanceByType}
        />
      </div>
    </div>
  );
}

export const MaintenanceCalendar = ({ orders }: { orders: WorkOrder[] }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {orders.slice(0, 9).map((o) => (
      <WorkOrderCard key={o.workOrderId} order={o} />
    ))}
  </div>
);

export const MaintenanceTimeline = MaintenanceCalendar;

export const AssetMap = ({ buildings }: { buildings: Building[] }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {buildings.slice(0, 9).map((b) => (
      <BuildingCard key={b.buildingId} building={b} />
    ))}
  </div>
);

export const FleetCard = ({
  vehicle,
}: {
  vehicle: {
    registration: string;
    make: string;
    model: string;
    type: string;
    status: string;
  };
}) => (
  <Card>
    <CardContent className="pt-4 flex items-center gap-3">
      <Truck className="h-8 w-8 text-primary shrink-0" />
      <div className="text-sm">
        <p className="font-medium">{vehicle.registration}</p>
        <p className="text-muted-foreground">
          {vehicle.make} {vehicle.model}
        </p>
        <Badge variant="outline" className="capitalize mt-1">
          {vehicle.status.replace('_', ' ')}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

export function ExportToolbar({
  onExport,
}: {
  onExport?: (f: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2">
      {(['csv', 'pdf', 'xlsx'] as const).map((f) => (
        <Button
          key={f}
          variant="outline"
          size="sm"
          onClick={() => onExport?.(f)}
        >
          Export {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export const PreventiveMaintenanceCard = ({
  schedule,
}: {
  schedule: PreventiveMaintenance;
}) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">{schedule.equipmentName}</span>
        <Badge className="capitalize">{schedule.status}</Badge>
      </div>
      <p className="text-muted-foreground">
        Every {schedule.frequencyDays} days
      </p>
      <p className="text-xs">
        Next due: {format(new Date(schedule.nextDue), 'MMM d, yyyy')}
      </p>
    </CardContent>
  </Card>
);
