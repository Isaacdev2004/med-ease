import {
  AnalyticsPanel,
  AssetCard,
  BarcodeScanner,
  ExpiryBanner,
  ExportToolbar,
  ForecastPanel,
  InventoryCard,
  InventoryMetrics,
  PurchaseOrderCard,
  StockMovementTimeline,
  SupplierCard,
  TransferCard,
  WarehouseCard,
} from '@/features/inventory/components/InventoryComponents';
import {
  useAssets,
  useExpiry,
  useForecast,
  useInventory,
  useInventoryAnalytics,
  useInventoryDashboard,
  usePurchaseOrders,
  useSuppliers,
  useTransfers,
  useWarehouses,
} from '@/features/inventory/hooks/use-inventory';
import { useInventoryMutations } from '@/features/inventory/mutations/inventory.mutations';
import type { InventoryFilters } from '@/services/inventory/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Package } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: InventoryFilters }) {
  const dashboard = useInventoryDashboard(filters?.department, filters?.warehouseId);
  if (dashboard.isLoading) return <LoadingView label="Loading inventory…" />;
  if (!dashboard.data) return <EmptyState icon={Package} title="No inventory data" />;
  return (
    <div className="space-y-6">
      <InventoryMetrics dashboard={dashboard.data} />
      {dashboard.data.expiryAlerts.slice(0, 2).map((a) => <ExpiryBanner key={a.alertId} alert={a} />)}
      <StockMovementTimeline movements={dashboard.data.recentMovements} />
    </div>
  );
}

export function StockSection({ filters }: { filters?: InventoryFilters }) {
  const query = useInventory({ ...filters, department: filters?.department ?? 'pharmacy' });
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={Package} title="No stock items" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 15).map((i) => <InventoryCard key={i.inventoryId} item={i} />)}</div>;
}

export function InventoryListSection({ filters }: { filters?: InventoryFilters }) {
  const query = useInventory(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 15).map((i) => <InventoryCard key={i.inventoryId} item={i} />)}</div>;
}

export function ExpirySection({ filters }: { filters?: InventoryFilters }) {
  const query = useExpiry(filters?.department);
  if (query.isLoading) return <LoadingView />;
  const alerts = query.data ?? [];
  if (!alerts.length) return <EmptyState icon={Package} title="No expiry alerts" />;
  return <div className="space-y-3">{alerts.slice(0, 15).map((a) => <ExpiryBanner key={a.alertId} alert={a} />)}</div>;
}

export function PurchaseOrdersSection({ filters }: { filters?: InventoryFilters }) {
  const query = usePurchaseOrders(filters);
  const { approvePurchaseOrder } = useInventoryMutations();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 12).map((o) => (
        <div key={o.purchaseOrderId} className="space-y-2">
          <PurchaseOrderCard order={o} />
          {o.status === 'pending_approval' ? <button type="button" className="text-xs underline" onClick={() => void approvePurchaseOrder.mutateAsync(o.purchaseOrderId)}>Approve</button> : null}
        </div>
      ))}
    </div>
  );
}

export function ReagentsSection() {
  return <InventoryListSection filters={{ category: 'reagent', department: 'laboratory' }} />;
}

export function ConsumablesSection() {
  return <InventoryListSection filters={{ category: 'consumable', department: 'laboratory' }} />;
}

export function EquipmentSection() {
  const query = useAssets({ department: 'radiology' });
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((a) => <AssetCard key={a.assetId} asset={a} />)}</div>;
}

export function AssetsSection({ filters }: { filters?: InventoryFilters }) {
  const query = useAssets(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((a) => <AssetCard key={a.assetId} asset={a} />)}</div>;
}

export function WarehouseSection() {
  const query = useWarehouses();
  const transfers = useTransfers();
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{query.data?.slice(0, 9).map((w) => <WarehouseCard key={w.warehouseId} warehouse={w} />)}</div>
      <div className="grid gap-4 sm:grid-cols-2">{transfers.data?.items.slice(0, 6).map((t) => <TransferCard key={t.transferId} transfer={t} />)}</div>
    </div>
  );
}

export function ProcurementSection() {
  return <PurchaseOrdersSection />;
}

export function SuppliersSection() {
  const query = useSuppliers();
  if (query.isLoading) return <LoadingView />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{query.data?.slice(0, 12).map((s) => <SupplierCard key={s.supplierId} supplier={s} />)}</div>;
}

export function AnalyticsSection() {
  const analytics = useInventoryAnalytics();
  const { exportInventory } = useInventoryMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState icon={Package} title="No analytics" />;
  return (
    <div className="space-y-6">
      <ExportToolbar onExport={(f) => void exportInventory.mutateAsync(f)} />
      <AnalyticsPanel analytics={analytics.data} />
    </div>
  );
}

export function ForecastSection() {
  const query = useForecast();
  if (query.isLoading) return <LoadingView />;
  return <ForecastPanel forecasts={query.data ?? []} />;
}

export function ScannerSection() {
  const { scanBarcode } = useInventoryMutations();
  return <BarcodeScanner onScan={(code) => void scanBarcode.mutateAsync(code)} />;
}

export type InventorySection =
  | 'dashboard' | 'stock' | 'expiry' | 'purchase-orders' | 'reagents' | 'consumables'
  | 'equipment' | 'assets' | 'warehouse' | 'procurement' | 'suppliers' | 'analytics'
  | 'transfers' | 'forecast';

export function InventorySectionContent({ section, filters }: { section: InventorySection; filters?: InventoryFilters }) {
  switch (section) {
    case 'stock': return <StockSection filters={filters} />;
    case 'expiry': return <ExpirySection filters={filters} />;
    case 'purchase-orders': return <PurchaseOrdersSection filters={filters} />;
    case 'reagents': return <ReagentsSection />;
    case 'consumables': return <ConsumablesSection />;
    case 'equipment': return <EquipmentSection />;
    case 'assets': return <AssetsSection filters={filters} />;
    case 'warehouse': return <WarehouseSection />;
    case 'procurement': return <ProcurementSection />;
    case 'suppliers': return <SuppliersSection />;
    case 'analytics': return <AnalyticsSection />;
    case 'forecast': return <ForecastSection />;
    default: return <DashboardSection filters={filters} />;
  }
}
