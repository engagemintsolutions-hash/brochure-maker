import { PageTemplate } from './template-types';
import {
  createCoverPage,
  createOverviewPage,
  createSituationPage,
  createAccommodation1Page,
  createAccommodation2Page,
  createOutsidePage,
  createDetailsPage,
  createLocationPage,
} from './page-layouts';
import { PhotoAnalysis, GeneratedText, BrochurePage } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';
import { mapPhotosToPages, PagePhotoAssignment } from '@/lib/photo-mapper';

export function generateBrochureTemplate(
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string = '#D50032',
): BrochurePage[] {
  const assignments = mapPhotosToPages(photos);

  const getPhotos = (pageIndex: number): PhotoAnalysis[] =>
    assignments.find((a: PagePhotoAssignment) => a.pageIndex === pageIndex)?.photos || [];

  const templates: PageTemplate[] = [
    createCoverPage(property, getPhotos(0), text, accentColor),
    createOverviewPage(property, getPhotos(1), text, accentColor),
    createSituationPage(getPhotos(2), text, accentColor),
    createAccommodation1Page(getPhotos(3), text, accentColor),
    createAccommodation2Page(getPhotos(4), text, accentColor),
    createOutsidePage(getPhotos(5), text, accentColor),
    createDetailsPage(property, accentColor),
    createLocationPage(property, getPhotos(7), accentColor),
  ];

  return templates.map((template) => ({
    pageNumber: template.pageNumber,
    name: template.name,
    canvasJson: templateToCanvasJson(template),
  }));
}

function templateToCanvasJson(template: PageTemplate): object {
  const objects = template.elements.map((el) => {
    const base = {
      name: el.name,
      left: el.left,
      top: el.top,
      selectable: el.selectable !== false && el.editable,
      evented: el.editable,
      hasControls: el.editable,
      lockMovementX: !el.editable,
      lockMovementY: !el.editable,
    };

    switch (el.type) {
      case 'rect':
        return {
          ...base,
          type: 'Rect',
          width: el.width,
          height: el.height,
          fill: el.fill || 'transparent',
          opacity: el.opacity ?? 1,
          rx: el.rx || 0,
          ry: el.ry || 0,
          stroke: el.stroke || null,
          strokeWidth: el.strokeWidth || 0,
        };

      case 'textbox':
        return {
          ...base,
          type: 'Textbox',
          width: el.width,
          height: el.height,
          text: el.text || '',
          fontFamily: el.fontFamily || 'Inter',
          fontSize: el.fontSize || 14,
          fontWeight: el.fontWeight || 'normal',
          fontStyle: el.fontStyle || 'normal',
          fill: el.fill || '#000000',
          textAlign: el.textAlign || 'left',
          lineHeight: el.lineHeight || 1.4,
          charSpacing: el.charSpacing || 0,
          editable: true,
          splitByGrapheme: true,
        };

      case 'line':
        return {
          ...base,
          type: 'Line',
          x1: el.x1 || 0,
          y1: el.y1 || 0,
          x2: el.x2 || el.width,
          y2: el.y2 || 0,
          stroke: el.stroke || '#000000',
          strokeWidth: el.strokeWidth || 1,
        };

      case 'image':
        return {
          ...base,
          type: 'Image',
          width: el.width,
          height: el.height,
          src: el.imageUrl || '',
          crossOrigin: 'anonymous',
          // Store original dimensions for the editor to load
          _imageUrl: el.imageUrl || '',
        };

      default:
        return base;
    }
  });

  return {
    version: '6.0.0',
    objects,
    background: template.backgroundColor,
  };
}
