export interface TemplateElement {
  type: 'rect' | 'textbox' | 'image' | 'line';
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  editable: boolean;
  selectable?: boolean;
  // Common
  fill?: string;
  opacity?: number;
  // Text
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: string;
  lineHeight?: number;
  charSpacing?: number;
  // Rect
  rx?: number;
  ry?: number;
  stroke?: string;
  strokeWidth?: number;
  // Line
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  // Image
  imageUrl?: string;
  scaleX?: number;
  scaleY?: number;
  // Clip frame for images
  clipWidth?: number;
  clipHeight?: number;
}

export interface PageTemplate {
  pageNumber: number;
  name: string;
  backgroundColor: string;
  elements: TemplateElement[];
}
