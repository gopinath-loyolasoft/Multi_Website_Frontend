import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Book,
  Award,
  Trophy,
  Medal,
  Building2,
  Landmark,
  Building,
  MapPin,
  Compass,
  ShieldCheck,
  Home,
  Wifi,
  Users,
  UserCheck,
  Heart,
  Smile,
  MessageSquare,
  Handshake,
  Globe,
  Globe2,
  Sparkles,
  Lightbulb,
  Rocket,
  Zap,
  Atom,
  TrendingUp,
  BarChart3,
  PieChart,
  Briefcase,
  Target,
  LineChart,
  CheckCircle2,
  Layers,
  Cpu,
  Laptop,
  Code,
  Database,
  Server,
  Settings,
  Shield,
  Key,
  Star,
  Calendar,
  Clock,
  Mail,
  Phone,
  FileText,
  Check,
  Search,
  ChevronDown,
  X,
  HeartPulse,
  Bell,
  AlertCircle,
  Megaphone,
  Radio,
  Activity,
  Info,
  Flame,
  ShieldAlert,
  HelpCircle,
  Headphones,
  MessageCircle,
  Volume2,
  LucideIcon
} from 'lucide-react';

export interface IconOption {
  name: string;
  label: string;
  category: string;
  icon: LucideIcon;
  tags?: string[];
}

