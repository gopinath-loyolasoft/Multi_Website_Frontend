import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CollegeCapabilities, AdminModuleItem } from '../types';
import { apiClient } from '../services/apiClient';

interface CapabilityContextType {
  capabilities: CollegeCapabilities | null;
  loading: boolean;
  isFeatureEnabled: (featureCode?: string) => boolean;
  navigationModules: AdminModuleItem[];
  refreshCapabilities: () => Promise<void>;
}

const CapabilityContext = createContext<CapabilityContextType>({
  capabilities: null,
  loading: false,
  isFeatureEnabled: () => true,
  navigationModules: [],
  refreshCapabilities: async () => {},
});

export const CapabilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capabilities, setCapabilities] = useState<CollegeCapabilities | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshCapabilities = useCallback(async () => {
    const token = localStorage.getItem('college_auth_token');
    const userStr = localStorage.getItem('college_auth_user');
    if (!token || !userStr) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.get('/admin/capabilities');
      if (res.data?.success && res.data?.data) {
        setCapabilities(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load college capabilities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCapabilities();
  }, [refreshCapabilities]);

  const isFeatureEnabled = useCallback(
    (featureCode?: string) => {
      if (!featureCode) return true;
      if (!capabilities?.enabledFeatures) return true;
      const upper = featureCode.toUpperCase();
      return capabilities.enabledFeatures.some((f) => f.toUpperCase() === upper);
    },
    [capabilities]
  );

  const navigationModules = capabilities?.modules || [];

  return (
    <CapabilityContext.Provider
      value={{
        capabilities,
        loading,
        isFeatureEnabled,
        navigationModules,
        refreshCapabilities,
      }}
    >
      {children}
    </CapabilityContext.Provider>
  );
};

export const useCapabilities = () => useContext(CapabilityContext);
