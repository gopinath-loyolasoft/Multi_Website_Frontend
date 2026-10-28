import React, { useState, useEffect } from 'react';
import { Building2, Palette, ShieldCheck, UserCheck, Eye, EyeOff, Lock, RefreshCw } from 'lucide-react';
import { Tenant, Theme } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer } from '../../UI_Componentes/ui';
import { slugify } from '../../utils/helpers';

export interface LoginTemplateOption {
  code: string;
  number: string;
  category: string;
  icon: string;
  style: string;
  bg: string;
  badgeBg: string;
}

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
  const [templateCode, setTemplateCode] = useState<string>('ENGINEERING_MODERN');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const designPacksList = [
    {
      id: 'pack1',
      templateCode: 'ENGINEERING_MODERN',
      loginTemplate: 'template1',
      themeCandidates: ['THEME_BLUE', 'ENG_ROYAL', 'BLUE'],
      number: 'PACK 1',
      category: 'Engineering & Technology',
      icon: '⚙️',
      name: 'Engineering & High-Tech Blueprint Suite',
      loginStyleName: 'SHC Modern Polygon (Tech Blue)',
      description: 'Cyber grid blueprint layout, technical metric counters, laboratory showcases, and structured engineering departments with matching polygon login.',
      bg: 'from-blue-600 to-indigo-900',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800'
    },
    {
      id: 'pack2',
      templateCode: 'ARTS_SCIENCE_MODERN',
      loginTemplate: 'template2',
      themeCandidates: ['THEME_GOLD', 'ARTS_GREEN', 'THEME_EMERALD'],
      number: 'PACK 2',
      category: 'Arts & Science',
      icon: '🎨',
      name: 'Arts & Science Modern Suite',
      loginStyleName: 'RCM Gold & Maroon (Curved Ribbon)',
      description: '3D slanted parallelogram layout with deep gold & maroon accents, gyro tilt cards, and diagonal hero slice with matching curved gold login.',
      bg: 'from-amber-600 to-amber-800',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'pack3',
      templateCode: 'MEDICAL_MODERN',
      loginTemplate: 'template3',
      themeCandidates: ['THEME_TEAL', 'NURSING_CARE', 'THEME_EMERALD'],
      number: 'PACK 3',
      category: 'Medical & Healthcare',
      icon: '⚕️',
      name: 'Medical & Healthcare Institute Suite',
      loginStyleName: 'GP College Emerald (Botanical)',
      description: 'Clinical trust layout, emergency OPD announcement ticker, bed & doctor stats counter, and clinical department cards with matching emerald login.',
      bg: 'from-emerald-600 to-teal-800',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'pack4',
      templateCode: 'UNIVERSITY_MODERN',
      loginTemplate: 'template4',
      themeCandidates: ['THEME_CRIMSON', 'UNIV_CRIMSON', 'THEME_BLUE'],
      number: 'PACK 4',
      category: 'University & Multi-Faculty',
      icon: '🎓',
      name: 'University & Multi-Faculty Suite',
      loginStyleName: 'CMS360 Sky Blue (Prestige Split)',
      description: 'Prestigious collegiate aesthetic with rich header, chancellor leadership showcase, and research gateway with matching sky blue collegiate login.',
      bg: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'pack5',
      templateCode: 'SALESIAN_SLANTED',
      loginTemplate: 'template5',
      themeCandidates: ['THEME_SLANTED_NAVY', 'THEME_BLUE', 'ENG_ROYAL'],
      number: 'PACK 5',
      category: '3D Slanted Design',
      icon: '⚡',
      name: '3D Slanted Navy & Gold Suite',
      loginStyleName: '3D Slanted Navy & Gold (Perspective)',
      description: 'Dedicated 3D perspective tilt cards, polygon media articles, diagonal badges, gold stripe headers, and matching slanted 3D login.',
      bg: 'from-[#134975] to-[#e5a912]',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
    },
    {
      id: 'pack6',
      templateCode: 'DESIGN_3D_GLASS',
      loginTemplate: 'template6',
      themeCandidates: ['THEME_CYBER_GLASS', 'THEME_TEAL', 'THEME_BLUE'],
      number: 'PACK 6',
      category: '3D Glassmorphism',
      icon: '💎',
      name: '3D Holographic Glassmorphism Suite',
      loginStyleName: 'Cyber Aurora Glass (Holographic)',
      description: 'Ultra-modern frosted glass panels, chromatic prism neon glow, floating bokeh spheres, and translucent cards with frosted holographic login.',
      bg: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-500/50'
    },
    {
      id: 'pack7',
      templateCode: 'DESIGN_3D_ISOMETRIC',
      loginTemplate: 'template7',
      themeCandidates: ['THEME_TACTILE_VOXEL', 'THEME_GOLD', 'THEME_BLUE'],
      number: 'PACK 7',
      category: '3D Isometric',
      icon: '🧊',
      name: '3D Isometric Tactile Elevation Suite',
      loginStyleName: 'Tactile Shadow Bevel (Voxel)',
      description: 'Chunky 3D voxel blocks, physical push-buttons with compression feedback, thick shadow bevels, and tactile cards with matching voxel login.',
      bg: 'from-amber-400 to-slate-900',
      badgeBg: 'bg-amber-100 text-slate-900 border-slate-900'
    },
    {
      id: 'pack8',
      templateCode: 'DESIGN_3D_KINETIC',
      loginTemplate: 'template8',
      themeCandidates: ['THEME_KINETIC_NEON', 'THEME_CRIMSON', 'THEME_BLUE'],
      number: 'PACK 8',
      category: '3D Kinetic Flip',
      icon: '⚡',
      name: '3D Kinetic Perspective & Flip Suite',
      loginStyleName: 'Neon Flip Perspective (Kinetic 3D)',
      description: 'True 3D card flips (180° rotation on hover), gyroscopic cursor parallax, kinetic neon ribbon buttons with matching kinetic flip login.',
      bg: 'from-rose-500 via-purple-600 to-indigo-600',
      badgeBg: 'bg-rose-900/60 text-rose-200 border-rose-500/50'
    },
    {
      id: 'pack9',
      templateCode: 'DESIGN_3D_NEUMORPHIC',
      loginTemplate: 'template9',
      themeCandidates: ['THEME_SOFT_NEUMORPHIC', 'THEME_TEAL', 'THEME_BLUE'],
      number: 'PACK 9',
      category: '3D Neumorphic',
      icon: '🛡️',
      name: '3D Neumorphic Soft Depth Suite',
      loginStyleName: 'Embossed Soft Depth (Neumorphic)',
      description: 'Sculpted soft-surface cards, dual-light embossing, debossed pill tags, and soft pillow push-buttons with matching neumorphic embossed login.',
      bg: 'from-teal-600 to-slate-700',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300'
    }
  ];

  const handleSelectDesignPack = (packId: string) => {
    const pack = designPacksList.find(p => p.id === packId || p.loginTemplate === packId || p.templateCode === packId);
    if (!pack) return;
    setTemplateCode(pack.templateCode);
    setLoginTemplate(pack.loginTemplate);
    const matchingTheme = themes.find(t => pack.themeCandidates.includes(t.code)) || themes[0];
    if (matchingTheme) {
      setDefaultThemeId(matchingTheme.id);
    }
  };

  useEffect(() => {
    if (college) {
      setName(college.name || '');
      setSlug(college.slug || '');
      setDefaultThemeId(college.defaultThemeId || '');
      
      const initialTemplateCode = college.templateCode || 'ENGINEERING_MODERN';
      const initialPack = designPacksList.find(p => p.templateCode === initialTemplateCode) 
        || designPacksList.find(p => p.loginTemplate === college.loginTemplate) 
        || designPacksList[0];

      setTemplateCode(initialPack.templateCode);
      setLoginTemplate(initialPack.loginTemplate);
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
            if (details.tenant?.templateCode) {
              const pack = designPacksList.find(p => p.templateCode === details.tenant.templateCode);
              if (pack) {
                setTemplateCode(pack.templateCode);
                setLoginTemplate(pack.loginTemplate);
              } else {
                setTemplateCode(details.tenant.templateCode);
              }
            } else if (details.tenant?.loginTemplate) {
              const pack = designPacksList.find(p => p.loginTemplate === details.tenant.loginTemplate);
              if (pack) {
                setTemplateCode(pack.templateCode);
                setLoginTemplate(pack.loginTemplate);
              }
            }
            if (details.tenant?.defaultThemeId) {
              setDefaultThemeId(details.tenant.defaultThemeId);
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
        loginTemplate: loginTemplate,
        templateCode: templateCode
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
      size="lg"
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
            onChange={(e) => {
              setName(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="e.g. Oxford Engineering College"
            required
          />
        </div>

        {/* Unified College Design & Theme Pack Selector */}
        {(() => {
          const currentActivePack = designPacksList.find(p => p.templateCode === templateCode) || designPacksList.find(p => p.loginTemplate === loginTemplate) || designPacksList[0];
          const assignedTheme = themes.find(t => String(t.id) === String(defaultThemeId)) || themes[0];

          return (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  <span>Unified College Design & Theme Pack</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium">9 Distinct Archetypes</span>
              </div>

              {/* Single 3-in-1 Master Dropdown */}
              <select
                value={currentActivePack.id}
                onChange={(e) => handleSelectDesignPack(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-xs font-medium"
              >
                {designPacksList.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.number}: {pack.icon} {pack.name}
                  </option>
                ))}
              </select>

              {/* Unified 3-in-1 Suite Preview Card */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                      {currentActivePack.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded bg-blue-600 text-white">
                          {currentActivePack.number}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${currentActivePack.badgeBg}`}>
                          {currentActivePack.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {currentActivePack.name}
                      </h4>
                    </div>
                  </div>
                  <div className={`h-6 px-2.5 rounded-lg bg-gradient-to-r ${currentActivePack.bg} shrink-0 shadow-xs border border-white/20 flex items-center justify-center text-[10px] font-mono font-black text-white uppercase`}>
                    {currentActivePack.icon} {currentActivePack.number}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">🎨 Assigned Palette</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{assignedTheme?.name || 'Default Palette'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">🔐 Admin Login</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{currentActivePack.loginStyleName}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
