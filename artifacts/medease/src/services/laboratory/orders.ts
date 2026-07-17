import type {
  LabOrder,
  LabOrderFilters,
  LabOrderStatus,
} from '@/services/laboratory/types';

export function categorizeOrders(orders: LabOrder[]) {
  return {
    pending: orders.filter((o) => ['pending', 'scheduled'].includes(o.status)),
    collected: orders.filter((o) => o.status === 'collected'),
    processing: orders.filter((o) => o.status === 'in_progress'),
    completed: orders.filter((o) => o.status === 'completed'),
    cancelled: orders.filter((o) => o.status === 'cancelled'),
  };
}

export function sortOrdersByDate(orders: LabOrder[]): LabOrder[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function isOrderEditable(status: LabOrderStatus): boolean {
  return ['draft', 'pending', 'scheduled'].includes(status);
}

export function matchesOrderFilters(
  order: LabOrder,
  filters: LabOrderFilters,
): boolean {
  if (filters.patientId && order.patientId !== filters.patientId) return false;
  if (filters.status && order.status !== filters.status) return false;
  if (filters.priority && order.priority !== filters.priority) return false;
  if (filters.facilityId && order.facilityId !== filters.facilityId)
    return false;
  if (filters.laboratoryId && order.laboratoryId !== filters.laboratoryId)
    return false;
  if (filters.carePlanId && order.carePlanId !== filters.carePlanId)
    return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (
      !`${order.orderNumber} ${order.patientName} ${order.testNames.join(' ')}`
        .toLowerCase()
        .includes(q)
    )
      return false;
  }
  return true;
}
