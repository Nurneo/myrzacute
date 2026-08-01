import { supabase } from './supabase';

const GALLERY_STORAGE_KEY = 'myrzacute_couple_gallery_photo';
const DEFAULT_PHOTO_PATH = '/gallery-default.png';
const GALLERY_DB_DATE_KEY = 'couple_gallery_latest';

/**
 * Gets the current local couple gallery photo (Base64 data URL or default fallback path)
 */
export function getGalleryPhotoLocal(): string {
  try {
    const saved = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      return saved;
    }
  } catch (err) {
    console.error('Error reading gallery photo from localStorage:', err);
  }
  return DEFAULT_PHOTO_PATH;
}

/**
 * Fetches gallery photo from Supabase across all devices.
 * Syncs and updates local storage if a remote photo is available.
 */
export async function fetchGalleryPhotoRemote(): Promise<string> {
  const localPhoto = getGalleryPhotoLocal();
  if (!supabase) return localPhoto;

  try {
    const { data, error } = await supabase
      .from('lioness_feedback')
      .select('note')
      .eq('date', GALLERY_DB_DATE_KEY)
      .maybeSingle();

    if (!error && data?.note && data.note.startsWith('data:image')) {
      try {
        localStorage.setItem(GALLERY_STORAGE_KEY, data.note);
      } catch (e) {
        console.warn('Could not cache remote photo locally:', e);
      }
      return data.note;
    }
  } catch (err) {
    console.warn('Supabase fetch for gallery photo failed, using local cache:', err);
  }

  return localPhoto;
}

/**
 * Saves a new photo base64 string to local storage and syncs to Supabase cloud across all devices.
 */
export async function saveGalleryPhoto(photoBase64: string): Promise<boolean> {
  // 1. Save locally for instant rendering
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, photoBase64);
  } catch (err) {
    console.error('Error saving gallery photo to localStorage:', err);
  }

  // 2. Sync to Supabase so ALL devices see this uploaded photo
  if (supabase) {
    try {
      const { error } = await supabase
        .from('lioness_feedback')
        .upsert({
          date: GALLERY_DB_DATE_KEY,
          mood: 5,
          note: photoBase64,
        });

      if (error) {
        console.error('Supabase gallery photo sync error:', error);
      }
    } catch (err) {
      console.error('Failed to sync gallery photo to Supabase:', err);
    }
  }

  return true;
}

/**
 * Compresses an image file to an optimized JPEG data URL (max 1000px, quality 0.78) for quick cloud sync.
 */
export function compressImageFile(file: File, maxDimension = 1000, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
