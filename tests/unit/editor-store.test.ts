import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editor-store';
import { PropertyDetails } from '@/types/property';
import { GeneratedText, BrochurePage } from '@/types/brochure';

const mockProperty: PropertyDetails = {
  address: { line1: '1 Test St', line2: '', city: 'London', county: '', postcode: 'SW1 1AA' },
  price: 500000,
  priceQualifier: 'guide_price',
  bedrooms: 2,
  bathrooms: 1,
  receptions: 1,
  propertyType: 'Flat',
  tenure: 'leasehold',
  councilTaxBand: 'C',
  epcRating: 'D',
};

const mockText: GeneratedText = {
  coverTagline: 'Test',
  overviewIntro: 'Test intro',
  keyFeatures: ['Feature 1'],
  situation: 'Test situation',
  accommodation1: 'Test accom 1',
  accommodation2: 'Test accom 2',
  outside: 'Test outside',
  roomCaptions: {},
};

const mockPages: BrochurePage[] = [
  { pageNumber: 0, name: 'Cover', canvasJson: { objects: [{ type: 'text', text: 'page0' }] } },
  { pageNumber: 1, name: 'Overview', canvasJson: { objects: [{ type: 'text', text: 'page1' }] } },
];

describe('editor-store', () => {
  beforeEach(() => {
    useEditorStore.setState({
      brochureId: '',
      propertyDetails: null,
      photos: [],
      generatedText: null,
      pages: [],
      activePageIndex: 0,
      selectedObjectId: null,
      accentColor: '#4A1420',
      zoom: 1,
      undoStack: [],
      redoStack: [],
      isDirty: false,
      isSaving: false,
    });
  });

  it('setBrochure initialises state', () => {
    const store = useEditorStore.getState();
    store.setBrochure('test-id', mockProperty, [], mockText, mockPages, '#FF0000');

    const state = useEditorStore.getState();
    expect(state.brochureId).toBe('test-id');
    expect(state.pages).toHaveLength(2);
    expect(state.accentColor).toBe('#FF0000');
    expect(state.isDirty).toBe(false);
  });

  it('setActivePage changes page and clears selection', () => {
    const store = useEditorStore.getState();
    store.setBrochure('test', mockProperty, [], mockText, mockPages, '#000');
    store.setSelectedObject('some-obj');
    store.setActivePage(1);

    const state = useEditorStore.getState();
    expect(state.activePageIndex).toBe(1);
    expect(state.selectedObjectId).toBeNull();
  });

  it('updatePageCanvas marks dirty', () => {
    const store = useEditorStore.getState();
    store.setBrochure('test', mockProperty, [], mockText, mockPages, '#000');
    store.updatePageCanvas(0, { objects: [{ type: 'text', text: 'updated' }] });

    expect(useEditorStore.getState().isDirty).toBe(true);
  });

  it('undo/redo works correctly', () => {
    const store = useEditorStore.getState();
    store.setBrochure('test', mockProperty, [], mockText, mockPages, '#000');

    // Push current state to undo stack
    store.pushUndo();
    // Modify a page
    store.updatePageCanvas(0, { objects: [{ type: 'text', text: 'modified' }] });

    expect(useEditorStore.getState().undoStack).toHaveLength(1);
    expect(useEditorStore.getState().redoStack).toHaveLength(0);

    // Undo
    useEditorStore.getState().undo();
    const afterUndo = useEditorStore.getState();
    expect(afterUndo.undoStack).toHaveLength(0);
    expect(afterUndo.redoStack).toHaveLength(1);

    // Redo
    useEditorStore.getState().redo();
    const afterRedo = useEditorStore.getState();
    expect(afterRedo.undoStack).toHaveLength(1);
    expect(afterRedo.redoStack).toHaveLength(0);
  });

  it('undo with empty stack does nothing', () => {
    const store = useEditorStore.getState();
    store.setBrochure('test', mockProperty, [], mockText, mockPages, '#000');
    store.undo();
    expect(useEditorStore.getState().pages).toEqual(mockPages);
  });

  it('setZoom clamps between 0.25 and 2', () => {
    const store = useEditorStore.getState();
    store.setZoom(5);
    expect(useEditorStore.getState().zoom).toBe(2);
    store.setZoom(0.1);
    expect(useEditorStore.getState().zoom).toBe(0.25);
    store.setZoom(1.5);
    expect(useEditorStore.getState().zoom).toBe(1.5);
  });

  it('markClean and markDirty toggle isDirty', () => {
    const store = useEditorStore.getState();
    store.markDirty();
    expect(useEditorStore.getState().isDirty).toBe(true);
    store.markClean();
    expect(useEditorStore.getState().isDirty).toBe(false);
  });

  it('setAccentColor marks dirty', () => {
    const store = useEditorStore.getState();
    store.setAccentColor('#FF0000');
    const state = useEditorStore.getState();
    expect(state.accentColor).toBe('#FF0000');
    expect(state.isDirty).toBe(true);
  });

  it('pushUndo limits stack to 30', () => {
    const store = useEditorStore.getState();
    store.setBrochure('test', mockProperty, [], mockText, mockPages, '#000');
    for (let i = 0; i < 35; i++) {
      store.pushUndo();
    }
    expect(useEditorStore.getState().undoStack).toHaveLength(30);
  });
});
