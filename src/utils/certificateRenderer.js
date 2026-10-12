import jsPDF from 'jspdf';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import mebLogoSrc from '../assets/meb_logo.png';
import { getCanvasFontFamily, loadGoogleFont } from './fontHelper';

let cachedMebLogo = null;
const loadMebLogo = () => {
  if (cachedMebLogo && cachedMebLogo.complete) {
    return Promise.resolve(cachedMebLogo);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedMebLogo = img;
      resolve(img);
    };
    img.onerror = (e) => reject(e);
    img.src = mebLogoSrc;
  });
};

export const sanitizeFileName = (name) => {
  if (!name) return 'Ogrenci';
  const charMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  let sanitized = String(name).split('').map(c => charMap[c] || c).join('');
  return sanitized.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').trim();
};

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#0284c7', '#16a34a', '#eab308']
    });
  } catch (e) {
    console.error('Confetti error:', e);
  }
};

/**
 * Split text into lines if it exceeds maxWidth in the given canvas context
 */
export const wrapTextToLines = (context, text, maxWidth) => {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = context.measureText(testLine).width;
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
};

/**
 * Render A4 Landscape (Yatay) or Portrait (Dikey) Official MEB Certificate
 * Default: Landscape (A4 Yatay: 297mm x 210mm @ 300 DPI = 3508 x 2480 px)
 */
