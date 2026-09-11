import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeMode } from '../../contexts/ThemeModeContext';

interface Props {
  variant?: 'superadmin' | 'admin';
}

export const ThemeToggle: React.FC<Props> = ({ variant = 'admin' }) => {
  const { themeMode, setThemeMode } = useThemeMode();

  const cycleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  const getThemeInfo = () => {
    switch (themeMode) {
      case 'light':
        return {
          icon: <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />,
          title: 'Theme: Light Mode (Click to switch to Dark Mode)',
          label: 'Light'
        };
      case 'dark':
        return {
          icon: <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200 hover:-rotate-12" />,
          title: 'Theme: Dark Mode (Click to switch to System Sync)',
          label: 'Dark'
        };
      default:
        return {
          icon: <Monitor className="w-4 h-4 text-blue-400 transition-transform duration-200" />,
          title: 'Theme: System Mode (Click to switch to Light Mode)',
          label: 'System'
        };
    }
  };

  const { icon, title } = getThemeInfo();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`p-2 rounded-xl transition border shadow-xs cursor-pointer flex items-center justify-center ${
        variant === 'superadmin'
          ? 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
      }`}
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  );
};
