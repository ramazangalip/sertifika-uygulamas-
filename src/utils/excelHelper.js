import * as XLSX from 'xlsx';

/**
 * Standard column headers mapping for Excel file
 */
export const EXCEL_COLUMNS = [
  { key: 'tcNo', label: 'T.C. Kimlik No', sample: '12345678901' },
  { key: 'adiSoyadi', label: 'Adı Soyadı', sample: 'Ahmet Yılmaz' },
  { key: 'okulNo', label: 'Okul Numarası', sample: '1042' },
  { key: 'babaAdi', label: 'Baba Adı', sample: 'Mehmet' },
  { key: 'anaAdi', label: 'Ana Adı', sample: 'Fatma' },
  { key: 'dogumYeriTarihi', label: 'Doğum Yeri ve Tarihi', sample: 'Ankara - 15.04.2008' },
  { key: 'alaniDali', label: 'Alanı/Dalı', sample: 'Bilişim Teknolojileri / Yazılım' },
  { key: 'belgeNo', label: 'Belge Numarası', sample: '2026/0412' },
  { key: 'belgeTarihi', label: 'Belge Tarihi', sample: '12.10.2026' },
  { key: 'belgeGuvenlikNo', label: 'Belge Güvenlik No', sample: 'TR-89241' },
  { key: 'ilceIl', label: 'Okulun Bulunduğu İlçe, İl', sample: 'Çankaya / ANKARA' },
  { key: 'verenOkul', label: 'Belgeyi Veren Okul', sample: 'Mesleki ve Teknik Anadolu Lisesi' },
  { key: 'dersSaati', label: 'Ders Saati', sample: '16' },
  { key: 'dersSaatiYazi', label: 'Ders Saati (Yazıyla)', sample: 'on altı' },
  { key: 'mudurYardimcisi', label: 'Müdür Yardımcısı', sample: 'Ali Kaya' },
  { key: 'mudur', label: 'Okul Müdürü', sample: 'Hasan Demir' },
];

/**
 * Generate and trigger download of Excel template (.xlsx)
 */
export const downloadExcelTemplate = () => {
  const headers = {};
  EXCEL_COLUMNS.forEach(col => {
    headers[col.label] = col.sample;
  });

  const sampleRow2 = {
    'T.C. Kimlik No': '98765432109',
    'Adı Soyadı': 'Zeynep Kaya',
    'Okul Numarası': '1088',
    'Baba Adı': 'Mustafa',
    'Ana Adı': 'Emine',
    'Doğum Yeri ve Tarihi': 'İstanbul - 22.09.2008',
    'Alanı/Dalı': 'Elektrik-Elektronik Teknolojisi',
    'Belge Numarası': '2026/0413',
    'Belge Tarihi': '12.10.2026',
    'Belge Güvenlik No': 'TR-89242',
    'Okulun Bulunduğu İlçe, İl': 'Çankaya / ANKARA',
    'Belgeyi Veren Okul': 'Mesleki ve Teknik Anadolu Lisesi',
    'Ders Saati': '16',
    'Ders Saati (Yazıyla)': 'on altı',
    'Müdür Yardımcısı': 'Ali Kaya',
    'Okul Müdürü': 'Hasan Demir',
  };

  const wsData = [headers, sampleRow2];
  const ws = XLSX.utils.json_to_sheet(wsData);

  // Auto-fit column widths
  const colWidths = EXCEL_COLUMNS.map(col => ({
    wch: Math.max(col.label.length, 16)
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Öğrenci Listesi');

  XLSX.writeFile(wb, 'ISG_Katilim_Belgesi_Excel_Sablonu.xlsx');
};

/**
 * Clean & normalize Turkish header keys for fuzzy matching
 */
const normalizeHeader = (str) => {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[._\-/:,\s]+/g, '')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u');
};

/**
 * Parse uploaded Excel file and return array of normalized student objects
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('Excel dosyasında veri bulunamadı.');
        }

        // Map column variations
        const mappedStudents = rawJson.map((row, index) => {
          const student = {
            id: index + 1,
            tcNo: '',
            adiSoyadi: '',
            okulNo: '',
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
            dersSaatiYazi: 'on altı',
            mudurYardimcisi: '',
            mudur: ''
          };

          Object.keys(row).forEach(key => {
            const val = String(row[key]).trim();
            const normKey = normalizeHeader(key);

            if (normKey.includes('tc') || normKey.includes('kimlik')) {
              student.tcNo = val;
            } else if (normKey.includes('adsoyad') || normKey.includes('adisoyadi') || normKey === 'ad' || normKey === 'adi' || normKey.includes('ogrenci')) {
              student.adiSoyadi = val;
            } else if (normKey.includes('okulno') || normKey.includes('numara') || normKey === 'no') {
              student.okulNo = val;
            } else if (normKey.includes('baba')) {
              student.babaAdi = val;
            } else if (normKey.includes('ana') || normKey.includes('anne')) {
              student.anaAdi = val;
            } else if (normKey.includes('dogum')) {
              student.dogumYeriTarihi = val;
            } else if (normKey.includes('alan') || normKey.includes('dal') || normKey.includes('bolum')) {
              student.alaniDali = val;
            } else if (normKey.includes('belgeno') || normKey.includes('sertifikano')) {
              student.belgeNo = val;
            } else if (normKey.includes('belgetarih') || normKey.includes('tarih')) {
              student.belgeTarihi = val;
            } else if (normKey.includes('guvenlik')) {
              student.belgeGuvenlikNo = val;
            } else if (normKey.includes('ilce') || normKey.includes('ilceil') || normKey.includes('sehir')) {
              student.ilceIl = val;
            } else if (normKey.includes('verenokul') || normKey.includes('okuladi') || normKey.includes('kurum')) {
              student.verenOkul = val;
            } else if (normKey.includes('derssaatiyazi') || normKey.includes('saatyazi')) {
              student.dersSaatiYazi = val;
            } else if (normKey.includes('derssaati') || normKey.includes('saat')) {
              student.dersSaati = val;
            } else if (normKey.includes('yardimci') || normKey.includes('muduryrd')) {
              student.mudurYardimcisi = val;
            } else if (normKey.includes('mudur')) {
              student.mudur = val;
            }
          });

          return student;
        }).filter(s => s.adiSoyadi || s.tcNo);

        resolve(mappedStudents);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
