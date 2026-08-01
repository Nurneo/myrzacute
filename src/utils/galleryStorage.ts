const GALLERY_STORAGE_KEY = 'myrzacute_couple_gallery_photo';
const DEFAULT_PHOTO_PATH = '/gallery-default.png';

/**
 * Gets the current couple gallery photo (Base64 data URL or default fallback path)
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
 * Saves a new photo base64 string to storage
 */
export function saveGalleryPhoto(photoBase64: string): boolean {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, photoBase64);
    return true;
  } catch (err) {
    console.error('Error saving gallery photo to localStorage:', err);
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
