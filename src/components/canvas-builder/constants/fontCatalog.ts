export interface FontOption {
  label: string;
  value: string;
  category: 'Sans-Serif' | 'Serif' | 'Display' | 'Monospace';
  fallback: string;
}

export const FONT_CATALOG: FontOption[] = [
  { label: 'System Default', value: 'inherit', category: 'Sans-Serif', fallback: 'sans-serif' },
  { label: 'Inter (Clean & Modern)', value: "'Inter', sans-serif", category: 'Sans-Serif', fallback: 'sans-serif' },
  { label: 'Poppins (Geometric & Bold)', value: "'Poppins', sans-serif", category: 'Sans-Serif', fallback: 'sans-serif' },
  { label: 'Roboto (Academic Standard)', value: "'Roboto', sans-serif", category: 'Sans-Serif', fallback: 'sans-serif' },
  { label: 'Montserrat (Editorial)', value: "'Montserrat', sans-serif", category: 'Sans-Serif', fallback: 'sans-serif' },
  { label: 'Nunito (Friendly & Rounded)', value: "'Nunito', sans-serif", category: 'Sans-Serif', fallback: 'sans-serif' },
  { label: 'Playfair Display (Prestigious Serif)', value: "'Playfair Display', serif", category: 'Serif', fallback: 'serif' },
  { label: 'Merriweather (Institutional Editorial)', value: "'Merriweather', serif", category: 'Serif', fallback: 'serif' },
  { label: 'Cinzel (Classical & Heritage)', value: "'Cinzel', serif", category: 'Display', fallback: 'serif' },
  { label: 'Space Mono (Technical / Data)', value: "'Space Mono', monospace", category: 'Monospace', fallback: 'monospace' },
];

export const FONT_SIZE_PRESETS = [
  { label: 'XS (12px)', value: '12px' },
  { label: 'SM (14px)', value: '14px' },
  { label: 'Base (16px)', value: '16px' },
  { label: 'LG (18px)', value: '18px' },
  { label: 'XL (20px)', value: '20px' },
  { label: '2XL (24px)', value: '24px' },
  { label: '3XL (30px)', value: '30px' },
  { label: '4XL (36px)', value: '36px' },
  { label: '5XL (48px)', value: '48px' },
  { label: '6XL (60px)', value: '60px' },
];
