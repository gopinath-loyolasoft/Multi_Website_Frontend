import React, { useState, useMemo } from 'react';
import { Code2, LayoutList, Plus, Trash2, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

export interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch';
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
        { key: 'backgroundImage', label: 'Background Image URL', type: 'text' },
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
          label: 'Card Items',
          type: 'object-list',
          itemLabel: 'item',
          fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'desc', label: 'Description', type: 'text' },
          ],
        },
        { key: 'pillars', label: 'Quick Pillars (badges below heading)', type: 'string-list' },
      ];
    case 'HERO_SLIDER':
    case 'BANNERS':
      return [
        {
          key: 'slides',
          label: 'Slides',
          type: 'object-list',
          itemLabel: 'slide',
          fields: [
            { key: 'imageUrl', label: 'Image URL', type: 'text' },
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
        { key: 'title', label: 'Section Header (optional)', type: 'text' },
        { key: 'quoteText', label: 'Quote Text', type: 'textarea' },
        { key: 'authorName', label: 'Author / Leader Name', type: 'text' },
        { key: 'designation', label: 'Designation / Title', type: 'text' },
        { key: 'authorImageUrl', label: 'Author Photo URL', type: 'text', help: 'Path to portrait, e.g. /assets/templates/common/leader_portrait.svg' },
        { key: 'subText', label: 'Sub Text / Department (optional)', type: 'text' },
      ];
    case 'TEXT':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'leadText', label: 'Lead Text (Quote)', type: 'textarea' },
        { key: 'bodyHtml', label: 'Body HTML', type: 'textarea', help: 'Supports basic HTML markup' },
        { key: 'authorName', label: 'Author Name', type: 'text' },
        { key: 'authorRole', label: 'Author Role', type: 'text' },
      ];
    case 'IMAGE':
      return [
        { key: 'imageUrl', label: 'Image URL', type: 'text' },
        { key: 'caption', label: 'Caption', type: 'text' },
        { key: 'altText', label: 'Alt Text', type: 'text' },
        { key: 'fullWidth', label: 'Full Width', type: 'switch' },
        { key: 'aspectRatio', label: 'Aspect Ratio (e.g. 16/9)', type: 'text' },
      ];
    case 'IMAGE_TEXT':
      return [
        { key: 'badge', label: 'Badge', type: 'text' },
        { key: 'heading', label: 'Heading', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'imageUrl', label: 'Image URL', type: 'text' },
        { key: 'ctaText', label: 'Button Text', type: 'text' },
        { key: 'ctaLink', label: 'Button Link', type: 'text' },
        { key: 'points', label: 'Checklist Points', type: 'string-list' },
      ];
    case 'CARDS':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          key: 'cards',
          label: 'Cards',
          type: 'object-list',
          itemLabel: 'card',
          fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'imageUrl', label: 'Image URL', type: 'text' },
            { key: 'badge', label: 'Badge', type: 'text' },
          ],
        },
      ];
    case 'STATISTICS':
    case 'STATS':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          key: 'stats',
          label: 'Statistics',
          type: 'object-list',
          itemLabel: 'statistic',
          fields: [
            { key: 'value', label: 'Value', type: 'text' },
            { key: 'label', label: 'Label', type: 'text' },
          ],
        },
      ];
    case 'ICON_CARDS':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          key: 'items',
          label: 'Cards',
          type: 'object-list',
          itemLabel: 'card',
          fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'icon', label: 'Icon Name', type: 'text', help: 'Example: GraduationCap' },
          ],
        },
      ];
    case 'CTA':
    case 'CALL_TO_ACTION':
      return [
        { key: 'badge', label: 'Badge', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
        { key: 'buttonText', label: 'Primary Button Text', type: 'text' },
        { key: 'buttonUrl', label: 'Primary Button URL', type: 'text' },
        { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
        { key: 'secondaryButtonUrl', label: 'Secondary Button URL', type: 'text' },
      ];
    case 'VIDEO':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'videoUrl', label: 'Video URL', type: 'text' },
        { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'text' },
      ];
    case 'LOGO_GRID':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          key: 'logos',
          label: 'Logos',
          type: 'object-list',
          itemLabel: 'logo',
          fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'logoUrl', label: 'Logo URL', type: 'text' },
            { key: 'url', label: 'Link URL', type: 'text' },
          ],
        },
      ];
    case 'FAQ':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          key: 'faqs',
          label: 'FAQ Items',
          type: 'object-list',
          itemLabel: 'question',
          fields: [
            { key: 'question', label: 'Question', type: 'text' },
            { key: 'answer', label: 'Answer', type: 'textarea' },
          ],
        },
      ];
    case 'NOTICES':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          key: 'items',
          label: 'Notices',
          type: 'object-list',
          itemLabel: 'notice',
          fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ],
        },
      ];
    case 'NEWS':
    case 'EVENTS':
      return [
        { key: 'heading', label: 'Heading', type: 'text' },
        { key: 'subheading', label: 'Subheading', type: 'text' },
      ];
    case 'COURSES':
    case 'DEPARTMENTS':
    case 'FACULTY':
    case 'GALLERY':
    case 'TESTIMONIALS':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
      ];
    case 'MAP':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'embedUrl', label: 'Google Maps Embed URL', type: 'text', help: 'Paste the share embed src (iframe src) from Google Maps' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'height', label: 'Map Height (px)', type: 'number' },
      ];
    case 'CONTACT':
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
      ];
    default:
      return null;
  }
};

