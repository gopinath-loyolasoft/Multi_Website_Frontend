import React, { useState, useEffect } from 'react';
import { Building2, Palette, ShieldCheck, UserCheck, Eye, EyeOff, Lock } from 'lucide-react';
import { Tenant, Theme } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer } from '../../UI_Componentes/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  college: Tenant | null;
  themes: Theme[];
}

export const EditCollegeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  college,
  themes
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [defaultThemeId, setDefaultThemeId] = useState<string | number>('');
  const [loginTemplate, setLoginTemplate] = useState<string>('template2');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginTemplatesList = [
    { code: 'template1', name: 'Sky Blue & Slanted Angle Wave', style: 'CMS360 Sky Blue', bg: 'from-sky-500 to-blue-600' },
    { code: 'template2', name: 'Royal Gold & Curved Ribbon', style: 'RCM Gold & Maroon', bg: 'from-amber-600 to-amber-800' },
    { code: 'template3', name: 'Emerald Botanical Wave', style: 'GP College Emerald', bg: 'from-emerald-600 to-teal-800' },
    { code: 'template4', name: 'Modern Tech Blue Polygon', style: 'SHC Modern Polygon', bg: 'from-blue-600 to-indigo-900' },
  ];

  useEffect(() => {
    if (college) {
      setName(college.name || '');
      setSlug(college.slug || '');
      setDefaultThemeId(college.defaultThemeId || '');
      setLoginTemplate(college.loginTemplate || 'template2');
      setAdminUsername(college.adminUsername || '');
      setAdminPassword('');
      setShowPassword(false);
      setError(null);

      // Fetch college details to guarantee we have the exact admin username and theme config
      apiClient.get(`/superadmin/colleges/${college.id}`)
        .then((res) => {
          if (res.data.success && res.data.data) {
            const details = res.data.data;
            const primaryAdmin = details.admins?.[0]?.username || details.tenant?.adminUsername;
            if (primaryAdmin) {
              setAdminUsername(primaryAdmin);
            }
            if (details.tenant?.loginTemplate) {
              setLoginTemplate(details.tenant.loginTemplate);
            }
          }
        })
        .catch((err) => {
          console.warn('Could not fetch college details', err);
        });
    }
  }, [college]);

  if (!college) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('Name and slug are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload: any = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        defaultThemeId: defaultThemeId ? defaultThemeId : null,
        loginTemplate: loginTemplate
      };

      if (adminPassword.trim()) {
        payload.adminPassword = adminPassword.trim();
      }

      const res = await apiClient.put(`/superadmin/colleges/${college.id}`, payload);

      if (res.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.data.message || 'Failed to update college');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to update college');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit College Details"
      subtitle={`Tenant Code: ${college.tenantCode} — Configure college identity, theme & admin password`}
      icon={<Building2 className="w-5 h-5 text-blue-600" />}
      mode="edit"
      onSubmit={handleSubmit}
      loading={loading}
      size="md"
    >
      <div className="space-y-4 text-xs">
        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
            College Institution Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="e.g. Oxford Engineering College"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
            URL Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="e.g. oxford-college"
            required
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Used in system routing and tenant canonical paths.
          </p>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span>Assigned Theme</span>
          </label>
          <select
            value={defaultThemeId || ''}
            onChange={(e) => setDefaultThemeId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="">-- Retain Current Theme --</option>
            {themes.map((th) => (
              <option key={th.id} value={th.id}>
                {th.name} ({th.code})
              </option>
            ))}
          </select>
        </div>

        {/* Admin Login Screen Template Selector */}
        <div className="space-y-2 pt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin Login Screen Design Template</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {loginTemplatesList.map((lt) => {
              const isSelected = loginTemplate === lt.code;
              return (
                <div
                  key={lt.code}
                  onClick={() => setLoginTemplate(lt.code)}
                  className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-xs relative overflow-hidden ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-100 shadow-2xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-2 rounded-full w-full bg-gradient-to-r ${lt.bg} mb-1.5`} />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-tight">{lt.code}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 truncate">{lt.style}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* College Administrator Credentials Section */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              College Administrator Account
            </span>
          </div>

          {/* Fixed Admin Username */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
              Admin Username (Fixed System Identifier)
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminUsername || `${college.tenantCode.toLowerCase()}-admin`}
                disabled
                readOnly
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs cursor-not-allowed select-all"
              />
              <span className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 uppercase">
                READ-ONLY
              </span>
            </div>

          </div>

          {/* Admin Password with Eye Toggle */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Update Admin Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter new password "
                autoComplete="new-password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer rounded focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Isolated Database Protection</span>
          </div>
          <p className="text-[11px]">
            Tenant Code (<span className="text-blue-600 font-mono font-bold">{college.tenantCode}</span>) and Database Name (<span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{college.databaseName || `college_${college.tenantCode.toLowerCase()}_database`}</span>) are immutable to safeguard physical PostgreSQL database isolation.
          </p>
        </div>
      </div>
    </FormDrawer>
  );
};
