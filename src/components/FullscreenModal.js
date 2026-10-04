import React from 'react';
import { X, FileDown, Image } from 'lucide-react';
import templateImg from '../assets/sertifika.png';

export default function FullscreenModal({
  isOpen,
  onClose,
  data,
  settings,
  onDownloadPDF,
  onDownloadPNG
}) {
  if (!isOpen) return null;

  const {
    fullName = 'Ahmet Yılmaz',
    date = '04.10.2026',
    instructorName = '',
    certificateNo = '',
  } = data;

  const {
    namePosY = 67.2,
    namePosX = 50,
    nameFontSize = 34,
    fontFamily = 'Playfair Display',
    fontWeight = '700',
    nameColor = '#0f172a',
    isUppercase = false,

    datePosY = 86.8,
    datePosX = 13.8,
    dateFontSize = 14,
    dateFontWeight = '600',
    dateColor = '#1e293b',

    instructorPosY = 84.5,
    instructorPosX = 80.5,
    instructorFontSize = 14,
    instructorColor = '#1e293b',
    showInstructor = false,

    showCertNo = false,
    certNoPosY = 6.2,
    certNoPosX = 90.5,
    certNoFontSize = 11,
    certNoColor = '#64748b'
  } = settings;

  const fontStyleMap = {
    'Playfair Display': '"Playfair Display", Georgia, serif',
    'Cinzel': '"Cinzel", serif',
    'Cormorant Garamond': '"Cormorant Garamond", Georgia, serif',
    'Montserrat': '"Montserrat", sans-serif',
    'Inter': '"Inter", sans-serif',
  };

  const chosenFont = fontStyleMap[fontFamily] || '"Playfair Display", serif';
  const displayFullName = isUppercase
    ? (fullName || 'Katılımcı Adı Soyadı').toLocaleUpperCase('tr-TR')
    : (fullName || 'Katılımcı Adı Soyadı');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-slate-100">Tam Ekran Sertifika Önizleme</h3>
            <p className="text-xs text-slate-400">A4 Yatay Formatı (297 × 210 mm)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
            >
              <FileDown size={15} />
              <span>PDF İndir</span>
            </button>
            <button
              onClick={onDownloadPNG}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700 cursor-pointer"
            >
              <Image size={15} />
              <span>PNG İndir</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/40">
          <div
            className="relative select-none overflow-hidden bg-white shadow-2xl origin-center max-w-full"
            style={{
              width: '1000px',
              height: '707px',
              minWidth: '1000px',
              minHeight: '707px',
            }}
          >
            {/* Background Template Image */}
            <img
              src={templateImg}
              alt="Sertifika Şablonu"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />

            {/* Optional Certificate Number */}
            {showCertNo && certificateNo && (
              <div
                className="absolute font-mono uppercase tracking-wider font-semibold pointer-events-none leading-none"
                style={{
                  top: `${certNoPosY}%`,
                  left: `${certNoPosX}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${certNoFontSize}px`,
                  color: certNoColor,
                }}
              >
                No: {certificateNo}
              </div>
            )}

            {/* Full Name */}
            <div
              className="absolute text-center whitespace-nowrap pointer-events-none px-4 leading-none"
              style={{
                top: `${namePosY}%`,
                left: `${namePosX}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: chosenFont,
                fontSize: `${nameFontSize}px`,
                fontWeight: fontWeight,
                color: nameColor,
                maxWidth: '85%',
              }}
            >
              {displayFullName}
            </div>

            {/* Date */}
            <div
              className="absolute whitespace-nowrap pointer-events-none flex items-center leading-none"
              style={{
                top: `${datePosY}%`,
                left: `${datePosX}%`,
                transform: 'translate(0, -50%)',
                fontSize: `${dateFontSize}px`,
                fontWeight: dateFontWeight,
                color: dateColor,
                fontFamily: chosenFont,
              }}
            >
              {date || '04.10.2026'}
            </div>

            {/* Instructor Name */}
            {showInstructor && instructorName && (
              <div
                className="absolute text-center whitespace-nowrap pointer-events-none font-medium leading-none"
                style={{
                  top: `${instructorPosY}%`,
                  left: `${instructorPosX}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${instructorFontSize}px`,
                  color: instructorColor,
                  fontFamily: chosenFont,
                }}
              >
                {instructorName}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
