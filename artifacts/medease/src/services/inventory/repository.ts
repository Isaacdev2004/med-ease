import { useApiAuth } from '@/services/auth/auth-service';
import { inventoryHttpRepository } from '@/services/inventory/repository.http';
import { inventoryMockRepository } from '@/services/inventory/repository.mock';

type InventoryRepository = typeof inventoryMockRepository;

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const inventoryRepository: InventoryRepository = useApiAuth
  ? (inventoryHttpRepository as unknown as InventoryRepository)
  : inventoryMockRepository;
