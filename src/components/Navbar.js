import React from 'react';
import { ShieldCheck, CheckCircle, FileSpreadsheet } from 'lucide-react';
import mebLogoSrc from '../assets/meb_logo.svg';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/20 p-1">
            <img src={mebLogoSrc} alt="MEB Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                <span>MEB İSG Katılım Belgesi Üretici</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  <ShieldCheck size={11} />
                  Resmi Format
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Meslekî Eğitimde İş Sağlığı ve Güvenliği Eğitimi • A4 Dikey & Excel Destekli
            </p>
          </div>
        </div>

        {/* Badges / Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-medium">
            <FileSpreadsheet size={14} />
            <span>Toplu Excel Yükleme</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <CheckCircle size={14} className="text-sky-400" />
            <span>300 DPI A4 Dikey Baskı</span>
          </div>
        </div>
      </div>
    </header>
  );
}
