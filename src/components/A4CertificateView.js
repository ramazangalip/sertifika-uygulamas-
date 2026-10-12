import React from 'react';
import mebLogoSrc from '../assets/meb_logo.svg';

export default function A4CertificateView({ student, settings = {}, scale = 1 }) {
  const isLandscape = (settings.orientation || 'landscape') === 'landscape';

  const {
    tcNo = '12345678901',
    adiSoyadi = 'Ahmet Yılmaz',
    okulNo = '1042',
    babaAdi = 'Mehmet',
    anaAdi = 'Fatma',
    dogumYeriTarihi = 'Ankara - 15.04.2008',
    alaniDali = 'Bilişim Teknolojileri / Yazılım',
    belgeNo = settings.belgeNo || '2026/0412',
    belgeTarihi = settings.belgeTarihi || '12.10.2026',
    belgeGuvenlikNo = settings.belgeGuvenlikNo || 'TR-89241',
    ilceIl = settings.ilceIl || 'Çankaya / ANKARA',
    verenOkul = settings.verenOkul || 'Mesleki ve Teknik Anadolu Lisesi',
    mudurYardimcisi = settings.mudurYardimcisi || '',
    mudur = settings.mudur || '',
  } = student || {};

  const dersSaati = student?.dersSaati || settings.dersSaati || '16';
  const dersSaatiYazi = student?.dersSaatiYazi || settings.dersSaatiYazi || 'on altı';

  const baseW = isLandscape ? 1123 : 794;
  const baseH = isLandscape ? 794 : 1123;

  return (
    <div
      className="flex items-center justify-center transition-all duration-150"
      style={{
        width: `${baseW * scale}px`,
        height: `${baseH * scale}px`,
        position: 'relative'
      }}
    >
      <div
        style={{
          width: `${baseW}px`,
          height: `${baseH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {isLandscape ? (
          /* =========================================================
             A4 YATAY (LANDSCAPE): 1123px x 794px - Sıkı & Dengeli Düzen
             ========================================================= */
          <div
            id="a4-certificate-paper"
            className="bg-white text-black shadow-2xl relative select-none box-border flex flex-col justify-start items-center"
            style={{
              width: '1123px',
              height: '794px',
              padding: '16px 44px',
              fontFamily: '"Times New Roman", Times, Georgia, serif',
              boxSizing: 'border-box'
            }}
          >
            {/* Top-Left Verification Box */}
            <div
              className="absolute border border-slate-600 rounded-[2px]"
              style={{
                top: '16px',
                left: '36px',
                width: '18px',
                height: '18px',
              }}
              title="e-Belge Doğrulama Alanı"
            />

            {/* Header: MEB Logo & KATILIM BELGESİ (Kompakt alt/üst boşluk) */}
            <div className="flex flex-col items-center mb-1">
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-0.5">
                <img
                  src={mebLogoSrc}
                  alt="T.C. Millî Eğitim Bakanlığı"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <h1
                className="font-bold tracking-wide text-black text-center"
                style={{
                  fontSize: '21px',
                  fontFamily: '"Playfair Display", "Times New Roman", serif',
                  letterSpacing: '1px',
                  marginBottom: '4px'
                }}
              >
                KATILIM BELGESİ
              </h1>
            </div>

            {/* Table (Kompakt alt/üst boşluk) */}
            <div className="w-full my-1">
              <table
                className="w-full border-collapse border border-black text-black"
                style={{
                  borderWidth: '1.2px',
                  fontSize: '12px',
                }}
              >
                <tbody>
                  {/* Row 1 */}
                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1 px-3 w-[43%]">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">T.C. Kimlik No</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{tcNo}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1 px-3 w-[57%]">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Okulun Bulunduğu İlçe, İl :</span>
                        <span className="font-normal truncate">{ilceIl}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1 px-3 w-[36%]">
                      <div className="flex items-center">
                        <span className="w-20 shrink-0">Adı Soyadı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-bold truncate">{adiSoyadi}</span>
                      </div>
                    </td>
                    <td className="border-r border-black py-1 px-3 w-[32%]">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-1.5">Okul Numarası :</span>
                        <span className="font-normal truncate">{okulNo}</span>
                      </div>
                    </td>
                    <td className="py-1 px-3 w-[32%]">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-1.5">Belge Numarası :</span>
                        <span className="font-normal truncate">{belgeNo}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1 px-3">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">Baba Adı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{babaAdi}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1 px-3">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Belge Tarihi :</span>
                        <span className="font-normal truncate">{belgeTarihi}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1 px-3">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">Ana Adı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{anaAdi}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1 px-3">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Belge Güvenlik No :</span>
                        <span className="font-normal truncate">{belgeGuvenlikNo}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1 px-3">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">Doğum Yeri ve Tarihi</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{dogumYeriTarihi}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1 px-3">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Alanı/Dalı :</span>
                        <span className="font-normal truncate">{alaniDali}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="border-b border-black">
                    <td colSpan="3" className="py-1 px-3">
                      <div className="flex items-center">
                        <span className="w-32 shrink-0">Belgeyi Veren Okul</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-bold truncate">{verenOkul}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 7 */}
                  <tr>
                    <td colSpan="3" className="py-1 px-3">
                      <div className="flex items-center">
                        <span className="w-32 shrink-0">Belge Adı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal">
                          Meslekî Eğitimde İş Sağlığı ve Güvenliği Eğitimi Katılım Belgesi
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Description Text (Tek satırda baştan sona) */}
            <div className="w-full text-center my-2 text-black font-normal whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '13px', letterSpacing: '0.1px' }}>
              Yukarıda bilgileri yer alan öğrenci,{' '}
              <strong className="font-semibold underline decoration-dotted underline-offset-4 mx-1">
                {dersSaati}
              </strong>{' '}
              ({' '}
              <span className="font-semibold">{dersSaatiYazi}</span>{' '}
              ) ders saati meslekî eğitimde iş sağlığı ve güvenliği eğitimini tamamladığı için bu belgeyi almaya hak kazanmıştır.{' '}
              <span className="font-medium ml-2">{belgeTarihi || '..../..../20....'}</span>
            </div>

            {/* Signatures at Bottom (Kompakt üst boşluk) */}
            <div className="flex justify-between items-end pt-2 pb-0 px-16 w-full">
              <div className="text-center w-52 flex flex-col items-center">
                <div className="font-mono text-xs tracking-widest text-slate-700 mb-0.5">
                  ...........................
                </div>
                {mudurYardimcisi && (
                  <div className="font-semibold text-xs text-black mb-0.5">{mudurYardimcisi}</div>
                )}
                <div className="text-xs font-normal text-black">Müdür Yardımcısı</div>
              </div>

              <div className="text-center w-52 flex flex-col items-center">
                <div className="font-mono text-xs tracking-widest text-slate-700 mb-0.5">
                  ...........................
                </div>
                {mudur && (
                  <div className="font-semibold text-xs text-black mb-0.5">{mudur}</div>
                )}
                <div className="text-xs font-normal text-black">Müdür</div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================
             A4 DİKEY (PORTRAIT): 794px x 1123px - Sıkı & Dengeli Düzen
             ========================================================= */
          <div
            id="a4-certificate-paper"
            className="bg-white text-black shadow-2xl relative select-none box-border flex flex-col justify-start items-center"
            style={{
              width: '794px',
              height: '1123px',
              padding: '24px 44px',
              fontFamily: '"Times New Roman", Times, Georgia, serif',
              boxSizing: 'border-box'
            }}
          >
            {/* Top-Left Verification Box */}
            <div
              className="absolute border border-slate-600 rounded-[2px]"
              style={{
                top: '24px',
                left: '36px',
                width: '18px',
                height: '18px',
              }}
              title="e-Belge Doğrulama Alanı"
            />

            {/* Header */}
            <div className="flex flex-col items-center mb-1.5">
              <div className="w-[95px] h-[95px] flex items-center justify-center mb-1">
                <img
                  src={mebLogoSrc}
                  alt="T.C. Millî Eğitim Bakanlığı"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <h1
                className="font-bold tracking-wide text-black text-center"
                style={{
                  fontSize: '23px',
                  fontFamily: '"Playfair Display", "Times New Roman", serif',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}
              >
                KATILIM BELGESİ
              </h1>
            </div>

            {/* Table */}
            <div className="w-full my-1.5">
              <table
                className="w-full border-collapse border border-black text-black"
                style={{
                  borderWidth: '1.2px',
                  fontSize: '12.5px',
                }}
              >
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1.5 px-3 w-[42.5%]">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">T.C. Kimlik No</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{tcNo}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1.5 px-3 w-[57.5%]">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Okulun Bulunduğu İlçe, İl :</span>
                        <span className="font-normal truncate">{ilceIl}</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1.5 px-3 w-[36%]">
                      <div className="flex items-center">
                        <span className="w-20 shrink-0">Adı Soyadı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-bold truncate">{adiSoyadi}</span>
                      </div>
                    </td>
                    <td className="border-r border-black py-1.5 px-3 w-[32%]">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-1.5">Okul Numarası :</span>
                        <span className="font-normal truncate">{okulNo}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-3 w-[32%]">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-1.5">Belge Numarası :</span>
                        <span className="font-normal truncate">{belgeNo}</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">Baba Adı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{babaAdi}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Belge Tarihi :</span>
                        <span className="font-normal truncate">{belgeTarihi}</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0">Ana Adı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{anaAdi}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Belge Güvenlik No :</span>
                        <span className="font-normal truncate">{belgeGuvenlikNo}</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-black">
                    <td className="border-r border-black py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="w-28 shrink-0 text-[12px] leading-tight">Doğum Yeri ve Tarihi</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal truncate">{dogumYeriTarihi}</span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="shrink-0 mr-2">Alanı/Dalı :</span>
                        <span className="font-normal truncate">{alaniDali}</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-black">
                    <td colSpan="3" className="py-1.5 px-3">
                      <div className="flex items-center">
                        <span className="w-32 shrink-0">Belgeyi Veren Okul</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-bold truncate">{verenOkul}</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="3" className="py-2 px-3">
                      <div className="flex items-center">
                        <span className="w-32 shrink-0">Belge Adı</span>
                        <span className="mr-2 font-bold">:</span>
                        <span className="font-normal">
                          Meslekî Eğitimde İş Sağlığı ve Güvenliği Eğitimi Katılım Belgesi
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Paragraph (Tek satırda baştan sona) */}
            <div className="w-full text-center my-3 text-black font-normal whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '11.8px', letterSpacing: '0.1px' }}>
              Yukarıda bilgileri yer alan öğrenci,{' '}
              <strong className="font-semibold underline decoration-dotted underline-offset-4 mx-1">
                {dersSaati}
              </strong>{' '}
              ({' '}
              <span className="font-semibold">{dersSaatiYazi}</span>{' '}
              ) ders saati meslekî eğitimde iş sağlığı ve güvenliği eğitimini tamamladığı için bu belgeyi almaya hak kazanmıştır.{' '}
              <span className="font-medium ml-2">{belgeTarihi || '..../..../20....'}</span>
            </div>

            {/* Signatures (Kompakt üst boşluk) */}
            <div className="flex justify-between items-end pt-2 pb-1 px-8 w-full">
              <div className="text-center w-52 flex flex-col items-center">
                <div className="font-mono text-xs tracking-widest text-slate-700 mb-1">
                  ...........................
                </div>
                {mudurYardimcisi && (
                  <div className="font-semibold text-xs text-black mb-0.5">{mudurYardimcisi}</div>
                )}
                <div className="text-xs font-normal text-black">Müdür Yardımcısı</div>
              </div>

              <div className="text-center w-52 flex flex-col items-center">
                <div className="font-mono text-xs tracking-widest text-slate-700 mb-1">
                  ...........................
                </div>
                {mudur && (
                  <div className="font-semibold text-xs text-black mb-0.5">{mudur}</div>
                )}
                <div className="text-xs font-normal text-black">Müdür</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
