/**
 * Unified Multi-Tenant Domain Utilities
 * Seamlessly resolves and formats domains for both Local Development and Live Production.
 */

export const isLocalEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost') ||
    hostname === 'admin.localhost'
  );
};

export const getPlatformBaseDomain = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    // If running on live loyolasoft.com domain or subdomain
    if (hostname.endsWith('.loyolasoft.com') || hostname === 'loyolasoft.com') {
      return 'loyolasoft.com';
    }
    // If running locally
    if (isLocalEnvironment()) {
      return 'localhost';
    }
    // Any other live production domain (e.g. yourdomain.com)
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
  }
  return import.meta.env.VITE_PLATFORM_BASE_DOMAIN || 'loyolasoft.com';
};

export const getPlatformRootHost = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.endsWith('.loyolasoft.com') || hostname === 'loyolasoft.com') {
      return 'schoolsite.loyolasoft.com';
    }
    if (isLocalEnvironment()) {
      return 'localhost';
    }
  }
  return import.meta.env.VITE_PLATFORM_ROOT_HOST || 'schoolsite.loyolasoft.com';
};

/**
 * Returns clean canonical display domain for presentation in UI/tables.
 * Example: 'sjs.loyolasoft.com' or 'ourladychetpet.org'
 */
export const formatDisplayDomain = (
  primaryDomain?: string,
  tenantCode?: string,
  slug?: string
): string => {
  const isLocal = isLocalEnvironment();
  const baseDomain = getPlatformBaseDomain();

  if (primaryDomain && primaryDomain.trim()) {
    let clean = primaryDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').split(':')[0];

    // If it's just a single word without dots (e.g. "sjs"), attach the appropriate base domain
    if (!clean.includes('.')) {
      clean = isLocal ? `${clean}.localhost` : `${clean}.${baseDomain}`;
    }

    // In live production, replace legacy/accidental .localhost with the real platform base domain
    if (!isLocal && clean.endsWith('.localhost')) {
      const prefix = clean.replace('.localhost', '');
      return `${prefix}.${baseDomain}`;
    }

    return clean;
  }

  const base = (slug || tenantCode || 'college').toLowerCase().replace(/[^a-z0-9]/g, '');
  return isLocal ? `${base}.localhost` : `${base}.${baseDomain}`;
};

/**
 * Resolves the appropriate portal URL for clicking/launching:
 * - In Development (localhost): routes to `http://<tenantCode|slug>.localhost:3000`
 * - In Production: routes to `https://<primaryDomain>` or `https://<slug>.loyolasoft.com`
 */
export const resolveTenantPortalUrl = (
  primaryDomain?: string,
  tenantCode?: string,
  slug?: string
): string => {
  if (typeof window === 'undefined') return '#';

  const isLocal = isLocalEnvironment();
  const portSuffix = window.location.port ? `:${window.location.port}` : '';
  const codeOrSlug = (tenantCode || slug || 'college').toLowerCase().replace(/[^a-z0-9]/g, '');
  const basePlatform = getPlatformBaseDomain();

  if (isLocal) {
    if (primaryDomain && primaryDomain.trim()) {
      let clean = primaryDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').split(':')[0];
      if (!clean.includes('.')) {
        clean = `${clean}.localhost`;
      }
      return `http://${clean}${portSuffix}`;
    }
    return `http://${codeOrSlug}.localhost${portSuffix}`;
  }

  // Live Production
  if (primaryDomain && primaryDomain.trim()) {
    let clean = primaryDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').split(':')[0];

    // If it's a single word without any dot (e.g. "sjs"), append the platform base domain
    if (!clean.includes('.')) {
      clean = `${clean}.${basePlatform}`;
    }

    // If it mistakenly ended with .localhost, convert it to live platform domain
    if (clean.endsWith('.localhost')) {
      const prefix = clean.replace('.localhost', '');
      clean = `${prefix}.${basePlatform}`;
    }

    return `https://${clean}`;
  }

  return `https://${codeOrSlug}.${basePlatform}`;
};
