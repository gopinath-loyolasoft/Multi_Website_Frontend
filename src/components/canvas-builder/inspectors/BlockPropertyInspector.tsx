import React, { useState } from 'react';
import {
  Settings,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Upload,
  Plus,
  Trash,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Layers,
  MapPin,
  Sparkles,
  Users,
  Bell,
  GraduationCap,
  Grid,
  FileText,
  Play,
  HelpCircle,
  Award,
  BarChart3,
  Compass,
  Link,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { CanvasBlock, CanvasBlockStyle } from '../../../types/canvasBuilder';
import { PageUrlPicker } from '../../common/PageUrlPicker';

interface BlockPropertyInspectorProps {
  block: CanvasBlock | null;
  onUpdateContent: (id: string, content: Record<string, any>) => void;
  onUpdateStyles: (id: string, styles: Record<string, any>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onClose: () => void;
  availablePages?: { id?: string | number; title: string; slug: string }[];
}

export const BlockPropertyInspector: React.FC<BlockPropertyInspectorProps> = ({
  block,
  onUpdateContent,
  onUpdateStyles,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onClose,
  availablePages = [],
}) => {
  const [expandedSection, setExpandedSection] = useState<'content' | 'typography' | 'appearance' | 'layout'>('content');

  if (!block) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 select-none">
        <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Properties</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <Settings className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            No Element Selected
          </p>
          <p className="text-[11px] leading-relaxed">
            Click any block or field on the canvas to customize its content, typography, and styling properties.
          </p>
        </div>
      </div>
    );
  }

  const styles: CanvasBlockStyle = block.styles || {};
  const content = block.content || {};

  const handleUpdateStyles = (newStyles: Partial<CanvasBlockStyle>) => {
    onUpdateStyles(block.id, newStyles);
  };

  const handleUpdateContent = (newContent: Record<string, any>) => {
    onUpdateContent(block.id, newContent);
  };

  const toggleStyleProp = (prop: keyof CanvasBlockStyle, activeVal: any, inactiveVal: any) => {
    const currentVal = styles[prop];
    handleUpdateStyles({ [prop]: currentVal === activeVal ? inactiveVal : activeVal });
  };

  const handleBorderPresetChange = (preset: string) => {
    const width = styles.borderWidth || '1px';
    const bStyle = styles.borderStyle || 'solid';
    const color = styles.borderColor || '#000000';
    const borderVal = `${width} ${bStyle} ${color}`;

    let updated: Partial<CanvasBlockStyle> = {
      borderPreset: preset as any,
      borderTop: undefined,
      borderRight: undefined,
      borderBottom: undefined,
      borderLeft: undefined,
      border: undefined,
    };

    switch (preset) {
      case 'full':
        updated.border = borderVal;
        break;
      case 'top':
        updated.borderTop = borderVal;
        break;
      case 'bottom':
        updated.borderBottom = borderVal;
        break;
      case 'left':
        updated.borderLeft = borderVal;
        break;
      case 'right':
        updated.borderRight = borderVal;
        break;
      case 'none':
        break;
    }
    handleUpdateStyles(updated);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string = 'imageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        handleUpdateContent({ ...content, [key]: base64Url });
      };
      reader.readAsDataURL(file);
    }
  };

  const hasTypography =
    block.type === 'TEXT' ||
    block.type === 'HEADING' ||
    block.type === 'PARAGRAPH' ||
    block.type === 'BUTTON' ||
    block.type === 'ICON_BOX' ||
    block.type === 'STAT_COUNTER' ||
    block.type === 'DOCUMENT_PDF' ||
    block.type === 'TABLE' ||
    block.type === 'COUNTDOWN_TIMER';

  const currentOpacity =
    styles.opacity !== undefined ? Math.round(Number(styles.opacity) * 100) : 100;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 select-none text-xs text-slate-800 dark:text-slate-200">
      {/* 1. Header Toolbar */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 truncate max-w-[110px]">
            {block.type}
          </span>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">
            Properties
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Move Up"
            onClick={() => onMoveUp(block.id)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Move Down"
            onClick={() => onMoveDown(block.id)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Duplicate Block"
            onClick={() => onDuplicate(block.id)}
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete Block"
            onClick={() => onDelete(block.id)}
            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Close Inspector"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION A: BLOCK-SPECIFIC CONTENT & DATA EDITOR
           ═══════════════════════════════════════════════════════════════ */}

        {/* 1. TIMELINE ROADMAP */}
        {block.type === 'TIMELINE_ROADMAP' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline Milestones ({content.items?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const items = Array.isArray(content.items) ? [...content.items] : [];
                  items.push({
                    id: `time-${Date.now()}`,
                    year: `${new Date().getFullYear()}`,
                    title: 'New Milestone Title',
                    description: 'Description of milestone accomplishment.',
                    badge: 'Milestone',
                  });
                  handleUpdateContent({ ...content, items });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.items || []).map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const items = content.items.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, items });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Year</label>
                      <input
                        type="text"
                        value={item.year || ''}
                        onChange={(e) => {
                          const items = [...content.items];
                          items[idx] = { ...items[idx], year: e.target.value };
                          handleUpdateContent({ ...content, items });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge</label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => {
                          const items = [...content.items];
                          items[idx] = { ...items[idx], badge: e.target.value };
                          handleUpdateContent({ ...content, items });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Milestone Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const items = [...content.items];
                        items[idx] = { ...items[idx], title: e.target.value };
                        handleUpdateContent({ ...content, items });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => {
                        const items = [...content.items];
                        items[idx] = { ...items[idx], description: e.target.value };
                        handleUpdateContent({ ...content, items });
                      }}
                      className="w-full p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. TABS SWITCHER */}
        {block.type === 'TABS_SWITCHER' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Tabs Management ({content.tabs?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const tabs = Array.isArray(content.tabs) ? [...content.tabs] : [];
                  tabs.push({
                    id: `tab-${Date.now()}`,
                    title: `New Tab ${tabs.length + 1}`,
                    badge: 'Topic',
                    content: 'Detailed description for this tab.',
                  });
                  handleUpdateContent({ ...content, tabs, activeTabIndex: tabs.length - 1 });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tab</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500">Active Tab Index</label>
              <select
                value={content.activeTabIndex ?? 0}
                onChange={(e) => handleUpdateContent({ ...content, activeTabIndex: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              >
                {(content.tabs || []).map((t: any, idx: number) => (
                  <option key={idx} value={idx}>
                    Tab #{idx + 1}: {t.title || `Tab ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              {(content.tabs || []).map((tab: any, idx: number) => (
                <div key={tab.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Tab #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = content.tabs.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, tabs, activeTabIndex: 0 });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tab Title</label>
                      <input
                        type="text"
                        value={tab.title || ''}
                        onChange={(e) => {
                          const tabs = [...content.tabs];
                          tabs[idx] = { ...tabs[idx], title: e.target.value };
                          handleUpdateContent({ ...content, tabs });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge</label>
                      <input
                        type="text"
                        value={tab.badge || ''}
                        onChange={(e) => {
                          const tabs = [...content.tabs];
                          tabs[idx] = { ...tabs[idx], badge: e.target.value };
                          handleUpdateContent({ ...content, tabs });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Panel Content</label>
                    <textarea
                      rows={2}
                      value={tab.content || ''}
                      onChange={(e) => {
                        const tabs = [...content.tabs];
                        tabs[idx] = { ...tabs[idx], content: e.target.value };
                        handleUpdateContent({ ...content, tabs });
                      }}
                      className="w-full p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 mb-2"
                    />
                  </div>
                  <div>
                    <PageUrlPicker
                      label="Tab Link URL (Optional)"
                      value={tab.buttonUrl || tab.url || ''}
                      onChange={(url) => {
                        const tabs = [...content.tabs];
                        tabs[idx] = { ...tabs[idx], buttonUrl: url, url };
                        handleUpdateContent({ ...content, tabs });
                      }}
                      availablePages={availablePages}
                      size="sm"
                      placeholder="Select page or type slug..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. FACULTY GRID */}
        {block.type === 'FACULTY_GRID' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Faculty Members ({content.members?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const members = Array.isArray(content.members) ? [...content.members] : [];
                  members.push({
                    id: `fac-${Date.now()}`,
                    name: 'Dr. New Faculty, Ph.D.',
                    designation: 'Assistant Professor',
                    qualification: 'Ph.D. in Engineering',
                    specialization: 'Emerging Technologies',
                    email: 'faculty@college.edu',
                    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  });
                  handleUpdateContent({ ...content, members });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.members || []).map((m: any, idx: number) => (
                <div key={m.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Professor #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const members = content.members.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, members });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Full Name</label>
                    <input
                      type="text"
                      value={m.name || ''}
                      onChange={(e) => {
                        const members = [...content.members];
                        members[idx] = { ...members[idx], name: e.target.value };
                        handleUpdateContent({ ...content, members });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Designation</label>
                      <input
                        type="text"
                        value={m.designation || ''}
                        onChange={(e) => {
                          const members = [...content.members];
                          members[idx] = { ...members[idx], designation: e.target.value };
                          handleUpdateContent({ ...content, members });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Qualification</label>
                      <input
                        type="text"
                        value={m.qualification || ''}
                        onChange={(e) => {
                          const members = [...content.members];
                          members[idx] = { ...members[idx], qualification: e.target.value };
                          handleUpdateContent({ ...content, members });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Specialization / Domain</label>
                    <input
                      type="text"
                      value={m.specialization || ''}
                      onChange={(e) => {
                        const members = [...content.members];
                        members[idx] = { ...members[idx], specialization: e.target.value };
                        handleUpdateContent({ ...content, members });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Email Address</label>
                    <input
                      type="email"
                      value={m.email || ''}
                      onChange={(e) => {
                        const members = [...content.members];
                        members[idx] = { ...members[idx], email: e.target.value };
                        handleUpdateContent({ ...content, members });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. NOTICES LIST */}
        {block.type === 'NOTICES_LIST' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>Notices & Circulars ({content.notices?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const notices = Array.isArray(content.notices) ? [...content.notices] : [];
                  notices.push({
                    id: `not-${Date.now()}`,
                    date: 'OCT 01, 2026',
                    title: 'New Official Announcement',
                    category: 'GENERAL',
                    fileUrl: '#',
                    isNew: true,
                  });
                  handleUpdateContent({ ...content, notices });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Notice</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.notices || []).map((n: any, idx: number) => (
                <div key={n.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Notice #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const notices = content.notices.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, notices });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Date</label>
                      <input
                        type="text"
                        value={n.date || ''}
                        onChange={(e) => {
                          const notices = [...content.notices];
                          notices[idx] = { ...notices[idx], date: e.target.value };
                          handleUpdateContent({ ...content, notices });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Category</label>
                      <input
                        type="text"
                        value={n.category || ''}
                        onChange={(e) => {
                          const notices = [...content.notices];
                          notices[idx] = { ...notices[idx], category: e.target.value };
                          handleUpdateContent({ ...content, notices });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Notice Headline</label>
                    <input
                      type="text"
                      value={n.title || ''}
                      onChange={(e) => {
                        const notices = [...content.notices];
                        notices[idx] = { ...notices[idx], title: e.target.value };
                        handleUpdateContent({ ...content, notices });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 mb-1.5"
                    />
                  </div>
                  <div>
                    <PageUrlPicker
                      label="Notice Link / Document URL"
                      value={n.fileUrl || n.url || ''}
                      onChange={(url) => {
                        const notices = [...content.notices];
                        notices[idx] = { ...notices[idx], fileUrl: url, url };
                        handleUpdateContent({ ...content, notices });
                      }}
                      availablePages={availablePages}
                      size="sm"
                      placeholder="Select page, anchor, or enter file URL..."
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!n.isNew}
                        onChange={(e) => {
                          const notices = [...content.notices];
                          notices[idx] = { ...notices[idx], isNew: e.target.checked };
                          handleUpdateContent({ ...content, notices });
                        }}
                        className="rounded text-blue-600"
                      />
                      <span>Mark as "NEW" Notice</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LOGO MATRIX */}
        {block.type === 'LOGO_MATRIX' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" />
                <span>Partners & Recruiters ({content.partners?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const partners = Array.isArray(content.partners) ? [...content.partners] : [];
                  partners.push({
                    id: `p-${Date.now()}`,
                    name: `Partner ${partners.length + 1}`,
                    category: 'Recruiter',
                  });
                  handleUpdateContent({ ...content, partners });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Partner</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.partners || []).map((p: any, idx: number) => (
                <div key={p.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Partner #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const partners = content.partners.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, partners });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Company Name</label>
                      <input
                        type="text"
                        value={p.name || ''}
                        onChange={(e) => {
                          const partners = [...content.partners];
                          partners[idx] = { ...partners[idx], name: e.target.value };
                          handleUpdateContent({ ...content, partners });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Category</label>
                      <input
                        type="text"
                        value={p.category || ''}
                        onChange={(e) => {
                          const partners = [...content.partners];
                          partners[idx] = { ...partners[idx], category: e.target.value };
                          handleUpdateContent({ ...content, partners });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. COURSE CARDS */}
        {block.type === 'COURSE_CARDS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Degree Programs ({content.courses?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const courses = Array.isArray(content.courses) ? [...content.courses] : [];
                  courses.push({
                    id: `c-${Date.now()}`,
                    title: 'New Degree Program',
                    degree: 'Undergraduate',
                    duration: '4 Years (8 Semesters)',
                    intake: '60 Seats',
                    description: 'Specialized curriculum aligned with industry standards.',
                    ctaText: 'Curriculum & Details',
                    ctaUrl: '#',
                  });
                  handleUpdateContent({ ...content, courses });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Program</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.courses || []).map((c: any, idx: number) => (
                <div key={c.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Program #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const courses = content.courses.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, courses });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Program Title</label>
                    <input
                      type="text"
                      value={c.title || ''}
                      onChange={(e) => {
                        const courses = [...content.courses];
                        courses[idx] = { ...courses[idx], title: e.target.value };
                        handleUpdateContent({ ...content, courses });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Degree</label>
                      <input
                        type="text"
                        value={c.degree || ''}
                        onChange={(e) => {
                          const courses = [...content.courses];
                          courses[idx] = { ...courses[idx], degree: e.target.value };
                          handleUpdateContent({ ...content, courses });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={c.duration || ''}
                        onChange={(e) => {
                          const courses = [...content.courses];
                          courses[idx] = { ...courses[idx], duration: e.target.value };
                          handleUpdateContent({ ...content, courses });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Seats</label>
                      <input
                        type="text"
                        value={c.intake || ''}
                        onChange={(e) => {
                          const courses = [...content.courses];
                          courses[idx] = { ...courses[idx], intake: e.target.value };
                          handleUpdateContent({ ...content, courses });
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={c.description || ''}
                      onChange={(e) => {
                        const courses = [...content.courses];
                        courses[idx] = { ...courses[idx], description: e.target.value };
                        handleUpdateContent({ ...content, courses });
                      }}
                      className="w-full p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 mb-2"
                    />
                  </div>
                  <div>
                    <PageUrlPicker
                      label="Program Curriculum Link / Slug"
                      value={c.ctaUrl || c.url || ''}
                      onChange={(url) => {
                        const courses = [...content.courses];
                        courses[idx] = { ...courses[idx], ctaUrl: url, url };
                        handleUpdateContent({ ...content, courses });
                      }}
                      availablePages={availablePages}
                      size="sm"
                      placeholder="Select page (e.g. /courses) or enter slug..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. MAP EMBED */}
        {block.type === 'MAP_EMBED' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Campus Map & Details</span>
            </h5>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Campus Name</label>
              <input
                type="text"
                value={content.campusName || ''}
                onChange={(e) => handleUpdateContent({ ...content, campusName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Physical Address</label>
              <textarea
                rows={2}
                value={content.address || ''}
                onChange={(e) => handleUpdateContent({ ...content, address: e.target.value })}
                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Phone Number</label>
                <input
                  type="text"
                  value={content.phone || ''}
                  onChange={(e) => handleUpdateContent({ ...content, phone: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Visitor Hours</label>
                <input
                  type="text"
                  value={content.officeHours || ''}
                  onChange={(e) => handleUpdateContent({ ...content, officeHours: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Button Text</label>
              <input
                type="text"
                value={content.ctaText || ''}
                onChange={(e) => handleUpdateContent({ ...content, ctaText: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
          </div>
        )}

        {/* 8. VIDEO POPUP */}
        {block.type === 'VIDEO_POPUP' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              <span>Video Showcase</span>
            </h5>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Video Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleUpdateContent({ ...content, title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Video URL (YouTube/MP4)</label>
              <input
                type="text"
                value={content.videoUrl || ''}
                onChange={(e) => handleUpdateContent({ ...content, videoUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge</label>
                <input
                  type="text"
                  value={content.badge || ''}
                  onChange={(e) => handleUpdateContent({ ...content, badge: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Duration</label>
                <input
                  type="text"
                  value={content.duration || ''}
                  onChange={(e) => handleUpdateContent({ ...content, duration: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Poster Image URL</label>
              <input
                type="text"
                value={content.coverImageUrl || ''}
                onChange={(e) => handleUpdateContent({ ...content, coverImageUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 mb-1"
              />
              <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-blue-400 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 text-xs font-bold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Poster File...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e, 'coverImageUrl')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* 9. COUNTDOWN TIMER */}
        {block.type === 'COUNTDOWN_TIMER' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Countdown Timer</span>
            </h5>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Event Title</label>
              <input
                type="text"
                value={content.eventTitle || ''}
                onChange={(e) => handleUpdateContent({ ...content, eventTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Event Subtitle</label>
              <input
                type="text"
                value={content.eventSubtitle || ''}
                onChange={(e) => handleUpdateContent({ ...content, eventSubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Target Date & Time</label>
              <input
                type="text"
                value={content.targetDate || '2026-10-31T23:59:59'}
                onChange={(e) => handleUpdateContent({ ...content, targetDate: e.target.value })}
                placeholder="YYYY-MM-DDTHH:mm:ss"
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Button Text</label>
                <input
                  type="text"
                  value={content.ctaButtonText || ''}
                  onChange={(e) => handleUpdateContent({ ...content, ctaButtonText: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Button Link</label>
                <input
                  type="text"
                  value={content.ctaButtonUrl || ''}
                  onChange={(e) => handleUpdateContent({ ...content, ctaButtonUrl: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
            </div>
          </div>
        )}

        {/* 10. ACCORDION / FAQ */}
        {block.type === 'ACCORDION' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Accordion Items ({content.items?.length || 0})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const items = Array.isArray(content.items) ? [...content.items] : [];
                  items.push({
                    id: `acc-${Date.now()}`,
                    title: 'New FAQ Question',
                    content: 'Detailed explanation and breakdown for this topic.',
                    badge: 'Info',
                  });
                  handleUpdateContent({ ...content, items });
                }}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.items || []).map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const items = content.items.filter((_: any, i: number) => i !== idx);
                        handleUpdateContent({ ...content, items });
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Question Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const items = [...content.items];
                        items[idx] = { ...items[idx], title: e.target.value };
                        handleUpdateContent({ ...content, items });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Answer Content</label>
                    <textarea
                      rows={2}
                      value={item.content || ''}
                      onChange={(e) => {
                        const items = [...content.items];
                        items[idx] = { ...items[idx], content: e.target.value };
                        handleUpdateContent({ ...content, items });
                      }}
                      className="w-full p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. TEXT / HEADING / PARAGRAPH */}
        {(block.type === 'TEXT' || block.type === 'HEADING' || block.type === 'PARAGRAPH') && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Text Content
            </h5>
            {block.type === 'HEADING' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge Text</label>
                  <input
                    type="text"
                    value={content.badge || ''}
                    onChange={(e) => handleUpdateContent({ ...content, badge: e.target.value })}
                    placeholder="Optional badge..."
                    className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Heading Tag</label>
                  <select
                    value={content.tag || 'h2'}
                    onChange={(e) => handleUpdateContent({ ...content, tag: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                  >
                    <option value="h1">H1 (Title)</option>
                    <option value="h2">H2 (Section)</option>
                    <option value="h3">H3 (Subheader)</option>
                    <option value="h4">H4 (Card Title)</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Narrative Text</label>
              <textarea
                rows={4}
                value={content.text || ''}
                onChange={(e) => handleUpdateContent({ ...content, text: e.target.value })}
                placeholder="Enter text..."
                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* 12. IMAGE BLOCK */}
        {block.type === 'IMAGE' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Settings</span>
            </h5>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Image URL</label>
              <input
                type="text"
                value={content.imageUrl || ''}
                onChange={(e) => handleUpdateContent({ ...content, imageUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 mb-1"
              />
              <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-blue-400 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 text-xs font-bold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local Image...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e, 'imageUrl')}
                  className="hidden"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Aspect Ratio</label>
                <select
                  value={styles.aspectRatio || '16:9'}
                  onChange={(e) => handleUpdateStyles({ aspectRatio: e.target.value as any })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="4:3">4:3 (Photo)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="circle">Circle (Avatar)</option>
                  <option value="auto">Auto / Natural</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Alt Text</label>
                <input
                  type="text"
                  value={content.alt || ''}
                  onChange={(e) => handleUpdateContent({ ...content, alt: e.target.value })}
                  placeholder="Image description..."
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Caption</label>
              <input
                type="text"
                value={content.caption || ''}
                onChange={(e) => handleUpdateContent({ ...content, caption: e.target.value })}
                placeholder="Optional caption..."
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
          </div>
        )}

        {/* 13. BUTTON BLOCK */}
        {block.type === 'BUTTON' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Button Settings</span>
            </h5>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Button Label</label>
              <input
                type="text"
                value={content.label || ''}
                onChange={(e) => handleUpdateContent({ ...content, label: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <PageUrlPicker
                label="Target URL (Page Slug / Link)"
                value={content.url || ''}
                onChange={(url) => handleUpdateContent({ ...content, url })}
                availablePages={availablePages}
                size="sm"
                placeholder="Select page or type slug (/admissions, /courses...)"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={!!content.openInNewTab}
                onChange={(e) => handleUpdateContent({ ...content, openInNewTab: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Open in New Tab</span>
            </label>
          </div>
        )}

        {/* 14. DOCUMENT PDF BLOCK */}
        {block.type === 'DOCUMENT_PDF' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Document / PDF Card</span>
            </h5>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Document Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleUpdateContent({ ...content, title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description</label>
              <textarea
                rows={2}
                value={content.description || ''}
                onChange={(e) => handleUpdateContent({ ...content, description: e.target.value })}
                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Type</label>
                <input
                  type="text"
                  value={content.fileType || 'PDF'}
                  onChange={(e) => handleUpdateContent({ ...content, fileType: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Size</label>
                <input
                  type="text"
                  value={content.fileSize || '2.4 MB'}
                  onChange={(e) => handleUpdateContent({ ...content, fileSize: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Date</label>
                <input
                  type="text"
                  value={content.publishDate || ''}
                  onChange={(e) => handleUpdateContent({ ...content, publishDate: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
            </div>
            <div>
              <PageUrlPicker
                label="File URL / Download Link"
                value={content.fileUrl || ''}
                onChange={(fileUrl) => handleUpdateContent({ ...content, fileUrl })}
                availablePages={availablePages}
                size="sm"
                placeholder="Upload/paste file link or select internal page"
              />
            </div>
          </div>
        )}

        {/* 15. ICON BOX */}
        {block.type === 'ICON_BOX' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Feature Card Settings</span>
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge</label>
                <input
                  type="text"
                  value={content.badge || ''}
                  onChange={(e) => handleUpdateContent({ ...content, badge: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Icon Name</label>
                <input
                  type="text"
                  value={content.iconName || 'Award'}
                  onChange={(e) => handleUpdateContent({ ...content, iconName: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Feature Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleUpdateContent({ ...content, title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description</label>
              <textarea
                rows={3}
                value={content.description || ''}
                onChange={(e) => handleUpdateContent({ ...content, description: e.target.value })}
                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
          </div>
        )}

        {/* 16. STAT COUNTER */}
        {block.type === 'STAT_COUNTER' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Metric Counter Settings</span>
            </h5>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Prefix</label>
                <input
                  type="text"
                  value={content.prefix || ''}
                  onChange={(e) => handleUpdateContent({ ...content, prefix: e.target.value })}
                  placeholder="#"
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Value</label>
                <input
                  type="text"
                  value={content.value || '98'}
                  onChange={(e) => handleUpdateContent({ ...content, value: e.target.value })}
                  className="w-full px-2 py-1 text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Suffix</label>
                <input
                  type="text"
                  value={content.suffix || '%'}
                  onChange={(e) => handleUpdateContent({ ...content, suffix: e.target.value })}
                  placeholder="%"
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Metric Label</label>
              <input
                type="text"
                value={content.label || ''}
                onChange={(e) => handleUpdateContent({ ...content, label: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description</label>
              <input
                type="text"
                value={content.description || ''}
                onChange={(e) => handleUpdateContent({ ...content, description: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              />
            </div>
          </div>
        )}

        {/* 17. TABLE PROPERTIES */}
        {block.type === 'TABLE' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" />
              <span>Table Matrix Settings</span>
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={block.tableData?.rows || 3}
                  onChange={(e) => {
                    const newRows = Math.max(1, parseInt(e.target.value) || 1);
                    const curData = block.tableData?.data || [];
                    const curCols = block.tableData?.cols || 3;
                    const nextData = [...curData];
                    while (nextData.length < newRows) {
                      nextData.push(new Array(curCols).fill('Cell'));
                    }
                    if (nextData.length > newRows) {
                      nextData.length = newRows;
                    }
                    block.tableData = { rows: newRows, cols: curCols, data: nextData };
                    handleUpdateStyles({ ...styles });
                  }}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Cols</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={block.tableData?.cols || 3}
                  onChange={(e) => {
                    const newCols = Math.max(1, parseInt(e.target.value) || 1);
                    const curRows = block.tableData?.rows || 3;
                    const curData = block.tableData?.data || [];
                    const nextData = curData.map((row) => {
                      const r = [...row];
                      while (r.length < newCols) r.push('Cell');
                      if (r.length > newCols) r.length = newCols;
                      return r;
                    });
                    block.tableData = { rows: curRows, cols: newCols, data: nextData };
                    handleUpdateStyles({ ...styles });
                  }}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Cell Padding</label>
                <input
                  type="text"
                  value={styles.cellPadding || '8px'}
                  onChange={(e) => handleUpdateStyles({ cellPadding: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Border Width</label>
                <select
                  value={styles.cellBorderWidth || '1px'}
                  onChange={(e) => handleUpdateStyles({ cellBorderWidth: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                >
                  <option value="0px">None</option>
                  <option value="1px">Thin (1px)</option>
                  <option value="2px">Medium (2px)</option>
                  <option value="3px">Thick (3px)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 18. DIVIDER */}
        {block.type === 'DIVIDER' && (
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Line Separator Styling
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Line Width</label>
                <input
                  type="text"
                  value={styles.width || '100%'}
                  onChange={(e) => handleUpdateStyles({ width: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Thickness</label>
                <select
                  value={styles.height || styles.lineThickness || '2px'}
                  onChange={(e) => handleUpdateStyles({ height: e.target.value, lineThickness: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                >
                  <option value="1px">1px (Thin)</option>
                  <option value="2px">2px (Normal)</option>
                  <option value="3px">3px (Medium)</option>
                  <option value="4px">4px (Thick)</option>
                  <option value="6px">6px (Heavy)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Line Style</label>
                <select
                  value={styles.borderStyle || styles.lineStyle || 'solid'}
                  onChange={(e) => handleUpdateStyles({ borderStyle: e.target.value, lineStyle: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                >
                  <option value="solid">Solid ━━━</option>
                  <option value="dashed">Dashed ╌╌╌</option>
                  <option value="dotted">Dotted ┄┄┄</option>
                  <option value="double">Double ═══</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">End Decos</label>
                <select
                  value={styles.lineEndStyle || 'none'}
                  onChange={(e) => handleUpdateStyles({ lineEndStyle: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                >
                  <option value="none">None</option>
                  <option value="circle-both">Circles ●──●</option>
                  <option value="arrow-right">Arrow ──▶</option>
                  <option value="arrow-both">Arrows ◀──▶</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Line Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#2563eb'}
                  onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value, borderColor: e.target.value })}
                  className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={styles.backgroundColor || '#2563eb'}
                  onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value, borderColor: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION B: TYPOGRAPHY & TEXT STYLING (For All Text Blocks)
           ═══════════════════════════════════════════════════════════════ */}
        {hasTypography && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Typography & Fonts
            </h5>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Font Family</label>
                <select
                  value={styles.fontFamily || 'Calibri'}
                  onChange={(e) => handleUpdateStyles({ fontFamily: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                >
                  <option value="Calibri">Calibri</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                  <option value="'Inter', sans-serif">Inter</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Font Size</label>
                <select
                  value={styles.fontSize || '16px'}
                  onChange={(e) => handleUpdateStyles({ fontSize: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 font-mono"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px (Normal)</option>
                  <option value="18px">18px (Lead)</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px (H3)</option>
                  <option value="32px">32px (H2)</option>
                  <option value="40px">40px (H1)</option>
                  <option value="48px">48px (Hero)</option>
                  <option value="56px">56px</option>
                </select>
              </div>
            </div>

            {/* Style Toggles: B, I, U, S */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Text Style</label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  title="Bold"
                  onClick={() => toggleStyleProp('fontWeight', 'bold', 'normal')}
                  className={`py-1.5 rounded-lg border flex items-center justify-center font-bold transition cursor-pointer ${
                    styles.fontWeight === 'bold' || styles.fontWeight === '700'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => toggleStyleProp('fontStyle', 'italic', 'normal')}
                  className={`py-1.5 rounded-lg border flex items-center justify-center italic transition cursor-pointer ${
                    styles.fontStyle === 'italic'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Underline"
                  onClick={() => toggleStyleProp('textDecoration', 'underline', 'none')}
                  className={`py-1.5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                    styles.textDecoration === 'underline'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Strikethrough"
                  onClick={() => toggleStyleProp('textDecoration', 'line-through', 'none')}
                  className={`py-1.5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                    styles.textDecoration === 'line-through'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <StrikethroughIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Alignment Toggles */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Alignment</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { align: 'left', icon: AlignLeft, title: 'Align Left' },
                  { align: 'center', icon: AlignCenter, title: 'Align Center' },
                  { align: 'right', icon: AlignRight, title: 'Align Right' },
                  { align: 'justify', icon: AlignJustify, title: 'Justify' },
                ].map(({ align, icon: IconComp, title }) => (
                  <button
                    key={align}
                    type="button"
                    title={title}
                    onClick={() => handleUpdateStyles({ textAlign: align as any, alignment: align as any })}
                    className={`py-1.5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                      (styles.textAlign || styles.alignment || 'left') === align
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.color || '#0f172a'}
                  onChange={(e) => handleUpdateStyles({ color: e.target.value })}
                  className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={styles.color || '#0f172a'}
                  onChange={(e) => handleUpdateStyles({ color: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION C: APPEARANCE, COLORS & BORDERS
           ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h5 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Box & Appearance
          </h5>

          {/* Background Color */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Background Fill</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : '#ffffff'}
                onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={styles.backgroundColor || 'transparent'}
                onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
                placeholder="transparent or #hex"
                className="flex-1 px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
              />
              <button
                type="button"
                onClick={() => handleUpdateStyles({ backgroundColor: 'transparent' })}
                className="px-2 py-1 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
                title="Clear Fill"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Border Preset */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Border Preset</label>
            <select
              value={styles.borderPreset || 'none'}
              onChange={(e) => handleBorderPresetChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
            >
              <option value="none">No Border</option>
              <option value="full">Full Border (Box)</option>
              <option value="bottom">Bottom Border Only</option>
              <option value="top">Top Border Only</option>
              <option value="left">Left Accent Border</option>
              <option value="right">Right Border Only</option>
            </select>
          </div>

          {/* Corner Radius & Shadow */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Corner Radius</label>
              <select
                value={styles.borderRadius || 'none'}
                onChange={(e) => handleUpdateStyles({ borderRadius: e.target.value as any })}
                className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              >
                <option value="none">Square (0px)</option>
                <option value="sm">Small (8px)</option>
                <option value="md">Medium (12px)</option>
                <option value="lg">Large (16px)</option>
                <option value="xl">XL (24px)</option>
                <option value="full">Circle / Pill</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Shadow</label>
              <select
                value={styles.shadow || 'none'}
                onChange={(e) => handleUpdateStyles({ shadow: e.target.value as any })}
                className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850"
              >
                <option value="none">None</option>
                <option value="sm">Subtle (XS)</option>
                <option value="md">Medium (MD)</option>
                <option value="lg">Elevated (LG)</option>
                <option value="xl">Glow (XL)</option>
              </select>
            </div>
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-bold text-slate-500">Opacity</label>
              <span className="text-[10px] font-mono text-slate-500 font-bold">{currentOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={currentOpacity}
              onChange={(e) => {
                const val = Number(e.target.value) / 100;
                handleUpdateStyles({ opacity: String(val) });
              }}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION D: DIMENSIONS & SPACING
           ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h5 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Dimensions & Spacing
          </h5>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Width</label>
              <input
                type="text"
                value={styles.width || 'auto'}
                onChange={(e) => handleUpdateStyles({ width: e.target.value })}
                placeholder="auto, 100%, 300px"
                className="w-full px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Height</label>
              <input
                type="text"
                value={styles.height || 'auto'}
                onChange={(e) => handleUpdateStyles({ height: e.target.value })}
                placeholder="auto, 200px"
                className="w-full px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Padding Y</label>
              <select
                value={styles.paddingY || 'none'}
                onChange={(e) => handleUpdateStyles({ paddingY: e.target.value as any })}
                className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Padding X</label>
              <select
                value={styles.paddingX || 'none'}
                onChange={(e) => handleUpdateStyles({ paddingX: e.target.value as any })}
                className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Margin Y</label>
              <select
                value={styles.marginY || 'sm'}
                onChange={(e) => handleUpdateStyles({ marginY: e.target.value as any })}
                className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">XL</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
