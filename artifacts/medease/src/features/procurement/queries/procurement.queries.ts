import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { procurementService } from '@/services/procurement/procurement.service';
import type { ProcurementFilters } from '@/services/procurement/types';

export const procurementQueries = {
  dashboard: (department?: string) => ({
    queryKey: queryKeys.procurement.dashboard(department),
    queryFn: () => procurementService.dashboard(department),
    staleTime: CACHE_TIMES.dashboard,
  }),
  requests: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.requests(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchRequests(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  request: (requestId: string) => ({
    queryKey: queryKeys.procurement.request(requestId),
    queryFn: () => procurementService.getRequest(requestId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(requestId),
  }),
  purchaseOrders: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.purchaseOrders(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchOrders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  purchaseOrder: (purchaseOrderId: string) => ({
    queryKey: queryKeys.procurement.purchaseOrder(purchaseOrderId),
    queryFn: () => procurementService.getOrder(purchaseOrderId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(purchaseOrderId),
  }),
  rfqs: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.rfqs(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchRFQs(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  suppliers: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.suppliers(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchSuppliers(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  supplier: (supplierId: string) => ({
    queryKey: queryKeys.procurement.supplier(supplierId),
    queryFn: () => procurementService.getSupplier(supplierId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(supplierId),
  }),
  contracts: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.contracts(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchContracts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  budgets: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.budgets(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.getBudgets(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  receiving: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.receiving(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchReceiving(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  deliveries: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.deliveries(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchDeliveries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  shipments: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.shipments(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.getShipments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  invoices: (filters?: ProcurementFilters) => ({
    queryKey: queryKeys.procurement.invoices(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => procurementService.searchInvoices(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  analytics: () => ({
    queryKey: queryKeys.procurement.analytics(),
    queryFn: () => procurementService.analytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  forecast: (department?: string) => ({
    queryKey: queryKeys.procurement.forecast(department),
    queryFn: () => procurementService.forecast(department),
    staleTime: CACHE_TIMES.dashboard,
  }),
  approvalQueue: () => ({
    queryKey: queryKeys.procurement.approvalQueue(),
    queryFn: () => procurementService.getApprovalQueue(),
    staleTime: CACHE_TIMES.patientList,
  }),
  supplierPerformance: () => ({
    queryKey: queryKeys.procurement.supplierPerformance(),
    queryFn: () => procurementService.supplierPerformance(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  spendAnalysis: (department?: string) => ({
    queryKey: queryKeys.procurement.spendAnalysis(department),
    queryFn: () => procurementService.spendAnalysis(department),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.procurement.favorites(userId),
    queryFn: () => procurementService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, department?: string) => ({
    queryKey: queryKeys.procurement.search(query, department),
    queryFn: () => procurementService.search(query, department),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
