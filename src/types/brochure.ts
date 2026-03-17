import { RoomType } from './property';

export interface PhotoAnalysis {
  id: string;
  blobUrl: string;
  filename: string;
  roomType: RoomType;
  caption: string;
  features: string[];
  lighting: 'natural' | 'artificial' | 'mixed';
  quality: 'high' | 'medium' | 'low';
  suggestedPage: number;
}

export interface GeneratedText {
  coverTagline: string;
  overviewIntro: string;
  keyFeatures: string[];
  situation: string;
  accommodation1: string;
  accommodation2: string;
  outside: string;
  roomCaptions: Record<string, string>;
}

export interface BrochurePage {
  pageNumber: number;
  name: string;
  canvasJson: object;
}

export interface Brochure {
  id: string;
  propertyDetails: import('./property').PropertyDetails;
  photos: PhotoAnalysis[];
  pages: BrochurePage[];
  generatedText: GeneratedText;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}
