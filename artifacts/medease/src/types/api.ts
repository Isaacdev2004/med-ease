export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string | null;
  total?: number;
}

export interface PageParams {
  cursor?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ListFilters {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export type { PortalId } from '@/config/routes';
