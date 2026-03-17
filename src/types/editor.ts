import { BrochurePage, PhotoAnalysis, GeneratedText } from './brochure';
import { PropertyDetails } from './property';

export interface EditorState {
  brochureId: string;
  propertyDetails: PropertyDetails | null;
  photos: PhotoAnalysis[];
  generatedText: GeneratedText | null;
  pages: BrochurePage[];
  activePageIndex: number;
  selectedObjectId: string | null;
  accentColor: string;
  zoom: number;
  undoStack: object[][];
  redoStack: object[][];
  isDirty: boolean;
  isSaving: boolean;
}

export interface EditorActions {
  setActivePage: (index: number) => void;
  updatePageCanvas: (index: number, json: object) => void;
  setPages: (pages: BrochurePage[]) => void;
  setBrochure: (brochureId: string, propertyDetails: PropertyDetails, photos: PhotoAnalysis[], generatedText: GeneratedText, pages: BrochurePage[], accentColor: string) => void;
  pushUndo: () => void;
  undo: () => void;
  redo: () => void;
  setAccentColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  setSelectedObject: (id: string | null) => void;
  markClean: () => void;
  markDirty: () => void;
  setSaving: (saving: boolean) => void;
}
