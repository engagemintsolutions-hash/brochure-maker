'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { PhotoUploader } from '@/components/upload/photo-uploader';
import { PhotoGrid, UploadedPhoto } from '@/components/upload/photo-grid';
import { PropertyForm } from '@/components/upload/property-form';
import { TemplateSelector } from '@/components/upload/template-selector';
import { PropertyDetails } from '@/types/property';
import { PhotoAnalysis } from '@/types/brochure';

type Step = 'photos' | 'details' | 'template' | 'generating';

export default function NewBrochurePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('photos');
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('kf-residential');
  const [property, setProperty] = useState<Partial<PropertyDetails>>({
    priceQualifier: 'guide_price',
    tenure: 'freehold',
  });
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('photos', f));

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error || 'Upload failed');
        return;
      }

      const newPhotos: UploadedPhoto[] = uploadData.photos
        .filter((p: { id?: string; error?: string }) => p.id)
        .map((p: { id: string; blobUrl: string; filename: string }) => ({
          ...p,
          analyzing: true,
        }));

      setPhotos((prev) => [...prev, ...newPhotos]);

      const toAnalyze = newPhotos.map((p: UploadedPhoto) => ({
        id: p.id,
        blobUrl: p.blobUrl,
        filename: p.filename,
      }));

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: toAnalyze }),
      });
      const analyzeData = await analyzeRes.json();

      if (analyzeRes.ok && analyzeData.analyses) {
        setPhotos((prev) =>
          prev.map((photo) => {
            const analysis = analyzeData.analyses.find(
              (a: PhotoAnalysis) => a.id === photo.id,
            );
            if (analysis) {
              return { ...photo, analysis, analyzing: false };
            }
            return photo;
          }),
        );
      } else {
        setPhotos((prev) =>
          prev.map((photo) =>
            photo.analyzing ? { ...photo, analyzing: false, error: 'Analysis failed' } : photo,
          ),
        );
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleGenerate = async () => {
    setStep('generating');
    setError(null);

    try {
      const analyses = photos
        .filter((p) => p.analysis)
        .map((p) => p.analysis as PhotoAnalysis);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: analyses, property }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Generation failed');
        setStep('template');
        return;
      }

      const brochureId = nanoid(10);
      const brochureData = {
        id: brochureId,
        propertyDetails: property,
        photos: analyses,
        generatedText: data.text,
        accentColor: '#4A1420',
        templateId: selectedTemplate,
      };

      sessionStorage.setItem(`brochure-${brochureId}`, JSON.stringify(brochureData));
      router.push(`/brochure/${brochureId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate brochure text. Please try again.');
      setStep('template');
    }
  };

  const analyzedCount = photos.filter((p) => p.analysis).length;
  const analyzingCount = photos.filter((p) => p.analyzing).length;
  const canProceed = photos.length >= 3 && analyzingCount === 0;

  const steps = [
    { key: 'photos', label: '1. Photos' },
    { key: 'details', label: '2. Details' },
    { key: 'template', label: '3. Template' },
    { key: 'generating', label: '4. Generate' },
  ];

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/doorstep-logo.png" alt="Doorstep" width={120} height={34} className="h-8 w-auto" />
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-lg font-semibold font-[family-name:var(--font-playfair)]">
              New Brochure
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {steps.map((s, i) => (
              <span key={s.key}>
                {i > 0 && <span className="text-gray-300 mx-1">/</span>}
                <span className={step === s.key ? 'text-[var(--accent)] font-medium' : ''}>
                  {s.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Photos */}
        {step === 'photos' && (
          <div>
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-2">
              Upload Property Photos
            </h2>
            <p className="text-gray-600 mb-6">
              Upload at least 3 photos of the property. Our AI will analyse each one to identify
              rooms and features automatically.
            </p>

            <PhotoUploader onUpload={handleUpload} currentCount={photos.length} isUploading={isUploading} />
            <PhotoGrid photos={photos} onRemove={handleRemove} />

            {photos.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {analyzedCount} of {photos.length} photos analysed
                  {analyzingCount > 0 && ` (${analyzingCount} in progress)`}
                </p>
                <button
                  onClick={() => setStep('details')}
                  disabled={!canProceed}
                  className="flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[var(--accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next: Property Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 'details' && (
          <div>
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-2">
              Property Details
            </h2>
            <p className="text-gray-600 mb-6">
              Fill in the property information. This will be used to generate the brochure text.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <PropertyForm value={property} onChange={setProperty} />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setStep('photos')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Photos
              </button>
              <button
                onClick={() => setStep('template')}
                disabled={!property.address?.line1 || !property.price}
                className="flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[var(--accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Choose Template
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Template Selection */}
        {step === 'template' && (
          <div>
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-2">
              Choose a Template
            </h2>
            <p className="text-gray-600 mb-6">
              Select a brochure style. You can change colours and edit everything in the editor afterward.
            </p>

            <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep('details')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[var(--accent-dark)] transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate Brochure
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Generating */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin mb-6" />
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-2">
              Generating Your Brochure
            </h2>
            <p className="text-gray-500">
              Writing property descriptions and building the template. This takes about 15 seconds.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
