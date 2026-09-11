import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api/v1';

// Check if current hostname is the root platform host (SuperAdmin control plane)
export const isPlatformRootHost = (): boolean => {
  const hostname = window.location.hostname.toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === 'admin.localhost';
};

// Determine active tenant domain: Hostname if on college domain (e.g. kts.localhost, kts.localhost.com), or localStorage override, or default 'rnc.localhost'
export const getActiveTenantDomain = (): string => {
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
