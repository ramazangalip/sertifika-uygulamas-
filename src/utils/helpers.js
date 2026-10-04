import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import templateImgPath from '../assets/sertifika.png';

/**
 * Format date in Turkish style DD.MM.YYYY
 */
export const formatTurkishDate = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateString;
};

/**
 * Convert today's date to YYYY-MM-DD for input[type="date"]
 */
export const getTodayDateInput = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Sanitize Turkish string for clean filename
 */
export const sanitizeFileName = (name) => {
  if (!name) return 'Katilimci';
  const charMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  let sanitized = name.split('').map(c => charMap[c] || c).join('');
  return sanitized.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').trim();
};

/**
 * Trigger celebratory confetti
 */
export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#0284c7', '#d97706', '#10b981', '#6366f1', '#f59e0b']
    });
  } catch (e) {
    console.error('Confetti error:', e);
  }
};

/**
 * Preload template image as an HTMLImageElement
 */
let cachedTemplateImage = null;
export const loadTemplateImage = () => {
  if (cachedTemplateImage && cachedTemplateImage.complete) {
    return Promise.resolve(cachedTemplateImage);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedTemplateImage = img;
      resolve(img);
    };
    img.onerror = (e) => reject(e);
    img.src = templateImgPath;
  });
};

/**
 * High-definition Native Canvas Renderer
 * Renders directly onto Canvas 2D with exact mathematical percentages and zero DOM transform distortion.
 */
export const createCertificateCanvas = async (data, settings, scale = 2) => {
  if (document.fonts) {
    await document.fonts.ready;
  }
  
  const img = await loadTemplateImage();
  const baseWidth = img.naturalWidth || 1491;
  const baseHeight = img.naturalHeight || 1055;
  const width = baseWidth * scale;
  const height = baseHeight * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Template Image Background
  ctx.drawImage(img, 0, 0, width, height);

  // Scale ratio relative to 1000px preview width
  const ratio = width / 1000;

  // Font Family Map
  const fontStyleMap = {
    'Playfair Display': '"Playfair Display", Georgia, serif',
    'Cinzel': '"Cinzel", serif',
    'Cormorant Garamond': '"Cormorant Garamond", Georgia, serif',
    'Montserrat': '"Montserrat", sans-serif',
    'Inter': '"Inter", sans-serif',
  };
  const chosenFont = fontStyleMap[settings.fontFamily] || '"Playfair Display", serif';

  // 2. Render Participant Name
  const fullNameRaw = data.fullName && data.fullName.trim() ? data.fullName.trim() : 'Katılımcı Adı Soyadı';
  const fullNameText = settings.isUppercase ? fullNameRaw.toLocaleUpperCase('tr-TR') : fullNameRaw;

  const namePx = Math.round((settings.nameFontSize || 34) * ratio);
  const nameWeight = settings.fontWeight || '700';
  ctx.font = `${nameWeight} ${namePx}px ${chosenFont}`;
  ctx.fillStyle = settings.nameColor || '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const nameX = ((settings.namePosX ?? 50) / 100) * width;
  const nameY = ((settings.namePosY ?? 67.2) / 100) * height;
  ctx.fillText(fullNameText, nameX, nameY);

  // 3. Render Date
  const dateText = data.date && data.date.trim() ? data.date.trim() : '04.10.2026';
  const datePx = Math.round((settings.dateFontSize || 14) * ratio);
  const dateWeight = settings.dateFontWeight || '600';
  ctx.font = `${dateWeight} ${datePx}px ${chosenFont}`;
  ctx.fillStyle = settings.dateColor || '#1e293b';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const dateX = ((settings.datePosX ?? 13.8) / 100) * width;
  const dateY = ((settings.datePosY ?? 86.8) / 100) * height;
  ctx.fillText(dateText, dateX, dateY);

  // 4. Render Optional Instructor / Signature Name
  if (settings.showInstructor && data.instructorName && data.instructorName.trim()) {
    const instPx = Math.round((settings.instructorFontSize || 14) * ratio);
    ctx.font = `500 ${instPx}px ${chosenFont}`;
    ctx.fillStyle = settings.instructorColor || '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const instX = ((settings.instructorPosX ?? 80.5) / 100) * width;
    const instY = ((settings.instructorPosY ?? 84.5) / 100) * height;
    ctx.fillText(data.instructorName.trim(), instX, instY);
  }

  // 5. Render Optional Certificate No
  if (settings.showCertNo && data.certificateNo && data.certificateNo.trim()) {
    const certPx = Math.round((settings.certNoFontSize || 11) * ratio);
    ctx.font = `600 ${certPx}px monospace`;
    ctx.fillStyle = settings.certNoColor || '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const certX = ((settings.certNoPosX ?? 90.5) / 100) * width;
    const certY = ((settings.certNoPosY ?? 6.2) / 100) * height;
    ctx.fillText(`No: ${data.certificateNo.trim()}`, certX, certY);
  }

  return canvas;
};

/**
 * Generate and Download High-Res PDF (A4 Landscape 297mm x 210mm)
 */
export const downloadCertificatePDF = async (data, settings, scale = 2) => {
  const canvas = await createCertificateCanvas(data, settings, scale);
  const imgData = canvas.toDataURL('image/png', 1.0);

  // A4 Landscape: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
  const safeName = sanitizeFileName(data.fullName || 'Katilimci');
  const filename = `ISG_Sertifika_${safeName}.pdf`;
  pdf.save(filename);
  triggerConfetti();
  return filename;
};

/**
 * Generate and Download High-Res PNG Image
 */
export const downloadCertificatePNG = async (data, settings, scale = 2) => {
  const canvas = await createCertificateCanvas(data, settings, scale);
  const safeName = sanitizeFileName(data.fullName || 'Katilimci');
  const filename = `ISG_Sertifika_${safeName}.png`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  triggerConfetti();
  return filename;
};
