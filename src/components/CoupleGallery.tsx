"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Image as ImageIcon, RefreshCw, Download, X, Check, Heart, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { showSuccess, showError } from '@/utils/toast';
import { getGalleryPhoto, saveGalleryPhoto, compressImageFile } from '@/utils/galleryStorage';
import { cn } from '@/lib/utils';

const CoupleGallery: React.FC = () => {
  const { lang } = useLang();
  const tr = translations.home.gallery;

  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Upload flow states: 'select' | 'preview'
  const [uploadStep, setUploadStep] = useState<'select' | 'preview'>('select');
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPhoto(getGalleryPhoto());
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedBase64 = await compressImageFile(file, 1200, 0.88);
      setPendingPhoto(compressedBase64);
      setUploadStep('preview');
    } catch (err: any) {
      console.error(err);
      showError(
        lang === 'ru'
          ? 'Не удалось обработать изображение'
          : 'Failed to process image'
      );
    } finally {
      setIsProcessing(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleSavePhoto = () => {
    if (!pendingPhoto) return;
    const success = saveGalleryPhoto(pendingPhoto);
    if (success) {
      setCurrentPhoto(pendingPhoto);
      showSuccess(
        lang === 'ru'
          ? 'Фотография успешно обновлена! 💕'
          : 'Couple photo updated successfully! 💕'
      );
      setIsModalOpen(false);
      setPendingPhoto(null);
      setUploadStep('select');
    } else {
      showError(
        lang === 'ru'
          ? 'Ошибка при сохранении фотографии'
          : 'Error saving photo'
      );
    }
  };

  const handleDownloadPhoto = () => {
    if (!currentPhoto) return;
    const link = document.createElement('a');
    link.href = currentPhoto;
    link.download = `myrzacute-couple-date-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(
      lang === 'ru' ? 'Фото сохранено в загрузки 📥' : 'Photo downloaded 📥'
    );
  };

  const openReplaceModal = () => {
    setPendingPhoto(null);
    setUploadStep('select');
    setIsModalOpen(true);
  };

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header title */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Heart size={16} className="fill-primary" />
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            {t(tr.title, lang)}
          </h2>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {t(tr.subtitle, lang)}
        </span>
      </div>

      {/* Photo Frame Container */}
      <Card className="border-[3px] border-border bg-card shadow-md hover:shadow-lg transition-all rounded-3xl overflow-hidden relative group">
        <CardContent className="p-3 sm:p-4">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border-[3px] border-border/80 bg-muted/40 group">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Our Last Date"
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-full flex flex-col items-center justify-center text-muted-foreground cursor-pointer p-4"
              >
                <ImageIcon size={48} className="opacity-40 mb-2" />
                <span className="text-sm font-semibold">
                  {t(tr.subtitle, lang)}
                </span>
              </div>
            )}

            {/* Click to enlarge overlay hint */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer pointer-events-auto"
            >
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                <Sparkles size={14} />
                {lang === 'ru' ? 'Нажми для просмотра' : 'Click to view'}
              </span>
            </div>

            {/* Replace Button on bottom-right corner */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openReplaceModal();
              }}
              className="absolute bottom-3 right-3 p-3 rounded-2xl bg-card/90 backdrop-blur-md border-[3px] border-border shadow-lg text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95 transition-all duration-300 z-10 flex items-center gap-1.5"
              title={t(tr.replaceBtn, lang)}
              aria-label={t(tr.replaceBtn, lang)}
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              <span className="text-xs font-black tracking-wide hidden sm:inline">
                {t(tr.replaceBtn, lang)}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── Lightbox Modal ── */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-3xl border-[3px] border-border bg-card/95 backdrop-blur-md p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-3">
            <div>
              <DialogTitle className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                <Heart size={18} className="text-red-500 fill-red-500" />
                {t(tr.title, lang)}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPhoto}
                className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1 text-xs font-bold"
                title={t(tr.downloadBtn, lang)}
              >
                <Download size={16} />
                <span>{t(tr.downloadBtn, lang)}</span>
              </button>
            </div>
          </DialogHeader>

          <div className="relative w-full max-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden border-[3px] border-border bg-black/40">
            {currentPhoto && (
              <img
                src={currentPhoto}
                alt="Full size date photo"
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLightboxOpen(false);
                openReplaceModal();
              }}
              className="py-2.5 px-4 rounded-xl border-[3px] border-border bg-secondary text-secondary-foreground font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>{t(tr.replaceBtn, lang)}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="py-2.5 px-5 rounded-xl border-[3px] border-border bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all"
            >
              {lang === 'ru' ? 'Закрыть' : 'Close'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Replace / Upload Photo Modal ── */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setPendingPhoto(null);
            setUploadStep('select');
          }
        }}
      >
        <DialogContent className="max-w-[92vw] sm:max-w-md rounded-3xl border-[3px] border-border bg-card p-6 shadow-2xl flex flex-col gap-5 select-none transition-all duration-300">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              {uploadStep === 'preview'
                ? t(tr.previewTitle, lang)
                : t(tr.modalTitle, lang)}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-medium mt-1">
              {uploadStep === 'preview'
                ? t(tr.previewSubtitle, lang)
                : t(tr.modalSubtitle, lang)}
            </DialogDescription>
          </DialogHeader>

          {/* STEP 1: Select Option (Camera vs Gallery) */}
          {uploadStep === 'select' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isProcessing}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-[3px] border-border bg-card hover:bg-primary/10 hover:border-primary transition-all duration-300 active:scale-95 group shadow-sm gap-3"
              >
                <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform border border-primary/20">
                  <Camera size={28} />
                </div>
                <span className="font-extrabold text-sm text-foreground">
                  {t(tr.takePhoto, lang)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isProcessing}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-[3px] border-border bg-card hover:bg-secondary/20 hover:border-secondary transition-all duration-300 active:scale-95 group shadow-sm gap-3"
              >
                <div className="p-3.5 rounded-2xl bg-secondary text-primary group-hover:scale-110 transition-transform border border-border">
                  <ImageIcon size={28} />
                </div>
                <span className="font-extrabold text-sm text-foreground">
                  {t(tr.uploadPhoto, lang)}
                </span>
              </button>
            </div>
          )}

          {/* STEP 2: Clear Preview & Confirm Step */}
          {uploadStep === 'preview' && pendingPhoto && (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-[3px] border-border bg-black/40 shadow-inner">
                <img
                  src={pendingPhoto}
                  alt="Pending preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPendingPhoto(null);
                    setUploadStep('select');
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold border-[3px] border-border text-foreground bg-card hover:bg-muted/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                  <RefreshCw size={16} />
                  <span>{t(tr.chooseAnotherBtn, lang)}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="flex-[1.5] py-3 px-4 rounded-2xl font-black bg-primary border-[3px] border-border text-primary-foreground hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-md"
                >
                  <Check size={18} />
                  <span>{t(tr.saveBtn, lang)}</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoupleGallery;
