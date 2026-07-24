import { apiAuthService } from '@/services/auth/api-auth-service';
import { demoAuthService } from '@/services/auth/demo-auth-service';

const authMode = import.meta.env.VITE_AUTH_MODE;
const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL?.trim());

/** API auth when VITE_API_BASE_URL is set; demo auth only when explicitly requested. */
export const useApiAuth = hasApiBase && authMode !== 'demo';

export const authService = useApiAuth ? apiAuthService : demoAuthService;

export { persistAuthSession } from '@/services/auth/auth-persistence';