export const AVAILABLE_ICONS: IconOption[] = [
  // Helplines, Announcements & Emergency
  { name: 'HeartPulse', label: 'Casualty & Medical Pulse', category: 'Helpline & Alerts', icon: HeartPulse, tags: ['emergency', 'casualty', 'doctor', 'hospital', 'ambulance', 'medical'] },
  { name: 'Phone', label: 'Helpline Phone', category: 'Helpline & Alerts', icon: Phone, tags: ['call', 'helpline', 'contact', 'support', 'admissions hotline', 'toll free'] },
  { name: 'Megaphone', label: 'Megaphone Broadcast', category: 'Helpline & Alerts', icon: Megaphone, tags: ['announcement', 'press', 'broadcast', 'news', 'notice'] },
  { name: 'Bell', label: 'Notification Bell', category: 'Helpline & Alerts', icon: Bell, tags: ['alert', 'circular', 'reminder', 'notice', 'update'] },
  { name: 'AlertCircle', label: 'Urgent Alert', category: 'Helpline & Alerts', icon: AlertCircle, tags: ['warning', 'urgent', 'important', 'notice', 'attention'] },
  { name: 'Sparkles', label: 'Admissions Highlight', category: 'Helpline & Alerts', icon: Sparkles, tags: ['excellence', 'star', 'featured', 'admissions open', 'special'] },
  { name: 'Volume2', label: 'Audio Announcement', category: 'Helpline & Alerts', icon: Volume2, tags: ['broadcast', 'speaker', 'sound', 'audio', 'marquee'] },
  { name: 'Radio', label: 'Live Radio / Broadcast', category: 'Helpline & Alerts', icon: Radio, tags: ['live', 'stream', 'broadcast', 'frequency'] },
  { name: 'Activity', label: 'Clinical Vital Activity', category: 'Helpline & Alerts', icon: Activity, tags: ['health', 'pulse', 'vital', 'clinical', 'hospital'] },
  { name: 'ShieldAlert', label: 'Security & Safety Alert', category: 'Helpline & Alerts', icon: ShieldAlert, tags: ['safety', 'warning', 'security', 'protection'] },
  { name: 'Headphones', label: 'Helpdesk & Counseling', category: 'Helpline & Alerts', icon: Headphones, tags: ['support', 'counseling', 'student helpdesk', 'advisor'] },
  { name: 'MessageCircle', label: 'Student Inquiries Chat', category: 'Helpline & Alerts', icon: MessageCircle, tags: ['chat', 'inquiry', 'message', 'helpdesk'] },
  { name: 'Info', label: 'Campus Information Desk', category: 'Helpline & Alerts', icon: Info, tags: ['information', 'guide', 'help', 'details'] },
  { name: 'Flame', label: 'Trending & Hot Notice', category: 'Helpline & Alerts', icon: Flame, tags: ['hot', 'urgent', 'breaking', 'fire'] },

  // Education & Academics
  { name: 'GraduationCap', label: 'Graduation Cap', category: 'Education', icon: GraduationCap, tags: ['degree', 'college', 'student', 'alumni'] },
  { name: 'BookOpen', label: 'Open Book', category: 'Education', icon: BookOpen, tags: ['reading', 'courses', 'curriculum', 'study'] },
  { name: 'Book', label: 'Book', category: 'Education', icon: Book, tags: ['library', 'reading', 'syllabus'] },
  { name: 'Award', label: 'Award Ribbon', category: 'Education', icon: Award, tags: ['prize', 'achievement', 'ranking', 'winner'] },
  { name: 'Trophy', label: 'Trophy', category: 'Education', icon: Trophy, tags: ['championship', 'sports', 'gold', 'winner'] },
  { name: 'Medal', label: 'Medal', category: 'Education', icon: Medal, tags: ['honor', 'distinction', 'placement'] },

  // Campus & Infrastructure
  { name: 'Building2', label: 'Campus Building', category: 'Campus', icon: Building2, tags: ['department', 'faculty', 'hall', 'campus'] },
  { name: 'Landmark', label: 'Historic Landmark', category: 'Campus', icon: Landmark, tags: ['institution', 'heritage', 'university'] },
  { name: 'Building', label: 'Building', category: 'Campus', icon: Building, tags: ['hostel', 'lab', 'facility'] },
  { name: 'MapPin', label: 'Map Pin Location', category: 'Campus', icon: MapPin, tags: ['address', 'city', 'location', 'travel'] },
  { name: 'Compass', label: 'Compass', category: 'Campus', icon: Compass, tags: ['guidance', 'orientation', 'navigation'] },
  { name: 'ShieldCheck', label: 'Verified Shield', category: 'Campus', icon: ShieldCheck, tags: ['accredited', 'naac', 'ugc', 'safety'] },
  { name: 'Wifi', label: 'Wi-Fi / Connectivity', category: 'Campus', icon: Wifi, tags: ['smart campus', 'digital', 'internet'] },
  { name: 'Home', label: 'Campus Residence', category: 'Campus', icon: Home, tags: ['hostel', 'dormitory', 'housing'] },

  // Global & Innovation
  { name: 'Globe', label: 'Global Network', category: 'Global & Innovation', icon: Globe, tags: ['exchange', 'international', 'abroad', 'world'] },
  { name: 'Globe2', label: 'Globe Grid', category: 'Global & Innovation', icon: Globe2, tags: ['foreign', 'partner', 'outreach'] },
  { name: 'Sparkles', label: 'Sparkles', category: 'Global & Innovation', icon: Sparkles, tags: ['excellence', 'distinction', 'featured'] },
  { name: 'Lightbulb', label: 'Innovation & Idea', category: 'Global & Innovation', icon: Lightbulb, tags: ['creativity', 'incubation', 'startup', 'idea'] },
  { name: 'Rocket', label: 'Rocket Launch', category: 'Global & Innovation', icon: Rocket, tags: ['career boost', 'accelerator', 'growth'] },
  { name: 'Zap', label: 'Lightning Energy', category: 'Global & Innovation', icon: Zap, tags: ['fast track', 'energy', 'power'] },
  { name: 'Atom', label: 'Science & Research', category: 'Global & Innovation', icon: Atom, tags: ['physics', 'stem', 'laboratory'] },

  // People & Community
  { name: 'Users', label: 'Community & Students', category: 'Community', icon: Users, tags: ['people', 'students', 'crowd', 'clubs'] },
  { name: 'UserCheck', label: 'Faculty & Mentors', category: 'Community', icon: UserCheck, tags: ['professor', 'teacher', 'mentor'] },
  { name: 'Heart', label: 'Healthcare & Wellness', category: 'Community', icon: Heart, tags: ['care', 'medical', 'hospital', 'nss'] },
  { name: 'Smile', label: 'Student Life', category: 'Community', icon: Smile, tags: ['events', 'happiness', 'wellness'] },
  { name: 'MessageSquare', label: 'Forum & Dialogue', category: 'Community', icon: MessageSquare, tags: ['chat', 'advisory', 'counseling'] },
  { name: 'Handshake', label: 'Industry Partnerships', category: 'Community', icon: Handshake, tags: ['mou', 'collaboration', 'corporate'] },

  // Career & Statistics
  { name: 'TrendingUp', label: 'Growth & Placements', category: 'Career & Analytics', icon: TrendingUp, tags: ['jobs', 'salary', 'progress', 'hiring'] },
  { name: 'Briefcase', label: 'Career & Jobs', category: 'Career & Analytics', icon: Briefcase, tags: ['recruiting', 'internships', 'placement'] },
  { name: 'Target', label: 'Goal & Mission', category: 'Career & Analytics', icon: Target, tags: ['vision', 'objective', 'milestone'] },
  { name: 'BarChart3', label: 'Bar Chart', category: 'Career & Analytics', icon: BarChart3, tags: ['metrics', 'analytics', 'statistics'] },
  { name: 'PieChart', label: 'Pie Chart', category: 'Career & Analytics', icon: PieChart, tags: ['demographics', 'distribution'] },
  { name: 'LineChart', label: 'Line Chart', category: 'Career & Analytics', icon: LineChart, tags: ['trends', 'historical'] },
  { name: 'CheckCircle2', label: 'Quality Verified', category: 'Career & Analytics', icon: CheckCircle2, tags: ['success', 'certified', 'passed'] },
  { name: 'Layers', label: 'Multi-Disciplinary', category: 'Career & Analytics', icon: Layers, tags: ['programs', 'structure', 'stacked'] },

  // Technology & STEM
  { name: 'Cpu', label: 'AI & Computing', category: 'Tech & STEM', icon: Cpu, tags: ['processor', 'hardware', 'technology'] },
  { name: 'Laptop', label: 'E-Learning & Tech', category: 'Tech & STEM', icon: Laptop, tags: ['coding', 'computers', 'online'] },
  { name: 'Code', label: 'Software Engineering', category: 'Tech & STEM', icon: Code, tags: ['developer', 'programming', 'hackathon'] },
  { name: 'Database', label: 'Data Science', category: 'Tech & STEM', icon: Database, tags: ['big data', 'sql', 'analytics'] },
  { name: 'Server', label: 'Infrastructure', category: 'Tech & STEM', icon: Server, tags: ['cloud', 'network', 'datacenter'] },
  { name: 'Settings', label: 'Engineering', category: 'Tech & STEM', icon: Settings, tags: ['mechanical', 'gear', 'tools'] },
  { name: 'Shield', label: 'Cybersecurity', category: 'Tech & STEM', icon: Shield, tags: ['security', 'protection', 'privacy'] },
  { name: 'Key', label: 'Access & Security', category: 'Tech & STEM', icon: Key, tags: ['portal', 'login', 'credentials'] },

  // General & Essentials
  { name: 'Star', label: 'Top Rated', category: 'General', icon: Star, tags: ['favorite', 'special', 'featured'] },
  { name: 'Calendar', label: 'Events & Schedule', category: 'General', icon: Calendar, tags: ['dates', 'academic year', 'timeline'] },
  { name: 'Clock', label: 'Timetable', category: 'General', icon: Clock, tags: ['hours', 'time', 'shifts'] },
  { name: 'Mail', label: 'Contact Email', category: 'General', icon: Mail, tags: ['inbox', 'communication', 'message'] },
  { name: 'Phone', label: 'Helpdesk Phone', category: 'General', icon: Phone, tags: ['call', 'support', 'admissions hotline'] },
  { name: 'FileText', label: 'Documentation', category: 'General', icon: FileText, tags: ['brochure', 'prospectus', 'report'] }
];

