import { format } from 'date-fns';
import {
  AlertTriangle,
  Barcode,
  Box,
  Package,
  Scan,
  Truck,
  Warehouse,
} from 'lucide-react';

import type {
  ExpiryAlert,
  InventoryDashboard,
  InventoryAnalytics,
  InventoryItem,
  MedicalAsset,
  PurchaseOrder,
  StockMovement,
  StockTransfer,
  Supplier,
  Warehouse as WarehouseType,
  DemandForecast,
} from '@/services/inventory/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

function statusVariant(status: InventoryItem['status']) {
  if (status === 'active') return 'default';
  if (status === 'low_stock') return 'secondary';
  if (
    status === 'out_of_stock' ||
    status === 'expired' ||
    status === 'recalled'
  )
    return 'destructive';
  return 'outline';
}

export function InventoryCard({ item }: { item: InventoryItem }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm truncate">{item.itemName}</CardTitle>
          <Badge
            variant={statusVariant(item.status)}
            className="capitalize shrink-0"
          >
            {item.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground">
          {item.sku} · {item.department}
        </p>
        <p className="font-bold">
          {item.availableQuantity} {item.unit} available
        </p>
        <p className="text-xs">
          €{item.purchasePrice} · {item.shelfLocation}
        </p>
        {item.expiryDate ? (
          <p className="text-xs text-amber-600">
            Exp: {format(new Date(item.expiryDate), 'MMM d, yyyy')}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const StockCard = InventoryCard;

export function AssetCard({ asset }: { asset: MedicalAsset }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{asset.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground capitalize">
          {asset.assetType} · {asset.department}
        </p>
        <Badge className="capitalize">{asset.status}</Badge>
        <p>
          Utilization: {asset.utilizationPercent}% · Uptime:{' '}
          {asset.uptimePercent}%
        </p>
        {asset.nextMaintenance ? (
          <p className="text-xs">
            Next service: {format(new Date(asset.nextMaintenance), 'MMM d')}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="font-medium text-sm">{supplier.name}</p>
        <p className="text-xs text-muted-foreground">{supplier.contactEmail}</p>
        <p className="text-sm mt-1">
          Rating: {supplier.rating.toFixed(1)} · OTD:{' '}
          {supplier.onTimeDeliveryRate}%
        </p>
      </CardContent>
    </Card>
  );
}

export function PurchaseOrderCard({ order }: { order: PurchaseOrder }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{order.poNumber}</CardTitle>
          <Badge className="capitalize">{order.status.replace('_', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{order.supplierName}</p>
        <p className="font-bold">€{order.total.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">
          {order.items.length} line items
        </p>
      </CardContent>
    </Card>
  );
}

export function WarehouseCard({ warehouse }: { warehouse: WarehouseType }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Warehouse className="h-8 w-8 text-primary" />
        <div>
          <p className="font-medium text-sm">{warehouse.name}</p>
          <p className="text-xs text-muted-foreground">
            {warehouse.code} · {warehouse.utilizationPercent}% utilized
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransferCard({ transfer }: { transfer: StockTransfer }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{transfer.transferId}</span>
          <Badge className="capitalize">
            {transfer.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          {transfer.fromWarehouseName} → {transfer.toWarehouseName}
        </p>
        <p className="text-xs">{transfer.items.length} item(s)</p>
      </CardContent>
    </Card>
  );
}

export function ExpiryBanner({ alert }: { alert: ExpiryAlert }) {
  const variant =
    alert.severity === 'critical'
      ? 'destructive'
      : alert.severity === 'warning'
        ? 'secondary'
        : 'outline';
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border p-3 text-sm',
        alert.severity === 'critical' && 'border-destructive bg-destructive/5',
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        <strong>{alert.itemName}</strong> expires in {alert.daysUntilExpiry}{' '}
        days ({alert.quantity} {alert.department})
      </span>
      <Badge variant={variant} className="ml-auto capitalize">
        {alert.severity}
      </Badge>
    </div>
  );
}

export function BarcodeScanner({
  onScan,
}: {
  onScan?: (code: string) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 flex flex-col items-center gap-3 text-center">
        <Scan className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm font-medium">Barcode Scanner</p>
        <p className="text-xs text-muted-foreground">
          GS1 / RFID ready · mock scan
        </p>
        <Button size="sm" onClick={() => onScan?.('5901234000001')}>
          <Barcode className="mr-1 h-3 w-3" />
          Simulate Scan
        </Button>
      </CardContent>
    </Card>
  );
}

export const QRCodePanel = ({ code }: { code: string }) => (
  <Card>
    <CardContent className="pt-4 text-center text-sm">
      <Package className="h-8 w-8 mx-auto mb-2" />
      <p className="font-mono text-xs">{code}</p>
    </CardContent>
  </Card>
);

export function InventoryMetrics({
  dashboard,
}: {
  dashboard: InventoryDashboard;
}) {
  const kpis = [
    { label: 'Total items', value: dashboard.totalItems.toLocaleString() },
    {
      label: 'Inventory value',
      value: `€${dashboard.inventoryValue.toLocaleString()}`,
    },
    { label: 'Low stock', value: dashboard.lowStockCount },
    { label: 'Out of stock', value: dashboard.outOfStockCount },
    { label: 'Pending POs', value: dashboard.pendingOrders },
    { label: 'Active transfers', value: dashboard.activeTransfers },
    { label: 'Stock turnover', value: dashboard.stockTurnover.toFixed(1) },
    { label: 'Asset utilization', value: `${dashboard.assetUtilization}%` },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StockMovementTimeline({
  movements,
}: {
  movements: StockMovement[];
}) {
  return (
    <div className="space-y-3">
      {movements.map((m) => (
        <div key={m.movementId} className="border-l-2 border-primary/30 pl-4">
          <p className="text-sm font-medium capitalize">
            {m.type} · {m.itemName}
          </p>
          <p className="text-sm">
            {m.quantity > 0 ? '+' : ''}
            {m.quantity}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(m.createdAt), 'MMM d, HH:mm')}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ForecastPanel({ forecasts }: { forecasts: DemandForecast[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {forecasts.slice(0, 6).map((f) => (
        <Card key={f.inventoryId}>
          <CardContent className="pt-4 text-sm">
            <p className="font-medium">{f.itemName}</p>
            <p>
              Stock: {f.currentStock} · Usage: {f.avgDailyUsage}/day
            </p>
            {f.recommendedOrder > 0 ? (
              <p className="text-amber-600">Reorder: {f.recommendedOrder}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: InventoryAnalytics;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel
        title="Inventory trends"
        data={analytics.inventoryTrends}
      />
      <BarChartPanel
        title="Consumption by department"
        data={analytics.consumptionByDepartment}
      />
      <BarChartPanel
        title="Procurement spend"
        data={analytics.procurementSpend}
      />
      <BarChartPanel title="ABC analysis" data={analytics.abcAnalysis} />
    </div>
  );
}

export const CycleCountCard = ({
  count,
}: {
  count: {
    cycleCountId: string;
    warehouseName: string;
    status: string;
    itemsCounted: number;
  };
}) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <p className="font-medium">{count.warehouseName}</p>
      <Badge className="capitalize">{count.status.replace('_', ' ')}</Badge>
      <p>{count.itemsCounted} items counted</p>
    </CardContent>
  </Card>
);

export const AdjustmentCard = ({
  item,
  qty,
}: {
  item: string;
  qty: number;
}) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <p>{item}</p>
      <p className="font-bold">Adjusted to {qty}</p>
    </CardContent>
  </Card>
);

export const ReceivingPanel = ({ poNumber }: { poNumber: string }) => (
  <Card>
    <CardContent className="pt-4 flex items-center gap-2 text-sm">
      <Truck className="h-5 w-5" />
      Receiving PO {poNumber}
    </CardContent>
  </Card>
);

export const IssuePanel = ({ item, qty }: { item: string; qty: number }) => (
  <Card>
    <CardContent className="pt-4 flex items-center gap-2 text-sm">
      <Box className="h-5 w-5" />
      Issue {qty} × {item}
    </CardContent>
  </Card>
);

export const ExportToolbar = ({
  onExport,
}: {
  onExport?: (f: 'csv' | 'pdf' | 'xlsx') => void;
}) => (
  <div className="flex gap-2">
    {(['xlsx', 'csv', 'pdf'] as const).map((f) => (
      <Button key={f} size="sm" variant="outline" onClick={() => onExport?.(f)}>
        {f.toUpperCase()}
      </Button>
    ))}
  </div>
);

export const InventoryDashboardPanel = InventoryMetrics;
