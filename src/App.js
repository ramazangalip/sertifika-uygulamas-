import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import Navbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import CertificatePreview from './components/CertificatePreview';
import FullscreenModal from './components/FullscreenModal';
import {
  downloadCertificatePDF,
  downloadCertificatePNG,
  createCertificateCanvas,
  sanitizeFileName,
  triggerConfetti,
  formatTurkishDate,
  getTodayDateInput
} from './utils/helpers';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

const DEFAULT_SETTINGS = {
  // Participant Name Position & Typography
  namePosY: 67.2,
  namePosX: 50,
  nameFontSize: 34,
  fontFamily: 'Playfair Display',
  fontWeight: '700',
  nameColor: '#0f172a',
  isUppercase: false,

  // Date Position & Typography
  datePosY: 86.8,
  datePosX: 13.8,
  dateFontSize: 14,
  dateFontWeight: '600',
  dateColor: '#1e293b',

  // Instructor Info
  instructorPosY: 84.5,
  instructorPosX: 80.5,
  instructorFontSize: 14,
  instructorColor: '#1e293b',
  showInstructor: false,

  // Certificate No
  showCertNo: false,
  certNoPosY: 6.2,
  certNoPosX: 90.5,
  certNoFontSize: 11,
  certNoColor: '#64748b'
};

const DEFAULT_DATA = {
  fullName: 'Ahmet Yılmaz',
  rawDate: getTodayDateInput(),
  date: formatTurkishDate(getTodayDateInput()),
  instructorName: 'Mehmet Özkan (İSG Uzmanı)',
  certificateNo: 'İSG-2026-08492'
};

export default function App() {
  const certificateRef = useRef(null);
  const [data, setData] = useState(DEFAULT_DATA);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  // UI & Zoom state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState(null); // 'pdf' | 'png' | 'batch-pdf'
  const [toast, setToast] = useState(null);

  // Batch Generation State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchList, setBatchList] = useState([
    'Ahmet Yılmaz',
    'Ayşe Demir',
    'Mustafa Kemal Öztürk',
    'Zeynep Şahin',
    'Caner Gülşen'
  ]);
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);

  // Show Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Calculate default responsive zoom
  const calculateDefaultZoom = () => {
    if (typeof window === 'undefined') return 100;
    const width = window.innerWidth;
    if (width < 640) return 35;
    if (width < 1024) return 55;
    if (width < 1440) return 75;
    return 90;
  };

  useEffect(() => {
    setZoomLevel(calculateDefaultZoom());
  }, []);

  // Single PDF Download (Uses native Canvas 2D engine)
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      setDownloadType('pdf');
      const filename = await downloadCertificatePDF(data, settings, 2);
      showToast(`${filename} başarıyla oluşturuldu ve indirildi!`, 'success');
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      showToast('PDF oluşturulurken bir hata oluştu.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  // Single PNG Download (Uses native Canvas 2D engine)
  const handleDownloadPNG = async () => {
    try {
      setIsDownloading(true);
      setDownloadType('png');
      const filename = await downloadCertificatePNG(data, settings, 2);
      showToast(`${filename} yüksek çözünürlükte indirildi!`, 'success');
    } catch (error) {
      console.error('PNG indirme hatası:', error);
      showToast('PNG oluşturulurken bir hata oluştu.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  // Batch ZIP Download
  const handleBatchDownload = async (type = 'pdf') => {
    const validNames = batchList.map(n => n.trim()).filter(n => n.length > 0);
    if (validNames.length === 0) {
      showToast('Lütfen en az bir katılımcı adı girin.', 'error');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadType('batch-pdf');
      const zip = new JSZip();

      for (let i = 0; i < validNames.length; i++) {
        const participantName = validNames[i];
        const participantData = {
          ...data,
          fullName: participantName
        };
        
        const canvas = await createCertificateCanvas(participantData, settings, 2);
        const safeName = sanitizeFileName(participantName);

        if (type === 'pdf') {
          const imgData = canvas.toDataURL('image/png', 1.0);
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: true,
          });
          pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
          const pdfBlob = pdf.output('blob');
          zip.file(`${i + 1}_ISG_Sertifika_${safeName}.pdf`, pdfBlob);
        } else {
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`${i + 1}_ISG_Sertifika_${safeName}.png`, base64Data, { base64: true });
        }
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `ISG_Toplu_Sertifikalar_${validNames.length}_Kisi.zip`;
      link.click();

      triggerConfetti();
      showToast(`${validNames.length} adet sertifika ZIP paketi olarak indirildi!`, 'success');
    } catch (error) {
      console.error('Toplu indirme hatası:', error);
      showToast('Toplu sertifika oluşturulurken bir hata meydana geldi.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  // Reset Sliders
  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    showToast('Konum ve tipografi ayarları varsayılana döndürüldü.', 'info');
  };

  // Reset All
  const handleResetAll = () => {
    setData({
      fullName: '',
      rawDate: getTodayDateInput(),
      date: formatTurkishDate(getTodayDateInput()),
      instructorName: '',
      certificateNo: ''
    });
    setSettings(DEFAULT_SETTINGS);
    showToast('Tüm form ve ayarlar sıfırlandı.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 font-sans selection:bg-sky-500/30">
      {/* Navbar Header */}
      <Navbar />

      {/* Main App Workspace (2 Column Responsive Layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Form & Settings Control Panel */}
        <section className="w-full lg:w-[420px] xl:w-[450px] shrink-0 h-[620px] lg:h-[calc(100vh-130px)] sticky top-20">
          <ControlPanel
            data={data}
            onChangeData={setData}
            settings={settings}
            onChangeSettings={setSettings}
            onResetSettings={handleResetSettings}
            onResetAll={handleResetAll}
            onDownloadPDF={handleDownloadPDF}
            onDownloadPNG={handleDownloadPNG}
            onBatchDownload={handleBatchDownload}
            isDownloading={isDownloading}
            downloadType={downloadType}
            batchList={batchList}
            setBatchList={setBatchList}
            activeBatchIndex={activeBatchIndex}
            setActiveBatchIndex={setActiveBatchIndex}
            isBatchMode={isBatchMode}
            setIsBatchMode={setIsBatchMode}
          />
        </section>

        {/* Right Column: High Fidelity Live Certificate Preview */}
        <section className="flex-1 flex flex-col min-h-[500px] lg:h-[calc(100vh-130px)]">
          <CertificatePreview
            ref={certificateRef}
            data={data}
            settings={settings}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onResetZoom={() => setZoomLevel(calculateDefaultZoom())}
            onOpenFullscreen={() => setIsFullscreen(true)}
          />
        </section>
      </main>

      {/* Fullscreen Modal View */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        data={data}
        settings={settings}
        onDownloadPDF={handleDownloadPDF}
        onDownloadPNG={handleDownloadPNG}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-lg ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800/80 text-rose-200'
              : toast.type === 'info'
              ? 'bg-slate-900/90 border-slate-700 text-slate-200'
              : 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
