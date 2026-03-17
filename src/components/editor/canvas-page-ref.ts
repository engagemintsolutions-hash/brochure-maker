import * as fabric from 'fabric';
import { createRef } from 'react';

// Shared ref for the active Fabric canvas, accessible from sibling components
export const fabricRef: { current: fabric.Canvas | null } = { current: null };
