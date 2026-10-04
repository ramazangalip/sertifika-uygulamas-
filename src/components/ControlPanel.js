import React, { useState } from 'react';
import {
  FileDown,
  Image,
  RotateCcw,
  Sliders,
  Type,
  Calendar,
  User,
  Users,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { getTodayDateInput, formatTurkishDate } from '../utils/helpers';

export default function ControlPanel({
  data,
  onChangeData,
  settings,
  onChangeSettings,
  onResetSettings,
  onResetAll,
  onDownloadPDF,
  onDownloadPNG,
  onBatchDownload,
  isDownloading,
  downloadType,
  batchList,
  setBatchList,
  activeBatchIndex,
  setActiveBatchIndex,
  isBatchMode,
  setIsBatchMode
}) {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'typography' | 'batch'

  // Preset font colors
  const colorPresets = [
    { name: 'Kurumsal Lacivert', value: '#0f172a' },
    { name: 'Koyu Safir', value: '#1e3a8a' },
    { name: 'Asil Siyah', value: '#09090b' },
    { name: 'Derin Bronz', value: '#78350f' },
    { name: 'Koyu Zümrüt', value: '#064e3b' },
  ];

  // Font options
  const fontFamilies = [
    { id: 'Playfair Display', name: 'Playfair Display', desc: 'Prestijli Serif (Klasik & Şık)', sample: 'Örnek İsim' },
    { id: 'Cinzel', name: 'Cinzel', desc: 'Roma Tarzı Resmi Belge', sample: 'ÖRNEK İSİM' },
    { id: 'Cormorant Garamond', name: 'Cormorant Garamond', desc: 'Geleneksel Akademi', sample: 'Örnek İsim' },
    { id: 'Montserrat', name: 'Montserrat', desc: 'Modern & Geometrik Sans', sample: 'Örnek İsim' },
    { id: 'Inter', name: 'Inter', desc: 'Kurumsal & Sade', sample: 'Örnek İsim' },
  ];

  const handleSampleName = (name) => {
    onChangeData({ ...data, fullName: name });
  };

  const handleSetToday = () => {
    const today = getTodayDateInput();
    onChangeData({ ...data, date: formatTurkishDate(today), rawDate: today });
  };

  const handleDateChange = (e) => {
    const rawVal = e.target.value;
    onChangeData({
      ...data,
      rawDate: rawVal,
      date: formatTurkishDate(rawVal)
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1">
        <button
          onClick={() => { setActiveTab('basic'); setIsBatchMode(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${activeTab === 'basic' && !isBatchMode
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
        >
          <User size={15} />
          <span>Temel Bilgiler</span>
        </button>

        <button
          onClick={() => { setActiveTab('typography'); setIsBatchMode(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${activeTab === 'typography' && !isBatchMode
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
        >
          <Sliders size={15} />
          <span>Konum & Tipografi</span>
        </button>

        <button
          onClick={() => { setActiveTab('batch'); setIsBatchMode(true); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${isBatchMode
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
        >
          <Users size={15} />
          <span>Toplu Üretim</span>
          {batchList.length > 1 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {batchList.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: BASIC INFO */}
        {activeTab === 'basic' && !isBatchMode && (
          <div className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-sky-400" />
                  Katılımcı Adı Soyadı <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onChangeSettings({ ...settings, isUppercase: !settings.isUppercase })}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${settings.isUppercase
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    BÜYÜK HARF
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => onChangeData({ ...data, fullName: e.target.value })}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-3 text-slate-100 text-sm font-medium placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Quick Sample Names */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px] text-slate-400">
                <span className="text-slate-500 shrink-0">Hızlı Doldur:</span>
                {['Ahmet Yılmaz', 'Dr. Ayşe Demir', 'Mustafa Öztürk', 'Zeynep Çelik'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSampleName(name)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} className="text-sky-400" />
                  Veriliş Tarihi <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Bugünün Tarihini Seç
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Tarih Seçici</label>
                  <input
                    type="date"
                    value={data.rawDate || ''}
                    onChange={handleDateChange}
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Görünecek Metin</label>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => onChangeData({ ...data, date: e.target.value })}
                    placeholder="04.10.2026"
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Extra Options Accordion / Checkboxes */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                İsteğe Bağlı Ek Alanlar
              </span>

              {/* Instructor Name Option */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showInstructor}
                      onChange={(e) => onChangeSettings({ ...settings, showInstructor: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Eğitmen / Yetkili İsmi Yazdır</span>
                  </label>
                </div>
                {settings.showInstructor && (
                  <input
                    type="text"
                    value={data.instructorName}
                    onChange={(e) => onChangeData({ ...data, instructorName: e.target.value })}
                    placeholder="Örn: Mehmet Özkan (İSG Uzmanı)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-500"
                  />
                )}
              </div>

              {/* Certificate No Option */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showCertNo}
                      onChange={(e) => onChangeSettings({ ...settings, showCertNo: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Belge / Sertifika No Ekle</span>
                  </label>
                </div>
                {settings.showCertNo && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={data.certificateNo}
                      onChange={(e) => onChangeData({ ...data, certificateNo: e.target.value })}
                      placeholder="Örn: İSG-2026-08492"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const randomNo = `İSG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
                        onChangeData({ ...data, certificateNo: randomNo });
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg font-medium"
                    >
                      Oluştur
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POSITION & TYPOGRAPHY SETTINGS */}
        {activeTab === 'typography' && !isBatchMode && (
          <div className="space-y-5">
            {/* Font Family Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Type size={14} className="text-sky-400" />
                İsim Yazı Tipi (Font Ailesi)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => onChangeSettings({ ...settings, fontFamily: font.id })}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${settings.fontFamily === font.id
                        ? 'bg-sky-500/10 border-sky-500/50 text-white ring-1 ring-sky-500/30'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{font.name}</div>
                      <div className="text-[10px] text-slate-400">{font.desc}</div>
                    </div>
                    <div
                      className="text-sm font-bold text-sky-300 pr-1"
                      style={{
                        fontFamily: font.id === 'Playfair Display' ? '"Playfair Display", serif' :
                          font.id === 'Cinzel' ? 'Cinzel, serif' :
                            font.id === 'Cormorant Garamond' ? '"Cormorant Garamond", serif' :
                              font.id === 'Montserrat' ? 'Montserrat, sans-serif' : 'Inter, sans-serif'
                      }}
                    >
                      {font.sample}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Font Size & Position Sliders */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-sky-400" />
                İsim İnce Ayarları (Boyut & Konum)
              </div>

              {/* Font Size Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Yazı Boyutu:</span>
                  <strong className="text-sky-400 font-mono">{settings.nameFontSize} px</strong>
                </div>
                <input
                  type="range"
                  min="22"
                  max="52"
                  step="1"
                  value={settings.nameFontSize}
                  onChange={(e) => onChangeSettings({ ...settings, nameFontSize: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Vertical Position Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Dikey Konum (Yukarı/Aşağı):</span>
                  <strong className="text-sky-400 font-mono">%{settings.namePosY}</strong>
                </div>
                <input
                  type="range"
                  min="58"
                  max="76"
                  step="0.2"
                  value={settings.namePosY}
                  onChange={(e) => onChangeSettings({ ...settings, namePosY: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Horizontal Position Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Yatay Konum (Sağ/Sol):</span>
                  <strong className="text-sky-400 font-mono">%{settings.namePosX}</strong>
                </div>
                <input
                  type="range"
                  min="35"
                  max="65"
                  step="0.5"
                  value={settings.namePosX}
                  onChange={(e) => onChangeSettings({ ...settings, namePosX: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] text-slate-400">Yazı Rengi:</div>
                <div className="flex items-center gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      title={preset.name}
                      onClick={() => onChangeSettings({ ...settings, nameColor: preset.value })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${settings.nameColor === preset.value
                          ? 'border-sky-400 scale-110 shadow-lg'
                          : 'border-slate-700 hover:border-slate-500'
                        }`}
                      style={{ backgroundColor: preset.value }}
                    />
                  ))}
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.nameColor}
                      onChange={(e) => onChangeSettings({ ...settings, nameColor: e.target.value })}
                      className="w-7 h-7 rounded-full overflow-hidden cursor-pointer border border-slate-700 bg-transparent p-0"
                      title="Özel Renk Seç"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date Position Sliders */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-sky-400" />
                Tarih Konum Ayarları
              </div>

              {/* Date Y Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Dikey Konum:</span>
                  <strong className="text-sky-400 font-mono">%{settings.datePosY}</strong>
                </div>
                <input
                  type="range"
                  min="80"
                  max="94"
                  step="0.2"
                  value={settings.datePosY}
                  onChange={(e) => onChangeSettings({ ...settings, datePosY: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Date X Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Yatay Konum:</span>
                  <strong className="text-sky-400 font-mono">%{settings.datePosX}</strong>
                </div>
                <input
                  type="range"
                  min="8"
                  max="25"
                  step="0.2"
                  value={settings.datePosX}
                  onChange={(e) => onChangeSettings({ ...settings, datePosX: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Date Size Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Tarih Yazı Boyutu:</span>
                  <strong className="text-sky-400 font-mono">{settings.dateFontSize} px</strong>
                </div>
                <input
                  type="range"
                  min="11"
                  max="20"
                  step="1"
                  value={settings.dateFontSize}
                  onChange={(e) => onChangeSettings({ ...settings, dateFontSize: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Reset Sliders Button */}
            <button
              type="button"
              onClick={onResetSettings}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700/60"
            >
              <RotateCcw size={13} />
              <span>Konum ve Boyutları Varsayılana Sıfırla</span>
            </button>
          </div>
        )}

        {/* TAB 3: BATCH GENERATION */}
        {isBatchMode && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
              <strong>Toplu Sertifika Üretimi:</strong> Her satıra bir katılımcı adı yazarak birden fazla sertifikayı tek tıklamayla hazırlayabilir ve ZIP paketi halinde indirebilirsiniz.
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Katılımcı Listesi (Her Satıra 1 Kişi)</span>
                <span className="text-sky-400 font-normal">{batchList.length} Kişi Girildi</span>
              </label>
              <textarea
                rows={7}
                value={batchList.join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  setBatchList(lines);
                  if (lines[activeBatchIndex]) {
                    onChangeData({ ...data, fullName: lines[activeBatchIndex] });
                  }
                }}
                placeholder="Ahmet Yılmaz&#10;Zeynep Kaya&#10;Mehmet Ali Demir&#10;Fatma Çelik"
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl p-3 text-slate-100 text-xs font-mono leading-relaxed outline-none transition-all"
              />
            </div>

            {/* Quick Batch Participant Selector */}
            {batchList.filter(n => n.trim().length > 0).length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium">Önizlenecek Katılımcı:</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800">
                  {batchList.map((name, idx) => {
                    const trimmed = name.trim();
                    if (!trimmed) return null;
                    const isActive = idx === activeBatchIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveBatchIndex(idx);
                          onChangeData({ ...data, fullName: trimmed });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isActive
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                      >
                        {idx + 1}. {trimmed}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bulk Download Action */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={isDownloading || batchList.filter(n => n.trim().length > 0).length === 0}
                onClick={() => onBatchDownload('pdf')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading && downloadType === 'batch-pdf' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Toplu PDF'ler Paketleniyor...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={18} />
                    <span>Tümünü Toplu PDF Olarak İndir (ZIP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Download & Action Controls at Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 space-y-2.5">
        {/* PDF Download Button (Primary) */}
        <button
          type="button"
          disabled={isDownloading}
          onClick={onDownloadPDF}
          className="w-full group relative flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isDownloading && downloadType === 'pdf' ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Yüksek Çözünürlüklü PDF Hazırlanıyor...</span>
            </>
          ) : (
            <>
              <FileDown size={19} className="transition-transform group-hover:-translate-y-0.5" />
              <span>Yüksek Kalite PDF İndir (A4 Yatay)</span>
            </>
          )}
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* PNG Download Button */}
          <button
            type="button"
            disabled={isDownloading}
            onClick={onDownloadPNG}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all disabled:opacity-50"
          >
            {isDownloading && downloadType === 'png' ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>İşleniyor...</span>
              </>
            ) : (
              <>
                <Image size={15} className="text-emerald-400" />
                <span>PNG İndir (300 DPI)</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs border border-slate-800 transition-all"
          >
            <RotateCcw size={13} />
            <span>Formu Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
}