export const renderCertificateToCanvas = async (student, settings = {}) => {
  if (settings.fontFamily) {
    await loadGoogleFont(settings.fontFamily);
  }

  if (document.fonts) {
    await document.fonts.ready;
  }

  const logoImg = await loadMebLogo();
  const orientation = settings.orientation || 'landscape'; // 'landscape' | 'portrait'
  const isLandscape = orientation === 'landscape';

  const width = isLandscape ? 3508 : 2480;
  const height = isLandscape ? 2480 : 3508;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Clean White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const fontFace = getCanvasFontFamily(settings.fontFamily);
  const sizeMultiplier = (settings.fontSizeScale || 100) / 100;

  const tableFontSizeBase = isLandscape
    ? Math.round((settings.tableFontSize ? (settings.tableFontSize * 2.8) : 34) * sizeMultiplier)
    : Math.round((settings.tableFontSize ? (settings.tableFontSize * 3.0) : 36) * sizeMultiplier);

  const titleFontSize = isLandscape
    ? Math.round((settings.titleFontSize ? (settings.titleFontSize * 3.5) : 74) * sizeMultiplier)
    : Math.round((settings.titleFontSize ? (settings.titleFontSize * 3.7) : 84) * sizeMultiplier);

  const descFontSize = isLandscape
    ? Math.round((settings.descFontSize ? (settings.descFontSize * 3.1) : 41) * sizeMultiplier)
    : Math.round((settings.descFontSize ? (settings.descFontSize * 2.85) : 34) * sizeMultiplier);

  const sigNameSize = Math.round((isLandscape ? 42 : 44) * sizeMultiplier);
  const sigTitleSize = Math.round((isLandscape ? 44 : 48) * sizeMultiplier);

  // Helper font drawer with automatic overflow protection
  const drawFittedValue = (text, x, y, maxWidth, baseSize = tableFontSizeBase, weight = 'normal') => {
    if (!text && text !== 0) return;
    const str = String(text).trim();
    let size = baseSize;
    ctx.font = `${weight} ${size}px ${fontFace}`;
    let textWidth = ctx.measureText(str).width;
    while (textWidth > maxWidth && size > 16) {
      size -= 1;
      ctx.font = `${weight} ${size}px ${fontFace}`;
      textWidth = ctx.measureText(str).width;
    }
    ctx.fillText(str, x, y);
  };

  if (isLandscape) {
    // -------------------------------------------------------------
    // A4 YATAY (LANDSCAPE) DÜZENİ: 3508 x 2480 px - Kompakt ve Dengeli
    // -------------------------------------------------------------

    // Top-Left Verification Square Box
    const boxX = 140;
    const boxY = 80;
    const boxSize = 54;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    // Official MEB Circular Emblem (Sayfanın en üstünde)
    const logoSize = 280;
    const logoX = (width - logoSize) / 2;
    const logoY = 80;
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

    // Header: KATILIM BELGESİ (Kompakt boşluk)
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${titleFontSize}px ${fontFace}`;
    ctx.fillText('KATILIM BELGESİ', width / 2, 440);

    // Table Coordinates (Sayfanın üst kısmında kompakt)
    const tableX = 180;
    const tableY = 530;
    const tableWidth = width - (tableX * 2); // 3148px
    const rowHeight = 88;
    const totalRows = 7;
    const tableHeight = rowHeight * totalRows; // 616px -> Table ends at 1146px

    // Outer Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(tableX, tableY, tableWidth, tableHeight);

    // Horizontal Lines
    for (let i = 1; i < totalRows; i++) {
      const y = tableY + (i * rowHeight);
      ctx.beginPath();
      ctx.moveTo(tableX, y);
      ctx.lineTo(tableX + tableWidth, y);
      ctx.stroke();
    }

    // Column Split Positions
    // Rows 1, 3, 4, 5: 2 Columns (Col 1: 1360px, Col 2: 1788px)
    const col2XStandard = tableX + 1360;

    // Row 2: 3 Columns (Col 1: 1140px, Col 2: 1000px, Col 3: 1008px)
    const col2XRow2 = tableX + 1140;
    const col3XRow2 = tableX + 2140;

    // Draw Vertical lines for Row 1, 3, 4, 5
    [0, 2, 3, 4].forEach(rowIndex => {
      const yTop = tableY + (rowIndex * rowHeight);
      const yBottom = yTop + rowHeight;
      ctx.beginPath();
      ctx.moveTo(col2XStandard, yTop);
      ctx.lineTo(col2XStandard, yBottom);
      ctx.stroke();
    });

    // Draw Vertical lines for Row 2 (3 columns)
    const r2Top = tableY + rowHeight;
    const r2Bottom = r2Top + rowHeight;
    ctx.beginPath();
    ctx.moveTo(col2XRow2, r2Top);
    ctx.lineTo(col2XRow2, r2Bottom);
    ctx.moveTo(col3XRow2, r2Top);
    ctx.lineTo(col3XRow2, r2Bottom);
    ctx.stroke();

    const getY = (rowIndex) => tableY + (rowIndex * rowHeight) + (rowHeight / 2);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';

    // ROW 1
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('T.C. Kimlik No', tableX + 24, getY(0));
    ctx.fillText(':', tableX + 380, getY(0));
    drawFittedValue(student.tcNo, tableX + 410, getY(0), 920, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Okulun Bulunduğu İlçe, İl', col2XStandard + 24, getY(0));
    ctx.fillText(':', col2XStandard + 480, getY(0));
    drawFittedValue(student.ilceIl || settings.ilceIl, col2XStandard + 510, getY(0), 1250, tableFontSizeBase, 'normal');

    // ROW 2
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Adı Soyadı', tableX + 24, getY(1));
    ctx.fillText(':', tableX + 240, getY(1));
    drawFittedValue(student.adiSoyadi, tableX + 270, getY(1), 850, tableFontSizeBase, 'bold');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Okul Numarası', col2XRow2 + 24, getY(1));
    ctx.fillText(':', col2XRow2 + 290, getY(1));
    drawFittedValue(student.okulNo, col2XRow2 + 320, getY(1), 660, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Numarası', col3XRow2 + 24, getY(1));
    ctx.fillText(':', col3XRow2 + 300, getY(1));
    drawFittedValue(student.belgeNo || settings.belgeNo, col3XRow2 + 330, getY(1), 660, tableFontSizeBase, 'normal');

    // ROW 3
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Baba Adı', tableX + 24, getY(2));
    ctx.fillText(':', tableX + 380, getY(2));
    drawFittedValue(student.babaAdi, tableX + 410, getY(2), 920, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Tarihi', col2XStandard + 24, getY(2));
    ctx.fillText(':', col2XStandard + 250, getY(2));
    drawFittedValue(student.belgeTarihi || settings.belgeTarihi, col2XStandard + 280, getY(2), 1480, tableFontSizeBase, 'normal');

    // ROW 4
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Ana Adı', tableX + 24, getY(3));
    ctx.fillText(':', tableX + 380, getY(3));
    drawFittedValue(student.anaAdi, tableX + 410, getY(3), 920, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Güvenlik No', col2XStandard + 24, getY(3));
    ctx.fillText(':', col2XStandard + 350, getY(3));
    drawFittedValue(student.belgeGuvenlikNo || settings.belgeGuvenlikNo, col2XStandard + 380, getY(3), 1380, tableFontSizeBase, 'normal');

    // ROW 5
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Doğum Yeri ve Tarihi', tableX + 24, getY(4));
    ctx.fillText(':', tableX + 380, getY(4));
    drawFittedValue(student.dogumYeriTarihi, tableX + 410, getY(4), 920, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Alanı/Dalı', col2XStandard + 24, getY(4));
    ctx.fillText(':', col2XStandard + 220, getY(4));
    drawFittedValue(student.alaniDali, col2XStandard + 250, getY(4), 1510, tableFontSizeBase, 'normal');

    // ROW 6
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belgeyi Veren Okul', tableX + 24, getY(5));
    ctx.fillText(':', tableX + 380, getY(5));
    drawFittedValue(student.verenOkul || settings.verenOkul, tableX + 410, getY(5), 2700, tableFontSizeBase, 'bold');

    // ROW 7
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Adı', tableX + 24, getY(6));
    ctx.fillText(':', tableX + 380, getY(6));
    drawFittedValue('Meslekî Eğitimde İş Sağlığı ve Güvenliği Eğitimi Katılım Belgesi', tableX + 410, getY(6), 2700, tableFontSizeBase, 'normal');

    // Description Paragraph (Sığmazsa alt satıra geçecek şekilde)
    const dersSaati = student.dersSaati || settings.dersSaati || '16';
    const dersSaatiYazi = student.dersSaatiYazi || settings.dersSaatiYazi || 'on altı';
    const tarihSon = student.belgeTarihi || settings.belgeTarihi || '..../..../20....';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `normal ${descFontSize}px ${fontFace}`;
    ctx.fillStyle = '#000000';

    const paraText = `Yukarıda bilgileri yer alan öğrenci,  ${dersSaati}  ( ${dersSaatiYazi} ) ders saati meslekî eğitimde iş sağlığı ve güvenliği eğitimini tamamladığı için bu belgeyi almaya hak kazanmıştır.  ${tarihSon}`;
    const maxDescWidth = tableWidth - 40;
    const descLines = wrapTextToLines(ctx, paraText, maxDescWidth);
    const descLineHeight = descFontSize * 1.35;
    const baseDescY = 1235;
    const startDescY = descLines.length === 1 ? baseDescY : baseDescY - ((descLines.length - 1) * descLineHeight) / 2;

    descLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startDescY + idx * descLineHeight);
    });

    // Signatures (Kompakt üst boşluk)
    const sigY = 1420;
    const leftX = 580;
    const rightX = width - 580;

    // Left Signer
    ctx.textAlign = 'center';
    ctx.font = `bold 36px ${fontFace}`;
    ctx.fillText('....................................', leftX, sigY);

    const mudurYrd = student.mudurYardimcisi || settings.mudurYardimcisi || '';
    if (mudurYrd) {
      ctx.font = `bold ${sigNameSize}px ${fontFace}`;
      ctx.fillText(mudurYrd, leftX, sigY + 62);
    }
    ctx.font = `normal ${sigTitleSize}px ${fontFace}`;
    ctx.fillText('Müdür Yardımcısı', leftX, sigY + (mudurYrd ? 124 : 70));

    // Right Signer
    ctx.font = `bold 36px ${fontFace}`;
    ctx.fillText('....................................', rightX, sigY);

    const mudur = student.mudur || settings.mudur || '';
    if (mudur) {
      ctx.font = `bold ${sigNameSize}px ${fontFace}`;
      ctx.fillText(mudur, rightX, sigY + 62);
    }
    ctx.font = `normal ${sigTitleSize}px ${fontFace}`;
    ctx.fillText('Müdür', rightX, sigY + (mudur ? 124 : 70));

  } else {
    // -------------------------------------------------------------
    // A4 DİKEY (PORTRAIT) DÜZENİ: 2480 x 3508 px
    // -------------------------------------------------------------
    const boxX = 140;
    const boxY = 80;
    const boxSize = 56;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    const logoWidth = 360;
    const logoHeight = 360;
    const logoX = (width - logoWidth) / 2;
    const logoY = 90;
    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${titleFontSize}px ${fontFace}`;
    ctx.fillText('KATILIM BELGESİ', width / 2, 530);

    const tableX = 160;
    const tableY = 620;
    const tableWidth = width - (tableX * 2);
    const rowHeight = 98;
    const totalRows = 7;
    const tableHeight = rowHeight * totalRows;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(tableX, tableY, tableWidth, tableHeight);

    for (let i = 1; i < totalRows; i++) {
      const y = tableY + (i * rowHeight);
      ctx.beginPath();
      ctx.moveTo(tableX, y);
      ctx.lineTo(tableX + tableWidth, y);
      ctx.stroke();
    }

    const col2XStandard = tableX + 920;
    const col2XRow2 = tableX + 780;
    const col3XRow2 = tableX + 1460;

    [0, 2, 3, 4].forEach(rowIndex => {
      const yTop = tableY + (rowIndex * rowHeight);
      const yBottom = yTop + rowHeight;
      ctx.beginPath();
      ctx.moveTo(col2XStandard, yTop);
      ctx.lineTo(col2XStandard, yBottom);
      ctx.stroke();
    });

    const r2Top = tableY + rowHeight;
    const r2Bottom = r2Top + rowHeight;
    ctx.beginPath();
    ctx.moveTo(col2XRow2, r2Top);
    ctx.lineTo(col2XRow2, r2Bottom);
    ctx.moveTo(col3XRow2, r2Top);
    ctx.lineTo(col3XRow2, r2Bottom);
    ctx.stroke();

    const getY = (rowIndex) => tableY + (rowIndex * rowHeight) + (rowHeight / 2);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';

    // Row 1
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('T.C. Kimlik No', tableX + 24, getY(0));
    ctx.fillText(':', tableX + 370, getY(0));
    drawFittedValue(student.tcNo, tableX + 395, getY(0), 510, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Okulun Bulunduğu İlçe, İl', col2XStandard + 24, getY(0));
    ctx.fillText(':', col2XStandard + 460, getY(0));
    drawFittedValue(student.ilceIl || settings.ilceIl, col2XStandard + 485, getY(0), 730, tableFontSizeBase, 'normal');

    // Row 2
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Adı Soyadı', tableX + 24, getY(1));
    ctx.fillText(':', tableX + 230, getY(1));
    drawFittedValue(student.adiSoyadi, tableX + 255, getY(1), 510, tableFontSizeBase, 'bold');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Okul Numarası', col2XRow2 + 24, getY(1));
    ctx.fillText(':', col2XRow2 + 270, getY(1));
    drawFittedValue(student.okulNo, col2XRow2 + 295, getY(1), 370, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Numarası', col3XRow2 + 24, getY(1));
    ctx.fillText(':', col3XRow2 + 280, getY(1));
    drawFittedValue(student.belgeNo || settings.belgeNo, col3XRow2 + 305, getY(1), 380, tableFontSizeBase, 'normal');

    // Row 3
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Baba Adı', tableX + 24, getY(2));
    ctx.fillText(':', tableX + 370, getY(2));
    drawFittedValue(student.babaAdi, tableX + 395, getY(2), 510, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Tarihi', col2XStandard + 24, getY(2));
    ctx.fillText(':', col2XStandard + 240, getY(2));
    drawFittedValue(student.belgeTarihi || settings.belgeTarihi, col2XStandard + 265, getY(2), 950, tableFontSizeBase, 'normal');

    // Row 4
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Ana Adı', tableX + 24, getY(3));
    ctx.fillText(':', tableX + 370, getY(3));
    drawFittedValue(student.anaAdi, tableX + 395, getY(3), 510, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Güvenlik No', col2XStandard + 24, getY(3));
    ctx.fillText(':', col2XStandard + 330, getY(3));
    drawFittedValue(student.belgeGuvenlikNo || settings.belgeGuvenlikNo, col2XStandard + 355, getY(3), 860, tableFontSizeBase, 'normal');

    // Row 5
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Doğum Yeri ve Tarihi', tableX + 24, getY(4));
    ctx.fillText(':', tableX + 370, getY(4));
    drawFittedValue(student.dogumYeriTarihi, tableX + 395, getY(4), 510, tableFontSizeBase, 'normal');

    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Alanı/Dalı', col2XStandard + 24, getY(4));
    ctx.fillText(':', col2XStandard + 210, getY(4));
    drawFittedValue(student.alaniDali, col2XStandard + 235, getY(4), 980, tableFontSizeBase, 'normal');

    // Row 6
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belgeyi Veren Okul', tableX + 24, getY(5));
    ctx.fillText(':', tableX + 370, getY(5));
    drawFittedValue(student.verenOkul || settings.verenOkul, tableX + 395, getY(5), 1740, tableFontSizeBase, 'bold');

    // Row 7
    ctx.font = `normal ${tableFontSizeBase}px ${fontFace}`;
    ctx.fillText('Belge Adı', tableX + 24, getY(6));
    ctx.fillText(':', tableX + 370, getY(6));
    drawFittedValue('Meslekî Eğitimde İş Sağlığı ve Güvenliği Eğitimi Katılım Belgesi', tableX + 395, getY(6), 1740, tableFontSizeBase, 'normal');

    // Description Paragraph (Tek satırda baştan sona)
    const dersSaati = student.dersSaati || settings.dersSaati || '16';
    const dersSaatiYazi = student.dersSaatiYazi || settings.dersSaatiYazi || 'on altı';
    const tarihSon = student.belgeTarihi || settings.belgeTarihi || '..../..../20....';

    // Description Paragraph (Sığmazsa alt satıra geçecek şekilde)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `normal ${descFontSize}px ${fontFace}`;
    ctx.fillStyle = '#000000';

    const paraText = `Yukarıda bilgileri yer alan öğrenci,  ${dersSaati}  ( ${dersSaatiYazi} ) ders saati meslekî eğitimde iş sağlığı ve güvenliği eğitimini tamamladığı için bu belgeyi almaya hak kazanmıştır.  ${tarihSon}`;
    const maxDescWidth = tableWidth - 30;
    const descLines = wrapTextToLines(ctx, paraText, maxDescWidth);
    const descLineHeight = descFontSize * 1.35;
    const baseDescY = 1400;
    const startDescY = descLines.length === 1 ? baseDescY : baseDescY - ((descLines.length - 1) * descLineHeight) / 2;

    descLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startDescY + idx * descLineHeight);
    });

    // Signatures (Kompakt üst boşluk)
    const sigY = 1580;
    const leftX = 420;
    const rightX = width - 480;

    ctx.textAlign = 'center';
    ctx.font = `bold 36px ${fontFace}`;
    ctx.fillText('....................................', leftX, sigY);

    const mudurYrd = student.mudurYardimcisi || settings.mudurYardimcisi || '';
    if (mudurYrd) {
      ctx.font = `bold ${sigNameSize}px ${fontFace}`;
      ctx.fillText(mudurYrd, leftX, sigY + 68);
    }
    ctx.font = `normal ${sigTitleSize}px ${fontFace}`;
    ctx.fillText('Müdür Yardımcısı', leftX, sigY + (mudurYrd ? 136 : 80));

    ctx.font = `bold 36px ${fontFace}`;
    ctx.fillText('....................................', rightX, sigY);

    const mudur = student.mudur || settings.mudur || '';
    if (mudur) {
      ctx.font = `bold ${sigNameSize}px ${fontFace}`;
      ctx.fillText(mudur, rightX, sigY + 68);
    }
    ctx.font = `normal ${sigTitleSize}px ${fontFace}`;
    ctx.fillText('Müdür', rightX, sigY + (mudur ? 136 : 80));
  }

  return canvas;
};

/**
 * Generate Single PDF (A4 Landscape or Portrait based on settings)
 */
export const downloadSinglePDF = async (student, settings) => {
  const canvas = await renderCertificateToCanvas(student, settings);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const isLandscape = (settings.orientation || 'landscape') === 'landscape';

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = isLandscape ? 297 : 210;
  const pdfHeight = isLandscape ? 210 : 297;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  const safeName = sanitizeFileName(student.adiSoyadi || 'Ogrenci');
  const filename = `ISG_Katilim_Belgesi_${safeName}.pdf`;
  pdf.save(filename);
  triggerConfetti();
  return filename;
};

/**
 * Generate Single High-Res PNG
 */
export const downloadSinglePNG = async (student, settings) => {
  const canvas = await renderCertificateToCanvas(student, settings);
  const safeName = sanitizeFileName(student.adiSoyadi || 'Ogrenci');
  const filename = `ISG_Katilim_Belgesi_${safeName}.png`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  triggerConfetti();
  return filename;
};

/**
 * Generate Multi-page Merged PDF (All Students in One PDF)
 */
export const downloadMergedPDF = async (students, settings, onProgress) => {
  if (!students || students.length === 0) return;
  const isLandscape = (settings.orientation || 'landscape') === 'landscape';

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = isLandscape ? 297 : 210;
  const pdfHeight = isLandscape ? 210 : 297;

  for (let i = 0; i < students.length; i++) {
    if (onProgress) {
      onProgress(i + 1, students.length);
    }
    const student = students[i];
    const canvas = await renderCertificateToCanvas(student, settings);
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i > 0) {
      pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait');
    }
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  const filename = `ISG_Toplu_Katilim_Belgeleri_${students.length}_Ogrenci.pdf`;
  pdf.save(filename);
  triggerConfetti();
  return filename;
};

/**
 * Generate ZIP with individual PDFs
 */
export const downloadZipPDFs = async (students, settings, onProgress) => {
  if (!students || students.length === 0) return;
  const isLandscape = (settings.orientation || 'landscape') === 'landscape';
  const pdfWidth = isLandscape ? 297 : 210;
  const pdfHeight = isLandscape ? 210 : 297;

  const zip = new JSZip();

  for (let i = 0; i < students.length; i++) {
    if (onProgress) {
      onProgress(i + 1, students.length);
    }
    const student = students[i];
    const canvas = await renderCertificateToCanvas(student, settings);
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    const pdfBlob = pdf.output('blob');

    const safeName = sanitizeFileName(student.adiSoyadi || `Ogrenci_${i + 1}`);
    const numPrefix = String(i + 1).padStart(2, '0');
    zip.file(`${numPrefix}_ISG_Belge_${safeName}.pdf`, pdfBlob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `ISG_Sertifikalar_ZIP_${students.length}_Ogrenci.zip`;
  link.click();
  triggerConfetti();
  return link.download;
};
