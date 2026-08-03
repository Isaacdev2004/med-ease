import type {
  AssignBedInput,
  Bed,
  BedBoardResult,
  BedFilters,
  BedListResult,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';

export type {
  AssignBedInput,
  Bed,
  BedAssignment,
  BedBoardResult,
  BedBoardSummary,
  BedFilters,
  BedListResult,
  BedStatus,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';

export const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

export function toBedRow(bed: Bed) {
  return {
    id: bed.id,
    ward: bed.ward,
    bed: bed.label,
    type: bed.bedType,
    status: (['available', 'occupied', 'cleaning', 'reserved'].includes(
      bed.status,
    )
      ? bed.status
      : bed.status === 'maintenance' || bed.status === 'blocked'
        ? 'cleaning'
        : 'available') as
      | 'available'
      | 'occupied'
      | 'cleaning'
      | 'reserved',
    patient: bed.patientName,
  };
}

export type { CreateBedInput as CreateBedForm };
export type { AssignBedInput as AssignBedForm };
export type { ReserveBedInput as ReserveBedForm };
export type { UpdateBedStatusInput as UpdateBedStatusForm };
export type { BedFilters as BedsQuery };
export type { BedListResult as BedsPage };
export type { BedBoardResult as BedsBoard };
