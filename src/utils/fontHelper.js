/**
 * Google Fonts Dynamic Loader & Helper
 */

// Cache loaded fonts to prevent re-fetching
const loadedFonts = new Set();

/**
 * Common popular Google Fonts suitable for certificates and official documents
 */
export const POPULAR_GOOGLE_FONTS = [
  { name: 'Montserrat', category: 'Sans-Serif', desc: 'Modern & Geometrik' },
  { name: 'Playfair Display', category: 'Serif', desc: 'Klasik & Prestijli' },
  { name: 'Lora', category: 'Serif', desc: 'Zarif & Akıcı' },
  { name: 'Cinzel', category: 'Serif', desc: 'Görkemli & Resmi Başlık' },
  { name: 'Merriweather', category: 'Serif', desc: 'Okunaklı & Sıcak' },
  { name: 'Poppins', category: 'Sans-Serif', desc: 'Temiz & Çağdaş' },
  { name: 'Roboto Slab', category: 'Slab Serif', desc: 'Dengeli & Güçlü' },
  { name: 'Oswald', category: 'Sans-Serif', desc: 'Uzun & Dikkat Çekici' },
  { name: 'Great Vibes', category: 'Handwriting', desc: 'Kaligrafi & Özel Belge' },
  { name: 'Dancing Script', category: 'Handwriting', desc: 'Kutlama & El Yazısı' }
];

// Standard web safe fonts that do not require Google Fonts loading
const SYSTEM_FONTS = new Set([
  'times new roman',
  'arial',
  'georgia',
  'garamond',
  'courier new',
  'inter',
  'segoe ui',
  'roboto',
  'serif',
  'sans-serif',
  'monospace'
]);

/**
 * Dynamically load a font from Google Fonts API
 * @param {string} fontName - The name of the font (e.g., 'Montserrat', 'Playfair Display')
 * @returns {Promise<boolean>} - Resolves to true if loaded or already available, false if failed
 */
export const loadGoogleFont = (fontName) => {
  if (!fontName) return Promise.resolve(false);
  const cleanName = fontName.trim();
  const lowerName = cleanName.toLowerCase();

  // If system/web safe font, resolve immediately
  if (SYSTEM_FONTS.has(lowerName)) {
    return Promise.resolve(true);
  }

  // Already loaded in this session
  if (loadedFonts.has(lowerName)) {
    return document.fonts ? document.fonts.ready.then(() => true) : Promise.resolve(true);
  }

  const fontId = 'google-font-' + cleanName.replace(/\s+/g, '-').toLowerCase();

  // If link element already exists in DOM
  if (document.getElementById(fontId)) {
    loadedFonts.add(lowerName);
    return document.fonts ? document.fonts.ready.then(() => true) : Promise.resolve(true);
  }

  return new Promise((resolve) => {
    try {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      // Format font name for Google Fonts API URL (replace spaces with '+')
      const formattedName = cleanName.replace(/\s+/g, '+');
      // Load standard weights 400, 600, 700
      link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@400;600;700&display=swap`;

      link.onload = () => {
        loadedFonts.add(lowerName);
        if (document.fonts) {
          document.fonts.ready.then(() => resolve(true)).catch(() => resolve(true));
        } else {
          resolve(true);
        }
      };

      link.onerror = () => {
        console.warn(`[Google Fonts] "${cleanName}" fontu yüklenemedi veya Google Fonts kütüphanesinde bulunamadı.`);
        resolve(false);
      };

      document.head.appendChild(link);
    } catch (e) {
      console.error('Font loading error:', e);
      resolve(false);
    }
  });
};

/**
 * Get CSS font-family string with fallbacks
 */
export const getFontFamilyCss = (fontName) => {
  if (!fontName) return '"Times New Roman", Times, Georgia, serif';
  const name = fontName.trim();

  switch (name) {
    case 'Times New Roman':
      return '"Times New Roman", Times, Georgia, serif';
    case 'Arial':
      return 'Arial, "Helvetica Neue", Helvetica, sans-serif';
    case 'Georgia':
      return 'Georgia, Cambria, "Times New Roman", serif';
    case 'Garamond':
      return 'Garamond, "EB Garamond", "Times New Roman", serif';
    case 'Inter':
    case 'Roboto':
    case 'Segoe UI':
      return '"Segoe UI", Roboto, Inter, -apple-system, sans-serif';
    case 'Courier New':
      return '"Courier New", Courier, monospace';
    default:
      // Custom / Google Font
      return `"${name}", Georgia, "Times New Roman", serif`;
  }
};

/**
 * Get Canvas 2D font-family string with fallbacks
 */
export const getCanvasFontFamily = (fontName) => {
  if (!fontName) return '"Times New Roman", Georgia, serif';
  const name = fontName.trim();

  switch (name) {
    case 'Times New Roman':
      return '"Times New Roman", Georgia, serif';
    case 'Arial':
      return 'Arial, Helvetica, sans-serif';
    case 'Georgia':
      return 'Georgia, serif';
    case 'Garamond':
      return 'Garamond, "Times New Roman", serif';
    case 'Inter':
    case 'Roboto':
    case 'Segoe UI':
      return '"Segoe UI", Arial, sans-serif';
    case 'Courier New':
      return '"Courier New", monospace';
    default:
      // Custom / Google Font
      return `"${name}", "Times New Roman", Georgia, serif`;
  }
};
