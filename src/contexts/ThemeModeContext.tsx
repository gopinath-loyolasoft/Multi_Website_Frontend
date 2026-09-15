import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeModeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextType>({
  themeMode: 'light',
  resolvedTheme: 'light',
  setThemeMode: () => {}
});

const STORAGE_KEY = 'college_portal_theme_mode';

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'light'; // Default to light theme
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for sync events from Customizer or other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const mode = e.newValue as ThemeMode;
        if (mode === 'light' || mode === 'dark' || mode === 'system') {
          setThemeModeState(mode);
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setThemeModeState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('college-theme-mode-changed', handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('college-theme-mode-changed', handleCustomEvent);
    };
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      
      // Also sync with useLayoutContext sessionStorage if present
      const sessionConfig = sessionStorage.getItem('__THEME_CONFIG__');
      if (sessionConfig) {
        const parsed = JSON.parse(sessionConfig);
        parsed.theme = mode;
        sessionStorage.setItem('__THEME_CONFIG__', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Failed to save theme mode', e);
    }
    window.dispatchEvent(new CustomEvent('college-theme-mode-changed', { detail: mode }));
  };

  return (
    <ThemeModeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
