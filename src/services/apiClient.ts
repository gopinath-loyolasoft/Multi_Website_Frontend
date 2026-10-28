import axios from 'axios';

// Read API Base URL from the active environment configuration (.env.development / .env.production)
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Optional developer override in browser localStorage (for testing)
    const override = localStorage.getItem('API_URL_OVERRIDE');
    if (override) return override;
  }

  // Pure environment-driven configuration from .env file
  return import.meta.env.VITE_API_BASE_URL || '/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// Check if current hostname is the root platform host (SuperAdmin control plane)
export const isPlatformRootHost = (): boolean => {
  if (typeof window === 'undefined') return true;
  const hostname = window.location.hostname.toLowerCase();
  const configuredRoot = (import.meta.env.VITE_PLATFORM_ROOT_HOST || '').toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'admin.localhost' ||
    hostname === 'schoolsite.loyolasoft.com' ||
    (configuredRoot !== '' && hostname === configuredRoot)
  );
};

// Determine active tenant domain: Hostname if on college domain (e.g. kts.localhost, kts.loyolasoft.com, testwebsitecollege.com), or localStorage override, or default 'rnc.localhost'
export const getActiveTenantDomain = (): string => {
  if (typeof window === 'undefined') return 'rnc.localhost';
  const hostname = window.location.hostname.toLowerCase();
  if (hostname && !isPlatformRootHost()) {
    return hostname;
  }
  return localStorage.getItem('override_tenant_domain') || 'rnc.localhost';
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const tenantDomain = getActiveTenantDomain();
  config.headers['X-Tenant-Domain'] = tenantDomain;

  const token = localStorage.getItem('college_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('college_auth_token');
      localStorage.removeItem('college_auth_user');
      if (window.location.pathname.startsWith('/superadmin') && window.location.pathname !== '/superadmin/login') {
        window.location.href = '/superadmin/login';
      } else if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
