import React, { useEffect, useState } from 'react';
import { 
  Sliders, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 

  Phone, 
  Mail, 

  Search, 

  Check, 
  X, 

  RefreshCw,
  Globe,
  Save,
  Sparkles,
  GraduationCap,
  Award,
  Building2,
  Users,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog } from '../../UI_Componentes/ui';
import { HeroSection } from '../../components/sections/HeroSection';
import { HeroSliderSection } from '../../components/sections/HeroSliderSection';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  badge?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  pillars?: string[];
  sortOrder: number;
  isActive: boolean;
}

interface ContactSubmission {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export const BannersManagementPage: React.FC = () => {
  const { isArtsAndScience, isMedical } = useTheme();
  const defaultBannerAsset = isArtsAndScience
    ? '/assets/templates/arts/banner1.svg'
    : isMedical
    ? '/assets/templates/medical/banner1.svg'
    : '/assets/templates/engineering/banner1.svg';

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [secondaryCtaText, setSecondaryCtaText] = useState('');
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('');
  const [pillars, setPillars] = useState<string[]>(['', '', '']);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const [activeTab, setActiveTab] = useState<'banners' | 'highlights'>('banners');

  // Hero Highlights Card State
  const [homePageId, setHomePageId] = useState<string | null>(null);
  const [heroSectionId, setHeroSectionId] = useState<string | null>(null);
  const [heroSectionTitle, setHeroSectionTitle] = useState('Welcome to Royal College of Arts and Science');
  const [heroSectionSubtitle, setHeroSectionSubtitle] = useState('Empowering Minds, Shaping Futures');
  const [heroContent, setHeroContent] = useState<any>({
    badge: "NAAC 'A+' Grade Accredited",
    heading: 'Royal College of Arts and Science',
    subheading: 'Knowledge • Character • Society',
    description: "Empowering minds, fostering innovation, and shaping ethical leaders for tomorrow's world.",
    ctaText: 'Explore Programs',
    ctaLink: '/courses',
    secondaryCtaText: 'Virtual Tour',
    secondaryCtaLink: '/about',
    showRightCard: true,
    cardBadge: '2026-27 OPEN',
    cardTitle: 'Campus Highlights',
    cardSubtitle: 'rcm',
    cardPrimaryButtonText: 'Admissions & Eligibility',
    cardPrimaryButtonUrl: '/admissions',
    cardSecondaryButtonText: 'Explore Academic Programs',
    cardSecondaryButtonUrl: '/courses',
    cardItems: [
      { title: 'Autonomous & Accredited', desc: 'Highest NAAC grade with updated industry-aligned curricula.' },
      { title: 'Cutting-Edge Infrastructure', desc: '50+ advanced research labs, smart classrooms & digital library.' },
      { title: 'Placement & Mentorship', desc: 'Over 150+ top MNC recruiters visiting campus annually.' },
    ],
    pillars: ['NAAC Accredited', 'Top Placement Record', 'World-Class Faculty'],
  });
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/banners');
      if (res.data.success) {
        setBanners(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroContent = async () => {
    try {
      setHeroLoading(true);
      const res = await apiClient.get('/admin/pages');
      const pages = res.data?.data?.items || res.data?.data || [];
      const home = pages.find((p: any) => p.slug === 'home');
      if (home) {
        setHomePageId(home.id);
        const secRes = await apiClient.get(`/admin/pages/${home.id}/sections`);
        const secList = secRes.data?.data?.items || secRes.data?.data || [];
        const hero = secList.find((s: any) => s.sectionType === 'HERO');
        if (hero) {
          setHeroSectionId(hero.id);
          setHeroSectionTitle(hero.title || '');
          setHeroSectionSubtitle(hero.subtitle || '');
          if (hero.content && Object.keys(hero.content).length > 0) {
            setHeroContent((prev: any) => ({ ...prev, ...hero.content }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load hero section', err);
    } finally {
      setHeroLoading(false);
    }
  };

  const handleSaveHeroContent = async () => {
    if (!homePageId || !heroSectionId) {
      showNotification('Home page HERO section not found', 'error');
      return;
    }
    try {
      setHeroSaving(true);
      await apiClient.put(`/admin/pages/${homePageId}/sections/${heroSectionId}`, {
        sectionType: 'HERO',
        title: heroSectionTitle,
        subtitle: heroSectionSubtitle,
        content: heroContent,
        isVisible: true,
      });
      showNotification('Campus Highlights & Hero Card updated successfully!');
    } catch (err: any) {
      showNotification('Failed to update hero content', 'error');
    } finally {
      setHeroSaving(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchHeroContent();
  }, []);

  const handleOpenCreate = () => {
    setSelectedBanner(null);
    setDrawerMode('create');
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setCtaText('');
    setCtaUrl('');
    setBadge('');
    setSecondaryCtaText('');
    setSecondaryCtaUrl('');
    setPillars(['NAAC Accredited', 'Top Placement Record', 'World-Class Faculty']);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setSelectedBanner(b);
    setDrawerMode('edit');
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setImageUrl(b.imageUrl || '');
    setCtaText(b.ctaText || '');
    setCtaUrl(b.ctaUrl || '');
    setBadge(b.badge || '');
    setSecondaryCtaText(b.secondaryCtaText || '');
    setSecondaryCtaUrl(b.secondaryCtaUrl || '');
    setPillars(Array.isArray(b.pillars) && b.pillars.length > 0 ? b.pillars : ['NAAC Accredited', 'Top Placement Record', 'World-Class Faculty']);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (b: Banner) => {
    setSelectedBanner(b);
    setDrawerMode('view');
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setImageUrl(b.imageUrl || '');
    setCtaText(b.ctaText || '');
    setCtaUrl(b.ctaUrl || '');
    setBadge(b.badge || '');
    setSecondaryCtaText(b.secondaryCtaText || '');
    setSecondaryCtaUrl(b.secondaryCtaUrl || '');
    setPillars(Array.isArray(b.pillars) && b.pillars.length > 0 ? b.pillars : ['NAAC Accredited', 'Top Placement Record', 'World-Class Faculty']);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const cleanImageUrl = imageUrl.trim() || defaultBannerAsset;
      const cleanCtaText = ctaText.trim() || null;
      const cleanCtaUrl = ctaUrl.trim() || null;
      const cleanBadge = badge.trim() || null;
      const cleanSecCtaText = secondaryCtaText.trim() || null;
      const cleanSecCtaUrl = secondaryCtaUrl.trim() || null;
      const cleanPillars = pillars.filter(p => p && p.trim() !== '');

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        imageUrl: cleanImageUrl,
        ctaText: cleanCtaText,
        ctaUrl: cleanCtaUrl,
        badge: cleanBadge,
        secondaryCtaText: cleanSecCtaText,
        secondaryCtaUrl: cleanSecCtaUrl,
        pillars: cleanPillars.length > 0 ? cleanPillars : null,
      };

      if (drawerMode === 'edit' && selectedBanner) {
        await apiClient.put(`/admin/banners/${selectedBanner.id}`, {
          ...payload,
          sortOrder: selectedBanner.sortOrder,
          isActive: selectedBanner.isActive !== false,
        });
        showNotification('Banner updated successfully');
      } else {
        await apiClient.post('/admin/banners', {
          ...payload,
          sortOrder: banners.length + 1,
          isActive: true,
        });
        showNotification('Banner added successfully');
      }
      setIsDrawerOpen(false);
      fetchBanners();
    } catch (err: any) {
      console.error('Failed to save banner:', err);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Failed to save banner');
      showNotification(errorMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (b: Banner) => {
    const nextStatus = b.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/banners/${b.id}`, {
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        ctaText: b.ctaText,
        ctaUrl: b.ctaUrl,
        sortOrder: b.sortOrder,
        isActive: nextStatus,
      });
      showNotification(`"${b.title}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchBanners();
    } catch {
      showNotification('Failed to update banner status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/banners/${deleteTarget.id}`);
      showNotification('Banner deleted');
      setDeleteTarget(null);
      fetchBanners();
    } catch {
      showNotification('Failed to delete banner', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-blue-600" />
            <span>Promotional Slider Banners</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage full-width headline hero slides, call-to-actions, and background photography.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Slider Banner</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs: Hero & Highlights Card vs Slider Banners */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'highlights'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Campus Highlights & Hero Card</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Slider Background Banners ({banners.length})</span>
        </button>
      </div>

      {activeTab === 'highlights' ? (
        <div className="space-y-6">
          {/* Action Bar for Highlights */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Hero Content & Floating Campus Highlights Card</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Directly controls the right-side highlights card, bullet metrics, admissions CTA buttons, and quick pillars.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveHeroContent}
                disabled={heroSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {heroSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Highlights Card</span>
              </button>
            </div>
          </div>

          {/* Form & Live Mockup Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Editor */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card Main Info */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    1. Card Header & Badge
                  </h3>

                  {/* Active / Inactive Card Status Toggle Button */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Card Display Status:</span>
                    <button
                      type="button"
                      onClick={() => setHeroContent({ ...heroContent, showRightCard: heroContent.showRightCard === false })}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                        heroContent.showRightCard !== false
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                      }`}
                      title="Click to toggle Active / Inactive status on website"
                    >
                      {heroContent.showRightCard !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>ACTIVE (Visible on Website)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>INACTIVE (Hidden on Website)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={heroContent.cardTitle || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardTitle: e.target.value })}
                      placeholder="e.g. Campus Highlights"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Card Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroContent.cardSubtitle || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardSubtitle: e.target.value })}
                      placeholder="e.g. rcm"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Status Badge
                    </label>
                    <input
                      type="text"
                      value={heroContent.cardBadge || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardBadge: e.target.value })}
                      placeholder="e.g. 2026-27 OPEN"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights Bullet Points */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    2. Highlight Bullet Items ({heroContent.cardItems?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setHeroContent({
                      ...heroContent,
                      cardItems: [...(heroContent.cardItems || []), { title: 'New Highlight', desc: 'Description of milestone or facility' }]
                    })}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs hover:bg-blue-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(heroContent.cardItems || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-500 uppercase font-mono">Bullet #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...heroContent.cardItems];
                            next.splice(idx, 1);
                            setHeroContent({ ...heroContent, cardItems: next });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const next = [...heroContent.cardItems];
                          next[idx].title = e.target.value;
                          setHeroContent({ ...heroContent, cardItems: next });
                        }}
                        placeholder="Bullet Title (e.g. Autonomous & Accredited)"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={item.desc || ''}
                        onChange={(e) => {
                          const next = [...heroContent.cardItems];
                          next[idx].desc = e.target.value;
                          setHeroContent({ ...heroContent, cardItems: next });
                        }}
                        placeholder="Bullet Description (e.g. Highest NAAC grade with updated industry-aligned curricula.)"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  3. Action Buttons & Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Primary Yellow Button</span>
                    <input
                      type="text"
                      value={heroContent.cardPrimaryButtonText || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardPrimaryButtonText: e.target.value })}
                      placeholder="Button Text (e.g. Admissions & Eligibility)"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={heroContent.cardPrimaryButtonUrl || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardPrimaryButtonUrl: e.target.value })}
                      placeholder="Button Link (e.g. /admissions)"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-xs font-mono"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Secondary Outline Button</span>
                    <input
                      type="text"
                      value={heroContent.cardSecondaryButtonText || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardSecondaryButtonText: e.target.value })}
                      placeholder="Button Text (e.g. Explore Academic Programs)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={heroContent.cardSecondaryButtonUrl || ''}
                      onChange={(e) => setHeroContent({ ...heroContent, cardSecondaryButtonUrl: e.target.value })}
                      placeholder="Button Link (e.g. /courses)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Pillars */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  4. Quick Institutional Pillars (Checkmarks below hero)
                </h3>
                <p className="text-xs text-slate-500">Separated by comma or enter below:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(heroContent.pillars || ['NAAC Accredited', 'Top Placement Record', 'World-Class Faculty']).map((p: string, idx: number) => (
                    <input
                      key={idx}
                      type="text"
                      value={p}
                      onChange={(e) => {
                        const next = [...(heroContent.pillars || [])];
                        next[idx] = e.target.value;
                        setHeroContent({ ...heroContent, pillars: next });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Interactive Mockup */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-24 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Card Live Mockup Preview</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroContent({ ...heroContent, showRightCard: heroContent.showRightCard === false })}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase transition cursor-pointer border ${
                        heroContent.showRightCard !== false
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                      title="Click to toggle status"
                    >
                      {heroContent.showRightCard !== false ? '• ACTIVE ON WEBSITE' : '• INACTIVE ON WEBSITE'}
                    </button>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full">WYSIWYG</span>
                  </div>
                </div>

                {/* The Floating Card Mockup */}
                <div className={`relative bg-slate-950 p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 text-white transition-all ${
                  heroContent.showRightCard !== false 
                    ? 'border-slate-800 opacity-100' 
                    : 'border-rose-900/60 opacity-60 grayscale'
                }`}>
                  {heroContent.showRightCard === false && (
                    <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
                        <EyeOff className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-sm text-white uppercase tracking-wide">Highlight Card is INACTIVE</p>
                        <p className="text-xs text-slate-300 max-w-xs">
                          This card is currently disabled and hidden from visitors on your live website homepage.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHeroContent({ ...heroContent, showRightCard: true })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 mt-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Set ACTIVE / Enable Card</span>
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-tight">{heroContent.cardTitle || 'Campus Highlights'}</h3>
                        <p className="text-[11px] text-amber-300 font-medium">{heroContent.cardSubtitle || 'rcm'}</p>
                      </div>
                    </div>
                    {heroContent.cardBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {heroContent.cardBadge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-200">
                    {(heroContent.cardItems || []).map((item: any, idx: number) => {
                      const IconComp = idx === 0 ? Award : idx === 1 ? Building2 : Users;
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <IconComp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white">{item.title}</p>
                            {item.desc && <p className="text-[11px] text-slate-300">{item.desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    {heroContent.cardPrimaryButtonText && (
                      <div className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs text-slate-950 bg-amber-400 shadow-md">
                        <span>{heroContent.cardPrimaryButtonText}</span>
                        <span>→</span>
                      </div>
                    )}
                    {heroContent.cardSecondaryButtonText && (
                      <div className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white/90 bg-white/10 border border-white/20">
                        <span>{heroContent.cardSecondaryButtonText}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  <p className="font-bold">Instant Website Synchronization</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Any edits made in this tab update the right-side Hero card on your live homepage automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* Top Collapsible Visual Live Preview */}
      {banners.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Live Hero Slider Monitor ({banners.filter((b) => b.isActive !== false).length} Active Slides)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {showPreview && (
            <div className="preview-monitor p-3 sm:p-5 bg-slate-950">
              <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <HeroSection content={heroContent} banners={banners} />
              </div>
              <p className="text-[11px] text-slate-400 italic pt-2">
                * This live hero monitor renders the exact layout with active slider banners, headline transitions, and the campus highlights card.
              </p>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading promotional banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Sliders className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Slider Banners Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Create rotating banners to promote admissions, placements, and campus life.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((b) => {
            const isActive = b.isActive !== false;
            return (
              <div
                key={b.id}
                className={`bg-white rounded-xl border overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition ${
                  isActive
                    ? 'border-slate-200'
                    : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={b.imageUrl || defaultBannerAsset}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultBannerAsset;
                    }}
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(b)}
                      disabled={actionLoading}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer shadow-xs ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {b.title}
                    </h3>
                    {b.subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {b.subtitle}
                      </p>
                    )}
                    {b.ctaText && (
                      <div className="pt-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          Button: {b.ctaText} → {b.ctaUrl}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      Order: {b.sortOrder}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenView(b)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="View Banner Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: b.id, title: b.title })}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FormDrawer for Banner (Add, Edit, View) */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Create Slider Banner'
            : drawerMode === 'edit'
            ? 'Edit Slider Banner'
            : selectedBanner?.title || 'Banner Details'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Add a full-width promotional banner to the homepage hero'
            : drawerMode === 'edit'
            ? 'Update banner headlines, photo, or call-to-action'
            : 'Preview homepage showcase banner'
        }
        icon={<Sliders className="w-5 h-5 text-primary" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedBanner ? (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-52">
              <img
                src={selectedBanner.imageUrl || defaultBannerAsset}
                alt={selectedBanner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultBannerAsset;
                }}
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedBanner.isActive !== false
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                  }`}
                >
                  {selectedBanner.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {selectedBanner.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Banner Heading</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedBanner.title}</p>
              </div>
              {selectedBanner.subtitle && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Subtitle</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedBanner.subtitle}</p>
                </div>
              )}
              {selectedBanner.ctaText ? (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">CTA Button:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold">
                    {selectedBanner.ctaText} → {selectedBanner.ctaUrl || '#'}
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>CTA Button:</span>
                  <span className="italic">None (Informational Banner)</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Display Sort Order:</span>
                <span className="font-mono font-bold">{selectedBanner.sortOrder}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Top Tag / Badge Text (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. EXCELLENCE IN HIGHER EDUCATION or NAAC A++ ACCREDITED"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-bold uppercase text-amber-600 dark:text-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Banner Heading *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Admissions Open for Engineering & Technology 2026-2027"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Subtitle / Supporting Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. AICTE Approved Tier-1 engineering institution shaping future tech leaders"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
              />
            </div>

            <FileUploadInput
              label="BACKGROUND IMAGE"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="/assets/templates/... or choose local image file"
              helpText="Upload a local image file (SVG, PNG, JPG, WebP) or enter an asset path."
            />

            {/* Primary & Secondary Action Buttons */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Primary & Secondary Action Buttons (Optional)
              </span>

              {/* Primary Button */}
              <div>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1">Primary Button</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Button Label (e.g. Apply Online Now)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="Button URL (e.g. /admissions)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Secondary Button */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Secondary Button</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={secondaryCtaText}
                    onChange={(e) => setSecondaryCtaText(e.target.value)}
                    placeholder="Button Label (e.g. Contact Us)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={secondaryCtaUrl}
                    onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                    placeholder="Button URL (e.g. /contact)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Quick Institutional Pillars */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Quick Feature Pillars (Checkmark Badges below heading)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={pillars[idx] || ''}
                    onChange={(e) => {
                      const next = [...pillars];
                      next[idx] = e.target.value;
                      setPillars(next);
                    }}
                    placeholder={`Pillar #${idx + 1}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-semibold"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Banner"
        message={`This permanently deletes "${deleteTarget?.title}". This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
        </>
      )}
    </div>
  );
};

export const AdmissionsManagementPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Drawer State for viewing submission
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/contact/submissions');
      if (res.data.success) {
        setSubmissions(res.data.data?.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load admission inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleOpenView = (sub: ContactSubmission) => {
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/contact/submissions/${id}/status`, {
        status: nextStatus,
      });
      showNotification(`Lead status updated to ${nextStatus}`);
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: nextStatus });
      }
      fetchSubmissions();
    } catch {
      showNotification('Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      (s.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.phone && s.phone.includes(searchQuery)) ||
      (s.subject && s.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400';
      case 'ENROLLED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-400';
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Admissions & Student Inquiries</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track student applications, follow-up calls, enrollment statuses, and counseling messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by student name, email, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs cursor-pointer min-w-[160px]"
        >
          <option value="">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="REVIEWING">REVIEWING</option>
          <option value="ENROLLED">ENROLLED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading inquiries...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Admission Inquiries Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Prospective student inquiries submitted via the college contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredSubmissions.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:shadow-md transition"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-base text-slate-900">
                    {s.name || s.fullName || 'Prospective Student'}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase ${getStatusBadge(s.status)}`}>
                    {s.status || 'NEW'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700">
                  Subject: {s.subject || 'Admission Counseling Inquiry'}
                </p>

                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-2 leading-relaxed">
                  {s.message}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.email}</span>
                  </div>
                  {s.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Status Selector Dropdown */}
              <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleOpenView(s)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  title="View Full Lead Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                <select
                  value={s.status || 'NEW'}
                  disabled={actionLoading}
                  onChange={(e) => handleUpdateStatus(s.id, e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="REVIEWING">REVIEWING</option>
                  <option value="ENROLLED">ENROLLED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FormDrawer for Viewing and Updating Inquiry */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedSubmission?.name || selectedSubmission?.fullName || 'Admission Inquiry'}
        subtitle="Review prospective student inquiry and manage enrollment pipeline"
        icon={<UserCheck className="w-5 h-5 text-primary" />}
        mode="view"
        size="md"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Stage</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(selectedSubmission.status)}`}>
                  {selectedSubmission.status || 'NEW'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Student Name</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedSubmission.name || selectedSubmission.fullName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date Submitted</span>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedSubmission.createdAt ? new Date(selectedSubmission.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span>{selectedSubmission.email}</span>
                </a>
              </div>
              {selectedSubmission.phone && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                  <a
                    href={`tel:${selectedSubmission.phone}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{selectedSubmission.phone}</span>
                  </a>
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedSubmission.subject || 'General Admission Query'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student Message</span>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedSubmission.message}
              </p>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-2">
              <label className="block text-xs font-bold uppercase text-primary">
                Update Lead Stage
              </label>
              <select
                value={selectedSubmission.status || 'NEW'}
                disabled={actionLoading}
                onChange={(e) => handleUpdateStatus(selectedSubmission.id, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-primary/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="REVIEWING">REVIEWING</option>
                <option value="ENROLLED">ENROLLED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>
        )}
      </FormDrawer>
    </div>
  );
};