interface SectionContentEditorProps {
  sectionType: string;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  onJsonError?: (hasError: boolean) => void;
}

const TEXT_INPUT =
  'w-full py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 px-3';

const THIN_INPUT =
  'w-full py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 px-2.5';

export const SectionContentEditor: React.FC<SectionContentEditorProps> = ({
  sectionType,
  content,
  onChange,
  onJsonError,
}) => {
  const fields = useMemo(() => getFieldsForType(sectionType), [sectionType]);
  const [mode, setMode] = useState<'form' | 'json'>(fields ? 'form' : 'json');
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(content || {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const set = (key: string, value: any) => {
    const next = { ...(content || {}) };
    if (value === '' || value === null || value === undefined) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
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

  const renderScalar = (field: ContentField, value: any, onChangeValue: (v: any) => void) => {
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
            rows={4}
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{field.label}</span>
          <button
            type="button"
            onClick={() => set(field.key, [...list, {}])}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add {field.itemLabel}
          </button>
        </div>
        {list.length === 0 && (
          <p className="text-[11px] text-slate-400 italic">No {field.label.toLowerCase()} added yet.</p>
        )}
        {list.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-900/50 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
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
            {field.fields.map((sub) => {
              const subValue = item?.[sub.key];
              if (sub.type === 'switch') {
                return (
                  <div key={sub.key}>{renderScalar(sub, subValue, (v) => updateItem(index, sub.key, v))}</div>
                );
              }
              return (
                <div key={sub.key} className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {sub.label}
                  </label>
                  {sub.type === 'textarea'
                    ? renderScalar(sub, subValue, (v) => updateItem(index, sub.key, v))
                    : sub.type === 'text'
                      ? renderScalar(sub, subValue, (v) => updateItem(index, sub.key, v))
                      : (
                          <input
                            type="text"
                            value={typeof subValue === 'string' ? subValue : ''}
                            placeholder={sub.label}
                            className={THIN_INPUT}
                            onChange={(e) => updateItem(index, sub.key, e.target.value)}
                          />
                        )}
                  {sub.help && <p className="text-[10px] text-slate-400 mt-0.5">{sub.help}</p>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderStringList = (field: StringListField) => {
    const list: string[] = Array.isArray(content?.[field.key]) ? content[field.key] : [];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{field.label}</span>
          <button
            type="button"
            onClick={() => set(field.key, [...list, ''])}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add item
          </button>
        </div>
        {list.length === 0 && (
          <p className="text-[11px] text-slate-400 italic">No items added yet.</p>
        )}
        <div className="space-y-2">
          {list.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item || ''}
                placeholder="Enter value"
                className={TEXT_INPUT}
                onChange={(e) => {
                  const next = [...list];
                  next[index] = e.target.value;
                  set(field.key, next);
                }}
              />
              <button
                type="button"
                onClick={() => set(field.key, list.filter((_, i) => i !== index))}
                className="p-2 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('form');
              syncJsonDraft(content || {});
            }}
            disabled={!fields}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'form'
                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setMode('json')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
              mode === 'json'
                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON
          </button>
        </div>
        {fields && (
          <span className="text-[10px] font-semibold text-slate-400">
            {mode === 'form' ? 'Fields map to the live section renderer' : 'Press "Validate JSON" before saving'}
          </span>
        )}
      </div>

      {mode === 'json' ? (
        <div className="space-y-2">
          <textarea
            rows={14}
            value={jsonDraft}
            onChange={(e) => setJsonDraft(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-950 text-slate-100 dark:bg-slate-950 border border-slate-700 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
          {jsonError && (
            <div className="flex items-center gap-2 text-[11px] font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              {jsonError}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={applyJson}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition cursor-pointer"
            >
              Validate JSON
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {fields?.map((field) => {
            if (field.type === 'object-list') {
              return <div key={field.key}>{renderObjectList(field)}</div>;
            }
            if (field.type === 'string-list') {
              return <div key={field.key}>{renderStringList(field)}</div>;
            }
            const value = content?.[field.key];
            if (field.type === 'switch') {
              return <div key={field.key}>{renderScalar(field, value, (v) => set(field.key, v))}</div>;
            }
            return (
              <div key={field.key} className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {field.label}
                </label>
                {renderScalar(field, value, (v) => set(field.key, v))}
                {field.help && <p className="text-[10px] text-slate-400">{field.help}</p>}
              </div>
            );
          })}
          {!fields && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-3">
              No visual editor defined for this section type. Switch to the JSON tab to configure content.
            </p>
          )}
        </div>
      )}
    </div>
  );
};