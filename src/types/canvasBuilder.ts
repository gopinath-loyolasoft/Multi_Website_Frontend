export type CanvasBlockType =
  | 'TEXT'
  | 'HEADING'
  | 'PARAGRAPH'
  | 'IMAGE'
  | 'DOCUMENT_PDF'
  | 'BUTTON'
  | 'ICON_BOX'
  | 'STAT_COUNTER'
  | 'TABLE'
  | 'CONTAINER_1_COL'
  | 'CONTAINER_2_COL'
  | 'CONTAINER_3_COL'
  | 'DIVIDER'
  | 'VIDEO_POPUP'
  | 'COUNTDOWN_TIMER'
  | 'ACCORDION'
  | 'TABS_SWITCHER'
  | 'TIMELINE_ROADMAP'
  | 'FACULTY_GRID'
  | 'NOTICES_LIST'
  | 'LOGO_MATRIX'
  | 'MAP_EMBED'
  | 'COURSE_CARDS';

export interface CanvasBlockStyle {
  // Typography
  fontFamily?: string;
  fontSize?: string; // e.g. '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: 'normal' | '-1px' | '0.5px' | '1px' | '2px' | '3px' | string;
  lineHeight?: 'normal' | '1' | '1.15' | '1.5' | '2' | string;
  whiteSpace?: 'normal' | 'nowrap' | 'pre-wrap' | string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // Colors & Fills
  color?: string; // text hex/color
  backgroundColor?: string;
  gradient?: string;
  opacity?: string | number; // 0.0 - 1.0 or '1', '0.5'

  // Dimensions & Box Model
  width?: string; // '100%', '75%', '50%', '33.33%', '25%', 'auto' or custom px
  height?: string;
  minHeight?: string; // e.g. '120px', '250px', '400px'
  maxHeight?: string;
  maxWidth?: 'full' | 'narrow' | 'medium' | 'standard';
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  marginY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  flexAlignment?: 'start' | 'center' | 'end' | 'stretch';

  // Borders & Corner Radius
  borderPreset?: 'full' | 'top' | 'bottom' | 'left' | 'right' | 'none' | '';
  borderWidth?: '0px' | '1px' | '2px' | '3px' | '4px' | '5px' | 'none' | 'thin' | 'medium' | 'thick' | string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | string;
  borderColor?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  border?: string;
  borderRadius?: '0px' | '2px' | '4px' | '8px' | '12px' | '16px' | '50%' | 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | 'circle';

  // Line Separator Specific
  lineThickness?: '1px' | '2px' | '3px' | '4px' | '5px' | '8px' | '10px' | string;
  lineStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | string;
  lineEnds?: '0px' | '50%' | string;
  lineEndStyle?: 'none' | 'circle-both' | 'circle-left' | 'circle-right' | 'arrow-right' | 'arrow-left' | 'arrow-both' | string;
  lineShadow?: 'none' | 'light' | 'medium' | 'heavy' | string;

  // Table Specific
  cellPadding?: string;
  cellBorderWidth?: '0px' | '1px' | '2px' | '3px' | string;
  cellBorderStyle?: 'solid' | 'dashed' | 'dotted' | string;
  cellBorderColor?: string;
  borderCollapse?: 'collapse' | 'separate';
  dataSource?: 'none' | 'employees' | 'students' | string;

  // MS Word Free-Floating Position & Layering
  positionMode?: 'flow' | 'floating'; // 'flow' (in-document) vs 'floating' (MS Word free-form)
  posX?: number; // X position in px or % when floating
  posY?: number; // Y position in px or % when floating
  zIndex?: number; // Layer stacking order (-100 to 100)
  rotation?: number; // 0 - 360 deg
  aspectRatioLocked?: boolean;
}

export interface CanvasColumn {
  id: string;
  blocks: CanvasBlock[];
}

export interface CanvasTableData {
  rows: number;
  cols: number;
  data: string[][];
  dataSource?: string;
}

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType;
  content: Record<string, any>;
  styles: CanvasBlockStyle;
  columns?: CanvasColumn[];
  tableData?: CanvasTableData;
}

export interface CustomCanvasContent {
  canvasVersion: '1.0';
  containerWidth?: 'narrow' | 'standard' | 'wide' | 'full';
  backgroundColor?: string;
  gradient?: string;
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
  blocks: CanvasBlock[];
}

export interface PaletteItemMeta {
  type: CanvasBlockType;
  title: string;
  description: string;
  category: 'TOOLS' | 'TEXT' | 'MEDIA' | 'FILES' | 'ACTIONS' | 'LAYOUT';
  icon: string; // Lucide icon name
  defaultContent: Record<string, any>;
  defaultStyles: CanvasBlockStyle;
}
