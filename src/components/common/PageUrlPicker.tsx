import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Link as LinkIcon,
  Search,
  Check,
  ChevronDown,
  X,
  FileText,
  Hash,
  Globe,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface PageOption {
  id?: string | number;
  title: string;
  slug: string;
  category?: string;
  isSystem?: boolean;
}

export interface PageUrlPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  help?: string;
  availablePages?: { id?: string | number; title: string; slug: string }[];
  size?: 'sm' | 'md';
  className?: string;
}

// Default standard college website pages (fallback & baseline)
const SYSTEM_PAGES: PageOption[] = [
  { title: 'Home Page', slug: '/', category: 'Main Pages', isSystem: true },
  { title: 'About Our Institution', slug: '/about', category: 'Main Pages', isSystem: true },
  { title: 'Admissions & Eligibility', slug: '/admissions', category: 'Admissions', isSystem: true },
  { title: 'Academic Degree Programs', slug: '/courses', category: 'Academics', isSystem: true },
  { title: 'Academic Departments & Labs', slug: '/departments', category: 'Academics', isSystem: true },
  { title: 'Distinguished Faculty & Staff', slug: '/faculty', category: 'Academics', isSystem: true },
  { title: 'Placement & Career Outcomes', slug: '/placements', category: 'Placements', isSystem: true },
  { title: 'News & Announcements', slug: '/news', category: 'Campus Life', isSystem: true },
  { title: 'Upcoming Events & Calendar', slug: '/events', category: 'Campus Life', isSystem: true },
  { title: 'Official Notices & Circulars', slug: '/notices', category: 'Circulars', isSystem: true },
  { title: 'Campus Photo Gallery', slug: '/gallery', category: 'Campus Life', isSystem: true },
  { title: 'Contact Us & Campus Directions', slug: '/contact', category: 'Main Pages', isSystem: true },
];

const SECTION_ANCHORS: PageOption[] = [
  { title: 'Jump to Admissions Section', slug: '#admissions', category: 'Section Anchors' },
  { title: 'Jump to Courses & Programs', slug: '#courses', category: 'Section Anchors' },
  { title: 'Jump to Departments Section', slug: '#departments', category: 'Section Anchors' },
  { title: 'Jump to Fee Structure Table', slug: '#fees', category: 'Section Anchors' },
  { title: 'Jump to Faculty Directory', slug: '#faculty', category: 'Section Anchors' },
  { title: 'Jump to Contact Inquiry Form', slug: '#contact', category: 'Section Anchors' },
  { title: 'Jump to Photo Gallery', slug: '#gallery', category: 'Section Anchors' },
  { title: 'Jump to FAQ Section', slug: '#faq', category: 'Section Anchors' },
];

