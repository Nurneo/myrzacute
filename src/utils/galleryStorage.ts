import { supabase } from './supabase';

const GALLERY_STORAGE_KEY = 'myrzacute_couple_gallery_photo';
const DEFAULT_PHOTO_PATH = '/gallery-default.png';
const CLOUD_DATE_KEY = 'couple_photo_current';

/**
 * Gets current gallery photo synchronously from local cache (with default fallback)
 */
export function getGalleryPhoto(): string {
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
 * Fetches latest gallery photo from Supabase cloud database
 */
export async function fetchGalleryPhotoFromCloud(): Promise<string> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('lioness_feedback')
        .select('note')
        .eq('date', CLOUD_DATE_KEY)
        .maybeSingle();

      if (!error && data?.note) {
        localStorage.setItem(GALLERY_STORAGE_KEY, data.note);
        return data.note;
      }
    } catch (err) {
      console.warn('Error fetching couple photo from Supabase cloud:', err);
    }
  }
  return getGalleryPhoto();
}

/**
 * Saves photo base64 to local cache & Supabase cloud, and broadcasts to other devices
 */
export async function saveGalleryPhoto(photoBase64: string): Promise<boolean> {
  try {
    // 1. Update local storage cache immediately
    localStorage.setItem(GALLERY_STORAGE_KEY, photoBase64);

    // 2. Persist to Supabase cloud database
    if (supabase) {
      const { error } = await supabase
        .from('lioness_feedback')
        .upsert({
          date: CLOUD_DATE_KEY,
          note: photoBase64,
          mood: 5,
        });

      if (error) {
        console.warn('Supabase cloud photo save warning:', error);
      }

      // 3. Broadcast to all active connected devices in real time
      const channel = supabase.channel('couple_gallery_sync');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'photo_updated',
            payload: { photoUrl: photoBase64, timestamp: Date.now() },
          });
        }
      });
    }

    return true;
  } catch (err) {
    console.error('Error saving gallery photo:', err);
    return false;
  }
}

/**
 * Compresses an image file to a data URL with maximum width/height & quality
 */
export function compressImageFile(file: File, maxDimension = 1200, quality = 0.85): Promise<string> {
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