export const getLucideIcon = (name?: string): LucideIcon => {
  if (!name) return Award;
  const normalized = name.toLowerCase().replace(/[-_\s]/g, '');
  const match = AVAILABLE_ICONS.find(
    (item) => item.name.toLowerCase().replace(/[-_\s]/g, '') === normalized
  );
  return match ? match.icon : Award;
};

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  label?: string;
  placeholder?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Select an icon...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_ICONS.forEach((i) => set.add(i.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredIcons = useMemo(() => {
    const q = search.toLowerCase().trim();
    return AVAILABLE_ICONS.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const matchName = item.name.toLowerCase().includes(q) || item.label.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      return matchName || matchTags;
    });
  }, [search, selectedCategory]);

  const selectedItem = useMemo(() => {
    if (!value) return null;
    const normalized = value.toLowerCase().replace(/[-_\s]/g, '');
    return AVAILABLE_ICONS.find(
      (i) => i.name.toLowerCase().replace(/[-_\s]/g, '') === normalized
    ) || null;
  }, [value]);

  const SelectedIcon = selectedItem ? selectedItem.icon : value ? getLucideIcon(value) : null;

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition shadow-2xs ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {SelectedIcon ? (
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <SelectedIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <div className="flex flex-col text-left truncate">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {selectedItem ? selectedItem.name : value || placeholder}
            </span>
            {selectedItem && (
              <span className="text-[10px] text-slate-400 font-medium">
                {selectedItem.label} • {selectedItem.category}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
              title="Clear icon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </div>
      </div>

      {/* Dropdown Modal Popover */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute left-0 right-0 top-full mt-2 z-50 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 max-h-[380px] flex flex-col">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icon by name or keyword (e.g. global, book, rank)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-[220px]">
              {filteredIcons.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedItem?.name === item.name || value === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      onChange(item.name);
                      setIsOpen(false);
                    }}
                    title={`${item.label} (${item.name})`}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition cursor-pointer group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-600'
                        : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30'
                    }`}
                  >
                    <ItemIcon className="w-5 h-5 group-hover:scale-110 transition shrink-0" />
                    <span className="text-[9px] font-medium truncate max-w-full leading-tight">
                      {item.name}
                    </span>
                  </button>
                );
              })}

              {filteredIcons.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-slate-400 space-y-1">
                  <p className="font-semibold">No icons match "{search}"</p>
                  <p className="text-[10px]">Try searching for words like "book", "student", "globe", or "award"</p>
                </div>
              )}
            </div>

            {/* Manual custom input footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{filteredIcons.length} icons available</span>
              <span className="font-mono text-[10px]">Click any icon to pick</span>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
