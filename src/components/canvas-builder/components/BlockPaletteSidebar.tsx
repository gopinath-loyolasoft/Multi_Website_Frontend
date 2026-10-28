import React, { useState } from 'react';
import {
  Type,
  Minus,
  Table as TableIcon,
  Image as ImageIcon,
  Heading,
  AlignLeft,
  FileText,
  ExternalLink,
  Sparkles,
  BarChart3,
  Columns2,
  Columns3,
  Search,
  Plus,
  GripVertical,
  PanelLeftClose,
  HelpCircle,
  Layers,
  History,
  Users,
  Bell,
  GraduationCap,
  Grid,
  MapPin,
  Video,
  Clock,
} from 'lucide-react';
import { CanvasBlock, PaletteItemMeta } from '../../../types/canvasBuilder';
import { PALETTE_ITEMS } from '../constants/defaultBlocks';

interface BlockPaletteSidebarProps {
  onAddBlock: (block: CanvasBlock) => void;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Type,
  Minus,
  Table: TableIcon,
  Image: ImageIcon,
  Heading,
  AlignLeft,
  FileText,
  ExternalLink,
  Sparkles,
  BarChart3,
  Columns2,
  Columns3,
  HelpCircle,
  Layers,
  History,
  Users,
  Bell,
  GraduationCap,
  Grid,
  MapPin,
  Video,
  Clock,
};

export const BlockPaletteSidebar: React.FC<BlockPaletteSidebarProps> = ({ onAddBlock, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'TOOLS' | 'ALL'>('TOOLS');

  // 4 Core primary tools matching the Report Builder template exactly
  const primaryTools = PALETTE_ITEMS.filter((item) => item.category === 'TOOLS');

  const filteredItems = PALETTE_ITEMS.filter((item) => {
    if (activeTab === 'TOOLS' && item.category !== 'TOOLS') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  const createBlockFromMeta = (meta: PaletteItemMeta): CanvasBlock => {
    const id = `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    let tableData = undefined;
    if (meta.type === 'TABLE') {
      tableData = {
        rows: 3,
        cols: 3,
        data: [
          ['Cell', 'Cell', 'Cell'],
          ['Cell', 'Cell', 'Cell'],
          ['Cell', 'Cell', 'Cell'],
        ],
      };
    }

    let columns = undefined;
    if (meta.type === 'CONTAINER_2_COL') {
      columns = [
        { id: `col-${id}-1`, blocks: [] },
        { id: `col-${id}-2`, blocks: [] },
      ];
    } else if (meta.type === 'CONTAINER_3_COL') {
      columns = [
        { id: `col-${id}-1`, blocks: [] },
        { id: `col-${id}-2`, blocks: [] },
        { id: `col-${id}-3`, blocks: [] },
      ];
    }

    return {
      id,
      type: meta.type,
      content: JSON.parse(JSON.stringify(meta.defaultContent)),
      styles: JSON.parse(JSON.stringify(meta.defaultStyles)),
      columns,
      tableData,
    };
  };

  const handleDragStart = (e: React.DragEvent, meta: PaletteItemMeta) => {
    const block = createBlockFromMeta(meta);
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none">
      {/* 1. Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>Tools</span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                ({primaryTools.length})
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Drag tools onto canvas or click to insert
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Collapse Tools Panel"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View switch: Core Tools vs All Components */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('TOOLS')}
            className={`flex-1 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'TOOLS'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Core Tools (4)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            All Blocks
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools & blocks..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 2. Tools & Blocks List (Clean Buttons matching screenshots) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredItems.map((meta) => {
          const IconComponent = ICON_MAP[meta.icon] || Sparkles;

          return (
            <div
              key={meta.type + meta.title}
              draggable
              onDragStart={(e) => handleDragStart(e, meta)}
              onClick={() => onAddBlock(createBlockFromMeta(meta))}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-850 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs transition group cursor-grab active:cursor-grabbing flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                    {meta.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 truncate">
                    {meta.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-blue-600">
                <GripVertical className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                <button
                  type="button"
                  title="Click to add"
                  className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            No matching tools found
          </div>
        )}
      </div>
    </div>
  );
};
