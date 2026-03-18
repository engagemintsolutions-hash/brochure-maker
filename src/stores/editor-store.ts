import { create } from 'zustand';
import { EditorState, EditorActions } from '@/types/editor';
import { BrochurePage, PhotoAnalysis, GeneratedText } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';
import { BRAND } from '@/lib/constants';

const MAX_UNDO = 30;

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  brochureId: '',
  propertyDetails: null,
  photos: [],
  generatedText: null,
  pages: [],
  activePageIndex: 0,
  selectedObjectId: null,
  accentColor: BRAND.accent,
  zoom: 1,
  undoStack: [],
  redoStack: [],
  isDirty: false,
  isSaving: false,
  thumbnails: {},
  showGrid: false,
  canvasVersion: 0,

  setBrochure: (
    brochureId: string,
    propertyDetails: PropertyDetails,
    photos: PhotoAnalysis[],
    generatedText: GeneratedText,
    pages: BrochurePage[],
    accentColor: string,
  ) => {
    set({
      brochureId,
      propertyDetails,
      photos,
      generatedText,
      pages,
      accentColor,
      activePageIndex: 0,
      selectedObjectId: null,
      undoStack: [],
      redoStack: [],
      isDirty: false,
    });
  },

  setActivePage: (index: number) => {
    set({ activePageIndex: index, selectedObjectId: null });
  },

  updatePageCanvas: (index: number, json: object) => {
    const { pages } = get();
    const updated = [...pages];
    updated[index] = { ...updated[index], canvasJson: json };
    set({ pages: updated, isDirty: true });
  },

  setPages: (pages: BrochurePage[]) => {
    set({ pages });
  },

  pushUndo: () => {
    const { pages, undoStack } = get();
    const snapshot = pages.map((p) => p.canvasJson);
    const newStack = [...undoStack, snapshot].slice(-MAX_UNDO);
    set({ undoStack: newStack, redoStack: [] });
  },

  undo: () => {
    const { undoStack, pages, redoStack } = get();
    if (undoStack.length === 0) return;

    const currentSnapshot = pages.map((p) => p.canvasJson);
    const prevSnapshot = undoStack[undoStack.length - 1];

    const restoredPages = pages.map((page, i) => ({
      ...page,
      canvasJson: prevSnapshot[i] || page.canvasJson,
    }));

    set({
      pages: restoredPages,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, currentSnapshot],
      isDirty: true,
    });
  },

  redo: () => {
    const { redoStack, pages, undoStack } = get();
    if (redoStack.length === 0) return;

    const currentSnapshot = pages.map((p) => p.canvasJson);
    const nextSnapshot = redoStack[redoStack.length - 1];

    const restoredPages = pages.map((page, i) => ({
      ...page,
      canvasJson: nextSnapshot[i] || page.canvasJson,
    }));

    set({
      pages: restoredPages,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, currentSnapshot],
      isDirty: true,
    });
  },

  setAccentColor: (color: string) => {
    set({ accentColor: color, isDirty: true });
  },

  setZoom: (zoom: number) => {
    set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
  },

  setSelectedObject: (id: string | null) => {
    set({ selectedObjectId: id });
  },

  markClean: () => set({ isDirty: false }),
  markDirty: () => set({ isDirty: true }),
  setSaving: (saving: boolean) => set({ isSaving: saving }),

  setThumbnail: (index: number, dataUrl: string) => {
    set((state) => ({ thumbnails: { ...state.thumbnails, [index]: dataUrl } }));
  },

  setShowGrid: (show: boolean) => set({ showGrid: show }),

  bumpCanvasVersion: () => {
    set((state) => ({ canvasVersion: state.canvasVersion + 1 }));
  },
}));
