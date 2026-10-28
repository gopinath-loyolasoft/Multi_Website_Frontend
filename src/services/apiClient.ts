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

// Helper to extract a clear, human-readable reason why an operation or deletion failed
export const getApiErrorMessage = (error: any, fallback = 'Operation failed'): string => {
  if (!error) return fallback;

  // 1. Direct server-provided explanation (business rule, validation, constraint message)
  const serverMsg = error.response?.data?.message || error.response?.data?.error;
  if (serverMsg && typeof serverMsg === 'string' && serverMsg.trim() !== '') {
    return serverMsg;
  }

  const status = error.response?.status;
  const method = (error.config?.method || 'DELETE').toUpperCase();
  const url = error.config?.url || '';

  // 2. Specific HTTP Status Reasons
  if (status === 405) {
    return `Server Method Not Allowed (HTTP 405): The server web server or WebDAV module blocked the '${method}' request on '${url}'. If running on IIS, please disable WebDAV Publishing in IIS Manager.`;
  }
  if (status === 403) {
    return `Access Denied (HTTP 403): You do not have permission to delete or modify this resource.`;
  }
  if (status === 404) {
    return `Resource Not Found (HTTP 404): This record does not exist or has already been deleted.`;
  }
  if (status === 409) {
    return `Dependency Conflict (HTTP 409): Cannot delete this record because other active records (such as pages, domains, users, or modules) depend on it.`;
  }
  if (status === 400) {
    return serverMsg || `Invalid Request (HTTP 400): The deletion request was rejected by platform business rules.`;
  }
  if (status === 500) {
    return serverMsg || `Server Error (HTTP 500): The database or backend server encountered an error while processing the delete action.`;
  }

  // 3. Network or Preflight failure (instead of generic "Network Error")
  if (error.message === 'Network Error' || !error.response) {
    const targetBase = getApiBaseUrl();
    if (method === 'DELETE' || method === 'PUT') {
      return `Server Communication Blocked: The server at ${targetBase} rejected the ${method} request (likely HTTP 405 Method Not Allowed / IIS WebDAV blocking). Please check that WebDAV is disabled in IIS or verify backend port.`;
    }
    return `Cannot connect to server at ${targetBase}. Please verify the backend API is running and reachable.`;
  }

  return error.message || fallback;
};

// Response interceptor to handle 401 Unauthorized globally and inject clear failure explanations
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

    // Synthesize clear human-readable error reason
    const clearMessage = getApiErrorMessage(error);
    error.message = clearMessage;
    if (error.response?.data && typeof error.response.data === 'object') {
      error.response.data.message = clearMessage;
    } else {
      error.response = {
        data: { message: clearMessage },
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Error',
        headers: error.response?.headers || {},
        config: error.config,
      } as any;
    }

    return Promise.reject(error);
  }
);
