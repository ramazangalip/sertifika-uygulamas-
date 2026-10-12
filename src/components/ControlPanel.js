import React, { useState } from 'react';
import {
  User,
  School,
  FileSpreadsheet,
  FileDown,
  Image,
  RotateCcw,
  Loader2,
  Clock,
  Layout
} from 'lucide-react';
import ExcelManager from './ExcelManager';

const numberToTurkishWords = (val) => {
  const n = parseInt(val, 10);
  if (isNaN(n)) return '';
  const ones = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
  const tens = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
  if (n === 0) return 'sıfır';
  if (n < 10) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return `${tens[t]}${o > 0 ? ' ' + ones[o] : ''}`.trim();
  }
  return String(val);
};

export default function ControlPanel({
  student,
  onChangeStudent,
  settings,
  onChangeSettings,
  students,
  setStudents,
  activeStudentIndex,
  setActiveStudentIndex,
  onDownloadSinglePDF,
  onDownloadSinglePNG,
  onBatchDownloadMerged,
  onBatchDownloadZip,
  isDownloading,
  downloadType,
  progressInfo,
  onShowToast,
  onResetStudent
}) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'excel' | 'school'

  // Training hour change handler with auto Turkish words generator
  const handleDersSaatiChange = (newHours) => {
    const words = numberToTurkishWords(newHours) || student.dersSaatiYazi;
    onChangeStudent({
      ...student,
      dersSaati: newHours,
      dersSaatiYazi: words
    });
    onChangeSettings({
      ...settings,
      dersSaati: newHours,
      dersSaatiYazi: words
    });
  };

  const handleApplyHoursToAll = () => {
    const h = student.dersSaati || settings.dersSaati || '16';
    const w = student.dersSaatiYazi || settings.dersSaatiYazi || 'on altı';
    const updatedList = students.map(s => ({
      ...s,
      dersSaati: h,
      dersSaatiYazi: w
    }));
    setStudents(updatedList);
    onChangeSettings({ ...settings, dersSaati: h, dersSaatiYazi: w });
    onShowToast(`${students.length} öğrencinin tümüne "${h} (${w})" eğitim saati uygulandı.`, 'success');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Top Orientation Mode Selector (Yatay vs Dikey) */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 pl-1">
          <Layout size={13} className="text-sky-400" />
          <span>Sayfa Yönü:</span>
        </span>
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, orientation: 'landscape' })}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              (settings.orientation || 'landscape') === 'landscape'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yatay (A4)
          </button>
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, orientation: 'portrait' })}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              settings.orientation === 'portrait'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dikey (A4)
          </button>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1">
        {/* Student Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'student'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <User size={14} />
          <span>Öğrenci</span>
        </button>

        {/* Excel Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('excel')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'excel'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileSpreadsheet size={14} />
          <span>Toplu Excel</span>
          {students.length > 1 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {students.length}
            </span>
          )}
        </button>

        {/* School & Certificate Settings Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('school')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'school'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <School size={14} />
          <span>Okul / Belge</span>
        </button>
      </div>

      {/* Main Tab Scroll Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* TAB 1: ÖĞRENCİ BİLGİLERİ */}
        {activeTab === 'student' && (
          <div className="space-y-3.5">
            {/* Student Pagination / Selector Info */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400">
                Öğrenci: <strong className="text-slate-200">{activeStudentIndex + 1} / {students.length}</strong>
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={activeStudentIndex === 0}
                  onClick={() => setActiveStudentIndex(prev => Math.max(0, prev - 1))}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 text-[11px]"
                >
                  ← Önceki
                </button>
                <button
                  type="button"
                  disabled={activeStudentIndex === students.length - 1}
                  onClick={() => setActiveStudentIndex(prev => Math.min(students.length - 1, prev + 1))}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 text-[11px]"
                >
                  Sonraki →
                </button>
              </div>
            </div>

            {/* EĞİTİM SAATİ AYARI (Öğrenci Panelinde Doğrudan Değiştirilebilir) */}
            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} className="text-sky-400" />
                  <span>Eğitim Saati (Ders Saati)</span>
                </label>
                <button
                  type="button"
                  onClick={handleApplyHoursToAll}
                  className="text-[10px] text-sky-300 hover:text-white bg-sky-900/60 hover:bg-sky-800 px-2 py-0.5 rounded font-medium transition-colors"
                  title="Bu eğitim saatini listedeki tüm öğrencilere uygula"
                >
                  Tümüne Uygula
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Sayı Olarak</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={student.dersSaati || settings.dersSaati || '16'}
                    onChange={(e) => handleDersSaatiChange(e.target.value)}
                    placeholder="16"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Yazıyla</label>
                  <input
                    type="text"
                    value={student.dersSaatiYazi || settings.dersSaatiYazi || 'on altı'}
                    onChange={(e) => {
                      onChangeStudent({ ...student, dersSaatiYazi: e.target.value });
                      onChangeSettings({ ...settings, dersSaatiYazi: e.target.value });
                    }}
                    placeholder="on altı"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Quick Hours Presets */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400">Hızlı Seç:</span>
                {[8, 16, 24, 32, 40].map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleDersSaatiChange(String(hour))}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      String(student.dersSaati || settings.dersSaati) === String(hour)
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {hour} Saat
                  </button>
                ))}
              </div>
            </div>

            {/* Adı Soyadı */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Adı Soyadı <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={student.adiSoyadi || ''}
                onChange={(e) => onChangeStudent({ ...student, adiSoyadi: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs font-semibold outline-none transition-all"
              />
            </div>

            {/* T.C. Kimlik No & Okul No */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  T.C. Kimlik No
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={student.tcNo || ''}
                  onChange={(e) => onChangeStudent({ ...student, tcNo: e.target.value })}
                  placeholder="11 Haneli TC"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Okul Numarası
                </label>
                <input
                  type="text"
                  value={student.okulNo || ''}
                  onChange={(e) => onChangeStudent({ ...student, okulNo: e.target.value })}
                  placeholder="Örn: 1042"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono outline-none"
                />
              </div>
            </div>

            {/* Alanı / Dalı */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Alanı / Dalı
              </label>
              <input
                type="text"
                value={student.alaniDali || ''}
                onChange={(e) => onChangeStudent({ ...student, alaniDali: e.target.value })}
                placeholder="Örn: Bilişim Teknolojileri / Yazılım"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
              />
            </div>

            {/* Baba Adı & Ana Adı */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Baba Adı
                </label>
                <input
                  type="text"
                  value={student.babaAdi || ''}
                  onChange={(e) => onChangeStudent({ ...student, babaAdi: e.target.value })}
                  placeholder="Baba Adı"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Ana Adı
                </label>
                <input
                  type="text"
                  value={student.anaAdi || ''}
                  onChange={(e) => onChangeStudent({ ...student, anaAdi: e.target.value })}
                  placeholder="Ana Adı"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
                />
              </div>
            </div>

            {/* Doğum Yeri ve Tarihi */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Doğum Yeri ve Tarihi
              </label>
              <input
                type="text"
                value={student.dogumYeriTarihi || ''}
                onChange={(e) => onChangeStudent({ ...student, dogumYeriTarihi: e.target.value })}
                placeholder="Örn: Ankara - 15.04.2008"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
              />
            </div>

            {/* Öğrenciye Özel Belge No & Güvenlik No */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Belge No
                </label>
                <input
                  type="text"
                  value={student.belgeNo || ''}
                  onChange={(e) => onChangeStudent({ ...student, belgeNo: e.target.value })}
                  placeholder={settings.belgeNo || '2026/0412'}
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Güvenlik No
                </label>
                <input
                  type="text"
                  value={student.belgeGuvenlikNo || ''}
                  onChange={(e) => onChangeStudent({ ...student, belgeGuvenlikNo: e.target.value })}
                  placeholder={settings.belgeGuvenlikNo || 'TR-89241'}
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOPLU EXCEL YÖNETİMİ */}
        {activeTab === 'excel' && (
          <ExcelManager
            students={students}
            setStudents={setStudents}
            activeStudentIndex={activeStudentIndex}
            setActiveStudentIndex={setActiveStudentIndex}
            onBatchDownloadMerged={onBatchDownloadMerged}
            onBatchDownloadZip={onBatchDownloadZip}
            isBatchDownloading={isDownloading && downloadType?.startsWith('batch')}
            progressInfo={progressInfo}
            onShowToast={onShowToast}
          />
        )}

        {/* TAB 3: OKUL & BELGE GENEL AYARLARI */}
        {activeTab === 'school' && (
          <div className="space-y-3.5">
            {/* Belgeyi Veren Okul */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Belgeyi Veren Okul
              </label>
              <input
                type="text"
                value={settings.verenOkul || ''}
                onChange={(e) => onChangeSettings({ ...settings, verenOkul: e.target.value })}
                placeholder="Mesleki ve Teknik Anadolu Lisesi"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs font-medium outline-none"
              />
            </div>

            {/* Okulun Bulunduğu İlçe, İl */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Okulun Bulunduğu İlçe, İl
              </label>
              <input
                type="text"
                value={settings.ilceIl || ''}
                onChange={(e) => onChangeSettings({ ...settings, ilceIl: e.target.value })}
                placeholder="Çankaya / ANKARA"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
              />
            </div>

            {/* Belge Tarihi */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Genel Belge Tarihi
              </label>
              <input
                type="text"
                value={settings.belgeTarihi || ''}
                onChange={(e) => onChangeSettings({ ...settings, belgeTarihi: e.target.value })}
                placeholder="12.10.2026"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none font-mono"
              />
            </div>

            {/* Ders Saati Ayarları */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Ders Saati (Sayı)
                </label>
                <input
                  type="text"
                  value={settings.dersSaati || '16'}
                  onChange={(e) => {
                    const h = e.target.value;
                    const w = numberToTurkishWords(h) || settings.dersSaatiYazi;
                    onChangeSettings({ ...settings, dersSaati: h, dersSaatiYazi: w });
                  }}
                  placeholder="16"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Ders Saati (Yazıyla)
                </label>
                <input
                  type="text"
                  value={settings.dersSaatiYazi || 'on altı'}
                  onChange={(e) => onChangeSettings({ ...settings, dersSaatiYazi: e.target.value })}
                  placeholder="on altı"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
                />
              </div>
            </div>

            {/* İmza Yetkilileri */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                İmza Yetkilileri
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Sol: Müdür Yardımcısı</label>
                  <input
                    type="text"
                    value={settings.mudurYardimcisi || ''}
                    onChange={(e) => onChangeSettings({ ...settings, mudurYardimcisi: e.target.value })}
                    placeholder="Örn: Ali Kaya"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Sağ: Okul Müdürü</label>
                  <input
                    type="text"
                    value={settings.mudur || ''}
                    onChange={(e) => onChangeSettings({ ...settings, mudur: e.target.value })}
                    placeholder="Örn: Hasan Demir"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Single Download Footer Buttons */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 space-y-2">
        <button
          type="button"
          disabled={isDownloading}
          onClick={onDownloadSinglePDF}
          className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          {isDownloading && downloadType === 'single-pdf' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>PDF Hazırlanıyor...</span>
            </>
          ) : (
            <>
              <FileDown size={17} className="transition-transform group-hover:-translate-y-0.5" />
              <span>Bu Belgeyi PDF İndir (A4 {settings.orientation === 'portrait' ? 'Dikey' : 'Yatay'})</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isDownloading}
            onClick={onDownloadSinglePNG}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
          >
            {isDownloading && downloadType === 'single-png' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Image size={14} className="text-emerald-400" />
            )}
            <span>PNG İndir (300 DPI)</span>
          </button>

          <button
            type="button"
            onClick={onResetStudent}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Formu Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
}
