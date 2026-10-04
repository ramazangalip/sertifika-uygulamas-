import React, { forwardRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import templateImg from '../assets/sertifika.png';

const CertificatePreview = forwardRef(({
  data,
  settings,
  zoomLevel,
  setZoomLevel,
  onResetZoom,
  onOpenFullscreen
}, ref) => {
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
    <div className="flex flex-col h-full items-center justify-center relative">
      {/* Top Floating Controls Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-3 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Canlı Önizleme (A4 Yatay 297×210 mm)
          </span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-slate-400">
            Ölçek: <strong className="text-slate-200">{zoomLevel}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(40, prev - 10))}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            title="Küçült"
          >
            <ZoomOut size={15} />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            className="px-2 py-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors font-medium text-[11px]"
            title="Sığdır"
          >
            Sığdır
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            title="Büyüt"
          >
            <ZoomIn size={15} />
          </button>
          <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={onOpenFullscreen}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            title="Tam Ekran İncele"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Certificate Outer Container with Responsive Scroll & Zoom */}
      <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl relative">
        <div 
          className="transition-transform duration-150 origin-center max-w-full flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* 
            LIVE PREVIEW CONTAINER
            A4 landscape ratio 1000px x 707px
          */}
          <div
            ref={ref}
            id="certificate-preview-container"
            className="relative select-none overflow-hidden bg-white shadow-2xl"
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

            {/* Optional Certificate Number (Top Right) */}
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

            {/* PARTICIPANT FULL NAME */}
            <div
              className="absolute text-center whitespace-nowrap pointer-events-none transition-all duration-75 px-4 leading-none"
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

            {/* DATE */}
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
              <span>{date || '04.10.2026'}</span>
            </div>

            {/* OPTIONAL INSTRUCTOR / SIGNER NAME */}
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

      {/* Footer Info Notice */}
      <div className="w-full text-center mt-2 text-[11px] text-slate-500">
        💡 İpucu: İndirilen PDF ve PNG dosyaları <span className="text-amber-400 font-medium">300+ DPI yüksek çözünürlüklü A4 baskı standardında</span> doğrudan oluşturulur.
      </div>
    </div>
  );
});

CertificatePreview.displayName = 'CertificatePreview';

export default CertificatePreview;
