import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import A4CertificateView from './components/A4CertificateView';
import {
  downloadSinglePDF,
  downloadSinglePNG,
  downloadMergedPDF,
  downloadZipPDFs
} from './utils/certificateRenderer';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  X,
  FileDown,
  Image,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const INITIAL_SETTINGS = {
  orientation: 'landscape', // Default: A4 Yatay
  verenOkul: 'Mesleki ve Teknik Anadolu Lisesi',
  ilceIl: 'Çankaya / ANKARA',
  belgeNo: '2026/0412',
  belgeTarihi: '12.10.2026',
  belgeGuvenlikNo: 'TR-89241',
  dersSaati: '16',
  dersSaatiYazi: 'on altı',
  mudurYardimcisi: 'Ali Kaya',
  mudur: 'Hasan Demir'
};

const INITIAL_STUDENTS = [
  {
    id: 1,
    tcNo: '12345678901',
    adiSoyadi: 'Ahmet Yılmaz',
    okulNo: '1042',
    babaAdi: 'Mehmet',
    anaAdi: 'Fatma',
    dogumYeriTarihi: 'Ankara - 15.04.2008',
    alaniDali: 'Bilişim Teknolojileri / Yazılım',
    belgeNo: '2026/0412',
    belgeTarihi: '12.10.2026',
    belgeGuvenlikNo: 'TR-89241',
    ilceIl: 'Çankaya / ANKARA',
    verenOkul: 'Mesleki ve Teknik Anadolu Lisesi',
    dersSaati: '16',
    dersSaatiYazi: 'on altı',
    mudurYardimcisi: 'Ali Kaya',
    mudur: 'Hasan Demir'
  },
  {
    id: 2,
    tcNo: '98765432109',
    adiSoyadi: 'Zeynep Kaya',
    okulNo: '1088',
    babaAdi: 'Mustafa',
    anaAdi: 'Emine',
    dogumYeriTarihi: 'İstanbul - 22.09.2008',
    alaniDali: 'Elektrik-Elektronik Teknolojisi',
    belgeNo: '2026/0413',
    belgeTarihi: '12.10.2026',
    belgeGuvenlikNo: 'TR-89242',
    ilceIl: 'Çankaya / ANKARA',
    verenOkul: 'Mesleki ve Teknik Anadolu Lisesi',
    dersSaati: '16',
    dersSaatiYazi: 'on altı',
    mudurYardimcisi: 'Ali Kaya',
    mudur: 'Hasan Demir'
  }
];

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [activeStudentIndex, setActiveStudentIndex] = useState(0);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const previewContainerRef = useRef(null);
  const [zoomScale, setZoomScale] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState(null);
  const [progressInfo, setProgressInfo] = useState(null);
  const [toast, setToast] = useState(null);

  const currentStudent = students[activeStudentIndex] || students[0] || {};
  const isLandscape = (settings.orientation || 'landscape') === 'landscape';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Calculate perfect auto-fit scale based on available container dimensions
  const calculateAutoFitScale = useCallback(() => {
    if (!previewContainerRef.current) return 0.7;
    const { clientWidth, clientHeight } = previewContainerRef.current;
    const baseW = isLandscape ? 1123 : 794;
    const baseH = isLandscape ? 794 : 1123;
    const availW = Math.max(300, clientWidth - 48);
    const availH = Math.max(300, clientHeight - 48);

    const scaleW = availW / baseW;
    const scaleH = availH / baseH;
    const fit = Math.min(scaleW, scaleH, 1.1);
    return Math.max(0.28, Math.round(fit * 100) / 100);
  }, [isLandscape]);

  // Update scale on mount, resize, or orientation change
  useEffect(() => {
    const timer = setTimeout(() => {
      setZoomScale(calculateAutoFitScale());
    }, 50);

    const handleResize = () => {
      setZoomScale(calculateAutoFitScale());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateAutoFitScale, settings.orientation]);

  const handleUpdateCurrentStudent = (updated) => {
    const list = [...students];
    list[activeStudentIndex] = updated;
    setStudents(list);
  };

  const handleResetStudent = () => {
    const resetData = {
      ...currentStudent,
      tcNo: '',
      adiSoyadi: '',
      okulNo: '',
      babaAdi: '',
      anaAdi: '',
      dogumYeriTarihi: '',
      alaniDali: ''
    };
    handleUpdateCurrentStudent(resetData);
    showToast('Öğrenci formu temizlendi.', 'info');
  };

  // 1. Single PDF Download
  const handleDownloadSinglePDF = async () => {
    try {
      setIsDownloading(true);
      setDownloadType('single-pdf');
      const filename = await downloadSinglePDF(currentStudent, settings);
      showToast(`${filename} başarıyla oluşturuldu ve indirildi!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('PDF oluşturulurken bir hata meydana geldi.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  // 2. Single PNG Download
  const handleDownloadSinglePNG = async () => {
    try {
      setIsDownloading(true);
      setDownloadType('single-png');
      const filename = await downloadSinglePNG(currentStudent, settings);
      showToast(`${filename} yüksek çözünürlükte indirildi!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('PNG oluşturulurken bir hata meydana geldi.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  // 3. Merged Multi-page PDF
  const handleBatchDownloadMerged = async () => {
    if (students.length === 0) return;
    try {
      setIsDownloading(true);
      setDownloadType('batch-merged');
      setProgressInfo({ current: 0, total: students.length });

      await downloadMergedPDF(students, settings, (cur, total) => {
        setProgressInfo({ current: cur, total });
      });

      showToast(`${students.length} öğrencinin sertifikası tek bir PDF dosyasında birleştirilerek indirildi!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Toplu PDF oluşturulurken hata meydana geldi.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
      setProgressInfo(null);
    }
  };

  // 4. Batch ZIP Download
  const handleBatchDownloadZip = async () => {
    if (students.length === 0) return;
    try {
      setIsDownloading(true);
      setDownloadType('batch-zip');
      setProgressInfo({ current: 0, total: students.length });

      await downloadZipPDFs(students, settings, (cur, total) => {
        setProgressInfo({ current: cur, total });
      });

      showToast(`${students.length} adet PDF sertifika ZIP paketi olarak indirildi!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('ZIP paketi oluşturulurken hata meydana geldi.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
      setProgressInfo(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans selection:bg-red-500/30">
      {/* Navbar Header */}
      <Navbar />

      {/* Main Workspace (Wide Container) */}
      <main className="flex-1 max-w-[1640px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5">
        {/* Left Column: Form & Settings Control Panel */}
        <section className="w-full lg:w-[410px] xl:w-[430px] shrink-0 h-[660px] lg:h-[calc(100vh-100px)] sticky top-20">
          <ControlPanel
            student={currentStudent}
            onChangeStudent={handleUpdateCurrentStudent}
            settings={settings}
            onChangeSettings={setSettings}
            students={students}
            setStudents={setStudents}
            activeStudentIndex={activeStudentIndex}
            setActiveStudentIndex={setActiveStudentIndex}
            onDownloadSinglePDF={handleDownloadSinglePDF}
            onDownloadSinglePNG={handleDownloadSinglePNG}
            onBatchDownloadMerged={handleBatchDownloadMerged}
            onBatchDownloadZip={handleBatchDownloadZip}
            isDownloading={isDownloading}
            downloadType={downloadType}
            progressInfo={progressInfo}
            onShowToast={showToast}
            onResetStudent={handleResetStudent}
          />
        </section>

        {/* Right Column: High Fidelity Certificate View */}
        <section className="flex-1 flex flex-col min-h-[550px] lg:h-[calc(100vh-100px)] min-w-0">
          {/* Top Bar for View Controls */}
          <div className="w-full flex items-center justify-between pb-2.5 px-1 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                <span>A4 {isLandscape ? 'Yatay (297×210 mm)' : 'Dikey (210×297 mm)'}</span>
              </span>
              <span className="hidden sm:inline-block text-slate-500">|</span>
              <span className="hidden sm:inline-block text-slate-400">
                Öğrenci: <strong className="text-slate-200">{activeStudentIndex + 1} / {students.length}</strong>
              </span>
              <span className="hidden md:inline-block text-slate-500">|</span>
              <span className="hidden md:inline-block text-slate-400 font-mono text-[11px]">
                Ölçek: {Math.round(zoomScale * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg">
              {/* Prev / Next Student Buttons */}
              <button
                type="button"
                disabled={activeStudentIndex === 0}
                onClick={() => setActiveStudentIndex(prev => Math.max(0, prev - 1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors disabled:opacity-30"
                title="Önceki Öğrenci"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={activeStudentIndex === students.length - 1}
                onClick={() => setActiveStudentIndex(prev => Math.min(students.length - 1, prev + 1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors disabled:opacity-30"
                title="Sonraki Öğrenci"
              >
                <ChevronRight size={16} />
              </button>
              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              {/* Zoom Buttons */}
              <button
                type="button"
                onClick={() => setZoomScale(prev => Math.max(0.3, prev - 0.08))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Küçült"
              >
                <ZoomOut size={15} />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(calculateAutoFitScale())}
                className="px-2 py-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors font-medium text-[11px]"
                title="Tam Ekrana Sığdır"
              >
                Sığdır
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(prev => Math.min(1.4, prev + 0.08))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Büyüt"
              >
                <ZoomIn size={15} />
              </button>
              <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Tam Ekran İncele"
              >
                <Maximize2 size={15} />
              </button>
            </div>
          </div>

          {/* Certificate Responsive Card Container */}
          <div
            ref={previewContainerRef}
            className="w-full flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-2xl relative"
          >
            <A4CertificateView
              student={currentStudent}
              settings={settings}
              scale={zoomScale}
            />
          </div>

          {/* Footer Quality Note */}
          <div className="w-full text-center mt-2 text-[11px] text-slate-500">
            🏛️ Resmi MEB formatı • {isLandscape ? 'A4 Yatay (297×210 mm)' : 'A4 Dikey (210×297 mm)'} • Çıktılar <span className="text-emerald-400 font-medium">300 DPI baskı kalitesinde</span> oluşturulur.
          </div>
        </section>
      </main>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/70">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  Tam Ekran Önizleme ({currentStudent.adiSoyadi || 'Katılımcı'})
                </h3>
                <p className="text-[11px] text-slate-400">
                  A4 {isLandscape ? 'Yatay (297×210 mm)' : 'Dikey (210×297 mm)'} Resmi MEB Katılım Belgesi
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSinglePDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  <FileDown size={14} />
                  <span>PDF İndir</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSinglePNG}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <Image size={14} />
                  <span>PNG İndir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Certificate View */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/40">
              <A4CertificateView
                student={currentStudent}
                settings={settings}
                scale={isLandscape ? 0.9 : 0.85}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
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
