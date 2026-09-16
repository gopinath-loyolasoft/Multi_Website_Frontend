import React, { useState, useMemo } from 'react';
import { Code2, LayoutList, Plus, Trash2, ChevronUp, ChevronDown, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { FileUploadInput } from '../../UI_Componentes/ui/Form/FileUploadInput';

export interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch' | 'image';
  help?: string;
}

export interface ObjectListField {
  key: string;
  label: string;
  type: 'object-list';
  itemLabel: string;
  fields: ContentField[];
}

export interface StringListField {
  key: string;
  label: string;
  type: 'string-list';
  help?: string;
}

export type SectionField = ContentField | ObjectListField | StringListField;

export const getFieldsForType = (sectionType: string): SectionField[] | null => {
  const norm = sectionType.toUpperCase().trim();
  switch (norm) {
    case 'HERO':
      return [
        { key: 'badge', label: 'Top Badge', type: 'text' },
        { key: 'heading', label: 'Main Heading', type: 'text' },
        { key: 'subheading', label: 'Subheading', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'ctaText', label: 'Primary Button Text', type: 'text' },
        { key: 'ctaLink', label: 'Primary Button Link', type: 'text' },
        { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text' },
        { key: 'secondaryCtaLink', label: 'Secondary Button Link', type: 'text' },
        { key: 'backgroundImage', label: 'Background Image', type: 'image' },
        { key: 'showRightCard', label: 'Show Right Info Card', type: 'switch' },
        { key: 'cardBadge', label: 'Card Badge', type: 'text' },
        { key: 'cardTitle', label: 'Card Title', type: 'text' },
        { key: 'cardSubtitle', label: 'Card Subtitle', type: 'text' },
        { key: 'cardPrimaryButtonText', label: 'Card Primary Button Text', type: 'text' },
        { key: 'cardPrimaryButtonUrl', label: 'Card Primary Button URL', type: 'text' },
        { key: 'cardSecondaryButtonText', label: 'Card Secondary Button Text', type: 'text' },
        { key: 'cardSecondaryButtonUrl', label: 'Card Secondary Button URL', type: 'text' },
        {
          key: 'cardItems',
          label: 'Card Bullet Items',
          type: 'object-list',
          itemLabel: 'bullet item',
          fields: [
            { key: 'title', label: 'Item Title', type: 'text' },
            { key: 'desc', label: 'Item Description', type: 'text' },
          ],
        },
        { key: 'pillars', label: 'Quick Pillars (badges below heading)', type: 'string-list' },
      ];
    case 'HERO_SLIDER':
    case 'BANNERS':
      return [
        {
          key: 'slides',
          label: 'Hero Slides',
          type: 'object-list',
          itemLabel: 'slide',
          fields: [
            { key: 'imageUrl', label: 'Slide Image', type: 'image' },
            { key: 'headline', label: 'Headline', type: 'text' },
            { key: 'caption', label: 'Caption', type: 'text' },
            { key: 'badge', label: 'Badge', type: 'text' },
            { key: 'buttonText', label: 'Button Text', type: 'text' },
            { key: 'buttonUrl', label: 'Button URL', type: 'text' },
          ],
        },
        { key: 'autoplaySpeed', label: 'Autoplay Speed (ms)', type: 'number', help: 'Defaults to 6000' },
        { key: 'showArrows', label: 'Show Arrow Controls', type: 'switch' },
        { key: 'showDots', label: 'Show Dot Indicators', type: 'switch' },
      ];
    case 'QUOTE':
      return [
        { key: 'quoteText', label: 'Inspiring Quote Message', type: 'textarea' },
        { key: 'authorName', label: 'Leader / Author Name', type: 'text' },
        { key: 'designation', label: 'Designation / Title (e.g. Principal & Dean)', type: 'text' },
        { key: 'authorImageUrl', label: 'Leader Portrait Photo', type: 'image' },
        { key: 'subText', label: 'Department / Governance Sub-line', type: 'text' },
      ];
    case 'TEXT':
      return [
        { key: 'leadText', label: 'Lead Highlight Quote', type: 'textarea' },
        { key: 'bodyHtml', label: 'Body Content (Paragraphs)', type: 'textarea', help: 'Supports text & HTML markup' },
      ];
    case 'IMAGE':
      return [
        { key: 'imageUrl', label: 'Image', type: 'image' },
        { key: 'caption', label: 'Caption', type: 'text' },
        { key: 'altText', label: 'Alt Text', type: 'text' },
        { key: 'fullWidth', label: 'Full Width', type: 'switch' },
      ];
    case 'IMAGE_TEXT':
      return [
        { key: 'badge', label: 'Badge', type: 'text' },
        { key: 'heading', label: 'Heading', type: 'text' },
        { key: 'description', label: 'Narrative Description', type: 'textarea' },
        { key: 'imageUrl', label: 'Story Image', type: 'image' },
        { key: 'ctaText', label: 'Button Text', type: 'text' },
        { key: 'ctaLink', label: 'Button Link', type: 'text' },
        { key: 'points', label: 'Bullet Checklist Points', type: 'string-list' },
      ];
    case 'CARDS':
      return [
        {
          key: 'items',
          label: 'Feature Cards',
          type: 'object-list',
          itemLabel: 'card',
          fields: [
            { key: 'title', label: 'Card Title', type: 'text' },
            { key: 'desc', label: 'Card Description', type: 'textarea' },
            { key: 'icon', label: 'Icon Name (e.g. Award, Sparkles, BookOpen)', type: 'text' },
          ],
        },
      ];
    case 'STATISTICS':
    case 'STATS':
      return [
        {
          key: 'items',
          label: 'Milestone Counters',
          type: 'object-list',
          itemLabel: 'counter',
          fields: [
            { key: 'label', label: 'Metric Label (e.g. Active Students)', type: 'text' },
            { key: 'value', label: 'Counter Value (e.g. 8,500)', type: 'text' },
            { key: 'prefix', label: 'Prefix (e.g. $)', type: 'text' },
            { key: 'suffix', label: 'Suffix (e.g. + or %)', type: 'text' },
            { key: 'iconName', label: 'Icon (e.g. Users, Award, BookOpen)', type: 'text' },
          ],
        },
      ];
    case 'ICON_CARDS':
      return [
        {
          key: 'items',
          label: 'Icon Feature Cards',
          type: 'object-list',
          itemLabel: 'card',
          fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'icon', label: 'Icon Name', type: 'text' },
          ],
        },
      ];
    case 'CTA':
    case 'CALL_TO_ACTION':
      return [
        { key: 'badge', label: 'Badge Tag', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subheadline', label: 'Supporting Description', type: 'textarea' },
        { key: 'buttonText', label: 'Primary Button Text', type: 'text' },
        { key: 'buttonUrl', label: 'Primary Button URL', type: 'text' },
        { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
        { key: 'secondaryButtonUrl', label: 'Secondary Button URL', type: 'text' },
      ];
    case 'VIDEO':
      return [
        { key: 'videoUrl', label: 'Video URL (YouTube or MP4)', type: 'text' },
        { key: 'coverImageUrl', label: 'Video Poster Cover Image', type: 'image' },
        { key: 'caption', label: 'Video Caption / Subtitle', type: 'text' },
      ];

    case 'FAQ':
      return [
        {
          key: 'items',
          label: 'Questions & Answers',
          type: 'object-list',
          itemLabel: 'FAQ Item',
          fields: [
            { key: 'question', label: 'Question', type: 'text' },
            { key: 'answer', label: 'Answer', type: 'textarea' },
          ],
        },
      ];
    case 'DEPARTMENTS':
    case 'COURSES':
    case 'FACULTY':
    case 'NEWS':
    case 'EVENTS':
    case 'NOTICES':
    case 'GALLERY':
      return [
        { key: 'limit', label: 'Number of items to display', type: 'number', help: 'Leave blank to use default count' },
        { key: 'showExploreButton', label: 'Show "View All" button at bottom', type: 'switch' },
      ];
    case 'CONTACT':
      return [
        { key: 'showInquiryForm', label: 'Show Admissions Inquiry Form', type: 'switch' },
        { key: 'showMap', label: 'Show Interactive Campus Map', type: 'switch' },
      ];
    default:
      return null;
  }
};

const TEXT_INPUT =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs placeholder:text-slate-400';

interface SectionContentEditorProps {
  sectionType: string;
  content: Record<string, any> | null | undefined;
  onChange: (content: Record<string, any>) => void;
  onJsonError?: (hasError: boolean) => void;
}

export const SectionContentEditor: React.FC<SectionContentEditorProps> = ({
  sectionType,
  content,
  onChange,
  onJsonError,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [jsonDraft, setJsonDraft] = useState<string>(() => JSON.stringify(content || {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const fields = useMemo(() => getFieldsForType(sectionType), [sectionType]);

  const set = (key: string, val: any) => {
    const updated = { ...(content || {}) };
    if (val === undefined || val === '' || val === null) {
      delete updated[key];
    } else {
      updated[key] = val;
    }
    onChange(updated);
    syncJsonDraft(updated);
  };

  const syncJsonDraft = (c: Record<string, any>) => {
    setJsonDraft(JSON.stringify(c || {}, null, 2));
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setJsonError('Content must be a JSON object (e.g. { "heading": "..." })');
        onJsonError?.(true);
        return;
      }
      setJsonError(null);
      onJsonError?.(false);
      onChange(parsed);
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON');
      onJsonError?.(true);
    }
  };

  const isImageField = (key: string, label: string) => {
    const k = key.toLowerCase();
    const l = label.toLowerCase();
    return (
      k.includes('image') ||
      k.includes('photo') ||
      k.includes('avatar') ||
      k.includes('poster') ||
      l.includes('image') ||
      l.includes('photo') ||
      l.includes('avatar')
    );
  };

  const renderScalar = (field: ContentField, value: any, onChangeValue: (v: any) => void) => {
    if (field.type === 'image' || isImageField(field.key, field.label)) {
      return (
        <FileUploadInput
          label={field.label}
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChangeValue(val)}
          placeholder="Upload image or enter image URL"
          helpText={field.help}
        />
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={typeof value === 'string' ? value : ''}
            placeholder={field.label}
            className={TEXT_INPUT}
            onChange={(e) => onChangeValue(e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'number' ? value : value == null || value === '' ? '' : String(value)}
            placeholder={field.label}
            className={TEXT_INPUT}
            onChange={(e) => onChangeValue(e.target.value === '' ? undefined : Number(e.target.value))}
          />
        );
      case 'textarea':
        return (
          <textarea
            rows={3}
            value={typeof value === 'string' ? value : ''}
            placeholder={field.label}
            className={TEXT_INPUT}
            onChange={(e) => onChangeValue(e.target.value)}
          />
        );
      case 'switch':
        return (
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(value)}
              onClick={() => onChangeValue(!value)}
              className={`relative inline-flex shrink-0 transition-colors duration-200 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 h-5 w-9 ${
                value ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 h-4 w-4 ${
                  value ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.label}</span>
          </label>
        );
    }
  };

  const renderObjectList = (field: ObjectListField) => {
    const list: any[] = Array.isArray(content?.[field.key]) ? content[field.key] : [];
    const updateItem = (index: number, key: string, value: any) => {
      const next = [...list];
      const item = { ...(next[index] || {}) };
      if (value === '' || value === null || value === undefined) {
        delete item[key];
      } else {
        item[key] = value;
      }
      next[index] = item;
      set(field.key, next);
    };
    const move = (index: number, dir: -1 | 1) => {
      const target = index + dir;
      if (target < 0 || target >= list.length) return;
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      set(field.key, next);
    };
    return (
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{field.label} ({list.length})</span>
          <button
            type="button"
            onClick={() => set(field.key, [...list, {}])}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add {field.itemLabel}
          </button>
        </div>
        {list.length === 0 && (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            No {field.label.toLowerCase()} added yet. Click "+ Add {field.itemLabel}" above to create one.
          </div>
        )}
        {list.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {field.itemLabel} #{index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition disabled:opacity-30 cursor-pointer"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === list.length - 1}
                  onClick={() => move(index, 1)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition disabled:opacity-30 cursor-pointer"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => set(field.key, list.filter((_, i) => i !== index))}
                  className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                  title={`Remove ${field.itemLabel}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-2.5">
              {field.fields.map((f) => (
                <div key={f.key}>
                  {f.type !== 'image' && !isImageField(f.key, f.label) && (
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {f.label}
                    </label>
                  )}
                  {renderScalar(f, item[f.key], (v) => updateItem(index, f.key, v))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStringList = (field: StringListField) => {
    const list: string[] = Array.isArray(content?.[field.key]) ? content[field.key] : [];
    const updateItem = (index: number, value: string) => {
      const next = [...list];
      next[index] = value;
      set(field.key, next.filter((s) => s.trim().length > 0));
    };
    return (
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{field.label}</span>
          <button
            type="button"
            onClick={() => set(field.key, [...list, ''])}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              placeholder="Enter item text..."
              className={TEXT_INPUT}
              onChange={(e) => updateItem(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => set(field.key, list.filter((_, i) => i !== index))}
              className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('form');
              setJsonError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'form'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Visual Editor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              syncJsonDraft(content || {});
              setActiveTab('json');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'json'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw JSON</span>
          </button>
        </div>
      </div>

      {activeTab === 'json' ? (
        <div className="space-y-2">
          {jsonError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{jsonError}</span>
            </div>
          )}
          <textarea
            rows={12}
            value={jsonDraft}
            onChange={(e) => {
              setJsonDraft(e.target.value);
              setJsonError(null);
            }}
            onBlur={applyJson}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {(!fields || fields.length === 0) && (
            <p className="text-xs text-slate-400 italic py-2">
              This section type uses automatic dynamic feeds or template settings.
            </p>
          )}

          {fields &&
            fields.map((field) => {
              if (field.type === 'object-list') {
                return <div key={field.key}>{renderObjectList(field)}</div>;
              }
              if (field.type === 'string-list') {
                return <div key={field.key}>{renderStringList(field)}</div>;
              }
              return (
                <div key={field.key} className="space-y-1">
                  {field.type !== 'image' && !isImageField(field.key, field.label) && (
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>
                  )}
                  {renderScalar(field, content?.[field.key], (v) => set(field.key, v))}
                  {field.help && <p className="text-[10px] text-slate-400">{field.help}</p>}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
