import React from 'react';
import { TenantProvider } from './tenant/TenantContext';
import { ThemeProvider } from './themes/ThemeContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import { LayoutProvider } from './context/useLayoutContext';
import { ToastProvider } from './UI_Componentes/ui';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <TenantProvider>
      <ThemeProvider>
        <ThemeModeProvider>
          <LayoutProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </LayoutProvider>
        </ThemeModeProvider>
      </ThemeProvider>
    </TenantProvider>
  );
}

export default App;
