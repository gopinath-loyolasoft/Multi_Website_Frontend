export interface ColorPreset {
  name: string;
  value: string;
  textClass?: string;
  bgClass?: string;
}

export const TEXT_COLOR_PRESETS: ColorPreset[] = [
  { name: 'Dark Slate (Default)', value: '#0f172a' },
  { name: 'Muted Slate', value: '#475569' },
  { name: 'Light Slate', value: '#94a3b8' },
  { name: 'White', value: '#ffffff' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Deep Navy', value: '#1e3a8a' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Emerald Green', value: '#059669' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Amber Gold', value: '#d97706' },
  { name: 'Purple', value: '#7c3aed' },
];

export const BACKGROUND_COLOR_PRESETS: ColorPreset[] = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Subtle Slate Light', value: '#f8fafc' },
  { name: 'Soft Gray', value: '#f1f5f9' },
  { name: 'Soft Blue Tint', value: '#eff6ff' },
  { name: 'Soft Indigo Tint', value: '#eef2ff' },
  { name: 'Soft Emerald Tint', value: '#ecfdf5' },
  { name: 'Soft Amber Tint', value: '#fffbeb' },
  { name: 'Dark Navy', value: '#0f172a' },
  { name: 'Deep Midnight', value: '#020617' },
  { name: 'Dark Indigo', value: '#1e1b4b' },
];

export const GRADIENT_PRESETS: ColorPreset[] = [
  { name: 'None (Solid)', value: '' },
  { name: 'Blue to Indigo', value: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' },
  { name: 'Navy to Blue', value: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)' },
  { name: 'Emerald to Teal', value: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' },
  { name: 'Sunset Amber to Rose', value: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)' },
  { name: 'Purple to Indigo', value: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)' },
  { name: 'Soft Sky Mist', value: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' },
  { name: 'Soft Aurora Light', value: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)' },
  { name: 'Dark Obsidian Glow', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
];
