import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import { apiClient, getActiveTenantDomain } from '../services/apiClient';

interface TenantContextType {
  siteConfig: SiteConfig | null;
  loading: boolean;
  error: string | null;
  tenantDomain: string;
  setTenantDomain: (domain: string) => void;
  refreshConfig: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantDomain, setTenantDomainState] = useState<string>(getActiveTenantDomain());
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/site/config');
      if (res.data.success) {
        setSiteConfig(res.data.data);
      } else {
        setError(res.data.message || 'Failed to load site config');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Could not connect to college API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [tenantDomain]);

  useEffect(() => {
    if (siteConfig && !window.location.pathname.startsWith('/superadmin')) {
      const siteName = siteConfig.settings?.siteName;
      const tenantName = siteConfig.tenant?.name;
      const titleName = (siteName && siteName !== 'College Management System' && siteName !== 'College Dynamic Portal')
        ? siteName
        : (tenantName || siteName);
      if (titleName) {
        document.title = titleName;
      }
      const iconUrl = siteConfig.settings?.logoUrl || siteConfig.settings?.faviconUrl;
      if (iconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = iconUrl;
      }
    }
  }, [siteConfig]);

  const setTenantDomain = (domain: string) => {
    localStorage.setItem('override_tenant_domain', domain);
    setTenantDomainState(domain);
  };

  return (
    <TenantContext.Provider
      value={{
        siteConfig,
        loading,
        error,
        tenantDomain,
        setTenantDomain,
        refreshConfig: fetchConfig,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within TenantProvider');
  return context;
};