export const PageUrlPicker: React.FC<PageUrlPickerProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Select a page or enter URL (/admissions, https://...)',
  help,
  availablePages = [],
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAGES' | 'ANCHORS' | 'CUSTOM'>('ALL');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Combine dynamic CMS pages + System baseline pages (deduplicating by slug)
  const allPageOptions = useMemo<PageOption[]>(() => {
    const map = new Map<string, PageOption>();

    // 1. Add dynamic CMS pages from database first
    (availablePages || []).forEach((p) => {
      if (!p || !p.slug) return;
      let cleanSlug = p.slug.trim();
      if (!cleanSlug.startsWith('/') && !cleanSlug.startsWith('#') && !cleanSlug.startsWith('http')) {
        cleanSlug = `/${cleanSlug}`;
      }
      map.set(cleanSlug.toLowerCase(), {
        id: p.id,
        title: p.title || cleanSlug,
        slug: cleanSlug,
        category: 'Custom CMS Pages',
      });
    });

    // 2. Add system baseline pages if not already present
    SYSTEM_PAGES.forEach((sp) => {
      const key = sp.slug.toLowerCase();
      if (!map.has(key)) {
        map.set(key, sp);
      }
    });

    return Array.from(map.values());
  }, [availablePages]);

  // Find matching page for current value
  const matchedPage = useMemo(() => {
    if (!value) return null;
    const clean = value.trim().toLowerCase();
    return (
      allPageOptions.find((p) => p.slug.toLowerCase() === clean) ||
      SECTION_ANCHORS.find((a) => a.slug.toLowerCase() === clean)
    );
  }, [value, allPageOptions]);

  // Filtered options based on tab and search query
  const filteredItems = useMemo(() => {
    let items: PageOption[] = [];

    if (activeTab === 'ALL') {
      items = [...allPageOptions, ...SECTION_ANCHORS];
    } else if (activeTab === 'PAGES') {
      items = allPageOptions;
    } else if (activeTab === 'ANCHORS') {
      items = SECTION_ANCHORS;
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [activeTab, searchQuery, allPageOptions]);

  const handleSelect = (slug: string) => {
    onChange(slug);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`space-y-1 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className={`block font-bold text-slate-700 dark:text-slate-300 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
            {label}
          </label>
          {matchedPage && (
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" />
              <span className="truncate max-w-[140px]">{matchedPage.title}</span>
            </span>
          )}
        </div>
      )}

      {/* Input Control with Integrated Page Selector Dropdown */}
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            </div>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full pl-8 pr-7 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono ${
                size === 'sm' ? 'py-1 text-[11px]' : 'py-2 text-xs'
              }`}
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold transition cursor-pointer shrink-0 shadow-2xs ${
              size === 'sm' ? 'py-1 text-[11px]' : 'py-2 text-xs'
            } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600' : ''}`}
            title="Browse & Select Existing Page / Slug"
          >
            <FileText className={size === 'sm' ? 'w-3 h-3 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} />
            <span className="hidden sm:inline">Choose Page</span>
            <ChevronDown className={`transition-transform duration-200 ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 max-w-full">
            {/* Popover Header & Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search page title or slug (e.g. Admissions, /courses)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                {[
                  { id: 'ALL', label: 'All Links' },
                  { id: 'PAGES', label: 'CMS Pages' },
                  { id: 'ANCHORS', label: 'Anchors (#)' },
                  { id: 'CUSTOM', label: 'External / Help' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1 px-1.5 rounded-md transition cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-black'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List Content */}
            <div className="max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60 pr-0.5">
              {activeTab === 'CUSTOM' ? (
                <div className="p-2 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    💡 Custom URL Guide:
                  </p>
                  <ul className="space-y-1.5 text-[10px] leading-relaxed">
                    <li className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span><strong>External Website:</strong> <code>https://example.com</code></span>
                      <button
                        type="button"
                        onClick={() => handleSelect('https://')}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Use Prefix
                      </button>
                    </li>
                    <li className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span><strong>Email Link:</strong> <code>mailto:info@college.edu</code></span>
                      <button
                        type="button"
                        onClick={() => handleSelect('mailto:')}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Use Prefix
                      </button>
                    </li>
                    <li className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span><strong>Phone Call:</strong> <code>tel:+919876543210</code></span>
                      <button
                        type="button"
                        onClick={() => handleSelect('tel:')}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Use Prefix
                      </button>
                    </li>
                  </ul>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                  <p>No matching pages found for "{searchQuery}"</p>
                  <button
                    type="button"
                    onClick={() => handleSelect(searchQuery.startsWith('/') ? searchQuery : `/${searchQuery}`)}
                    className="text-blue-600 font-bold hover:underline text-[11px]"
                  >
                    Use raw input "{searchQuery}"
                  </button>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = value.trim().toLowerCase() === item.slug.toLowerCase();
                  const isAnchor = item.slug.startsWith('#');

                  return (
                    <button
                      key={item.slug + idx}
                      type="button"
                      onClick={() => handleSelect(item.slug)}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between gap-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isAnchor
                              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {isAnchor ? <Hash className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                            {item.slug}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.category && (
                          <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {item.category}
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Helper Footer */}
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Click any page to auto-fill its URL</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {help && <p className="text-[10px] text-slate-400 dark:text-slate-500">{help}</p>}
    </div>
  );
};
