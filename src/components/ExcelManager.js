import React, { useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Users,
  Search,
  Trash2,
  Plus,
  FileDown,
  Archive,
  Loader2
} from 'lucide-react';
import { downloadExcelTemplate, parseExcelFile } from '../utils/excelHelper';

export default function ExcelManager({
  students,
  setStudents,
  activeStudentIndex,
  setActiveStudentIndex,
  onBatchDownloadMerged,
  onBatchDownloadZip,
  isBatchDownloading,
  progressInfo,
  onShowToast
}) {
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Filter students based on search
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.adiSoyadi && s.adiSoyadi.toLowerCase().includes(q)) ||
      (s.tcNo && s.tcNo.includes(q)) ||
      (s.okulNo && s.okulNo.includes(q)) ||
      (s.alaniDali && s.alaniDali.toLowerCase().includes(q))
    );
  });

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsLoadingFile(true);
      const parsed = await parseExcelFile(file);
      if (parsed.length === 0) {
        onShowToast('Excel dosyasında öğrenci kaydı bulunamadı.', 'error');
        return;
      }
      setStudents(parsed);
      setActiveStudentIndex(0);
      onShowToast(`${parsed.length} öğrenci Excel'den başarıyla yüklendi!`, 'success');
    } catch (err) {
      console.error(err);
      onShowToast(err.message || 'Excel dosyası okunurken hata oluştu.', 'error');
    } finally {
      setIsLoadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteStudent = (index, e) => {
    e.stopPropagation();
    if (students.length <= 1) {
      onShowToast('Listede en az bir öğrenci bulunmalıdır.', 'info');
      return;
    }
    const updated = students.filter((_, idx) => idx !== index);
    setStudents(updated);
    if (activeStudentIndex >= updated.length) {
      setActiveStudentIndex(updated.length - 1);
    }
    onShowToast('Öğrenci listeden silindi.', 'info');
  };

  const handleAddNewStudent = () => {
    const newStudent = {
      id: students.length + 1,
      tcNo: '10000000000',
      adiSoyadi: 'Yeni Katılımcı',
      okulNo: '1001',
      babaAdi: '',
      anaAdi: '',
      dogumYeriTarihi: '',
      alaniDali: '',
      belgeNo: '',
      belgeTarihi: '',
      belgeGuvenlikNo: '',
      ilceIl: '',
      verenOkul: '',
      dersSaati: '16',
      dersSaatiYazi: 'on altı'
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    setActiveStudentIndex(updated.length - 1);
    onShowToast('Yeni öğrenci eklendi.', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Excel Actions Header Box */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Download Template Button */}
        <button
          type="button"
          onClick={downloadExcelTemplate}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 font-semibold text-xs transition-all shadow-md group"
          title="Örnek sütunları içeren hazır Excel şablonunu indirin"
        >
          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
          <span>Excel Şablonu İndir</span>
        </button>

        {/* Upload Excel Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoadingFile}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-700/60 font-semibold text-xs transition-all shadow-md group cursor-pointer disabled:opacity-50"
        >
          {isLoadingFile ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          )}
          <span>Excel Dosyası Yükle</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-sky-400 bg-sky-500/10 scale-[1.01]'
            : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40'
        }`}
      >
        <FileSpreadsheet className={`mx-auto mb-2 ${isDragging ? 'text-sky-400' : 'text-slate-400'}`} size={28} />
        <div className="text-xs font-semibold text-slate-200">
          Excel Dosyanızı Buraya Sürükleyin veya Tıklayın
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          .xlsx veya .xls formatı • Tüm sütunlar otomatik algılanır
        </div>
      </div>

      {/* Bulk Download Section */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={14} className="text-amber-400" />
            Toplu Çıktı Alma ({students.length} Kişi)
          </span>
          {isBatchDownloading && progressInfo && (
            <span className="text-[11px] font-mono text-amber-400">
              {progressInfo.current} / {progressInfo.total}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {isBatchDownloading && progressInfo && (
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-150"
              style={{ width: `${(progressInfo.current / progressInfo.total) * 100}%` }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* Multi-page Merged PDF (Ideal for School Printing) */}
          <button
            type="button"
            disabled={isBatchDownloading || students.length === 0}
            onClick={onBatchDownloadMerged}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
            title="Tüm öğrencileri tek bir PDF dosyasında sayfalar halinde birleştirir"
          >
            {isBatchDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileDown size={15} />
            )}
            <span>Tümünü Tek PDF Yap</span>
          </button>

          {/* ZIP Archive */}
          <button
            type="button"
            disabled={isBatchDownloading || students.length === 0}
            onClick={onBatchDownloadZip}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all disabled:opacity-50"
            title="Her öğrenci için ayrı PDF oluşturup ZIP paketi olarak indirir"
          >
            <Archive size={15} className="text-sky-400" />
            <span>Ayrı PDF'ler (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Student List & Search Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 mr-2">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Öğrenci Adı veya TC ile Ara..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddNewStudent}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors shrink-0"
          >
            <Plus size={13} />
            <span>Ekle</span>
          </button>
        </div>

        {/* Scrollable Student List */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              Aramaya uygun öğrenci bulunamadı.
            </div>
          ) : (
            filteredStudents.map((st) => {
              const originalIndex = students.indexOf(st);
              const isActive = originalIndex === activeStudentIndex;

              return (
                <div
                  key={originalIndex}
                  onClick={() => setActiveStudentIndex(originalIndex)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-sky-500/15 border-sky-500/60 text-white ring-1 ring-sky-500/30'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {originalIndex + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold truncate">{st.adiSoyadi || 'İsimsiz'}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 font-mono">
                        <span>TC: {st.tcNo || '-'}</span>
                        <span>No: {st.okulNo || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isActive && (
                      <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-medium">
                        Önizleniyor
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteStudent(originalIndex, e)}
                      className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Öğrenciyi Sil"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
