/**
 * Penjelasan capaian OBE dalam bahasa awam (untuk mahasiswa & orang tua). Fungsi murni, tanpa
 * jaringan: dihitung dari data CPL/CPMK yang sudah dimuat.
 */
export const GLOSARIUM = {
  cpl: 'CPL (Capaian Pembelajaran Lulusan) adalah kemampuan yang harus dimiliki lulusan program studi — mencakup sikap, pengetahuan, dan keterampilan. Setiap CPL dibentuk dari beberapa mata kuliah.',
  cpmk: 'CPMK (Capaian Pembelajaran Mata Kuliah) adalah kemampuan yang harus dicapai mahasiswa pada satu mata kuliah. Nilai CPMK dari berbagai mata kuliah dirangkum menjadi capaian CPL.',
  baca: 'Pada grafik laba-laba, garis biru menunjukkan capaian mahasiswa dan garis abu putus-putus menunjukkan target. Makin jauh titik biru dari pusat, makin tinggi capaiannya; titik di luar garis target berarti target terpenuhi.',
};

const f = (n: number) => (Math.round(n * 100) / 100).toLocaleString('id-ID');

export type CplItem = { kode: string; deskripsi?: string; rerata: number; target: number; status: string; progres?: string };

export function ringkasCpl(items: CplItem[]) {
  const dinilai = items.filter(i => i.status !== 'Belum Dinilai');
  const memenuhi = dinilai.filter(i => i.status === 'Sudah Memenuhi');
  const belum = dinilai.filter(i => i.status === 'Belum Memenuhi');
  const urut = [...dinilai].sort((a, b) => b.rerata - a.rerata);
  const kalimat: string[] = [];
  if (!items.length) return { kalimat: ['Data CPL belum tersedia untuk program studi ini.'], memenuhi, belum, dinilai };
  if (!dinilai.length) {
    kalimat.push('Belum ada CPL yang dinilai karena nilai CPMK mahasiswa belum masuk.');
  } else {
    kalimat.push(`${memenuhi.length} dari ${items.length} CPL sudah memenuhi target${belum.length ? `, ${belum.length} belum memenuhi` : ''}${dinilai.length < items.length ? `, ${items.length - dinilai.length} belum dinilai` : ''}.`);
    const t = urut[0];
    kalimat.push(`Capaian tertinggi ada pada ${t.kode} (${f(t.rerata)}).`);
    if (urut.length > 1) {
      const r = urut[urut.length - 1];
      kalimat.push(`Capaian terendah ada pada ${r.kode} (${f(r.rerata)})${r.status === 'Belum Memenuhi' ? ' dan perlu ditingkatkan pada mata kuliah terkait.' : '.'}`);
    }
  }
  return { kalimat, memenuhi, belum, dinilai };
}

/** Penjelasan satu CPL: apa artinya, posisi terhadap target, dan seberapa banyak mata kuliah sudah berkontribusi. */
export function jelaskanCpl(c: CplItem): string {
  const target = c.target > 0 ? c.target : 60;
  const targetCatatan = c.target > 0 ? `target ${f(c.target)}` : 'target standar 60 (target prodi belum diatur)';
  if (c.status === 'Belum Dinilai') return `Belum ada nilai yang masuk untuk ${c.kode}. Capaian akan muncul setelah mata kuliah terkait dinilai${c.progres ? ` (mata kuliah terkait yang sudah dinilai: ${c.progres})` : ''}.`;
  const selisih = c.rerata - target;
  const pos = selisih >= 0 ? `melampaui ${targetCatatan} sebesar ${f(selisih)} poin` : `masih kurang ${f(-selisih)} poin dari ${targetCatatan}`;
  return `Rata-rata capaian ${c.kode} adalah ${f(c.rerata)}, ${pos}${c.progres ? `. Baru ${c.progres.split('/')[0]} dari ${c.progres.split('/')[1]} mata kuliah pendukung yang sudah dinilai` : ''}.`;
}

export type CpmkItem = { kode: string; deskripsi?: string; nilai: number | null; target: number | null; status: string };

export function jelaskanCpmk(c: CpmkItem): string {
  if (c.nilai === null || c.status === 'Belum Dinilai') return 'Belum dinilai.';
  if (c.status === 'Tanpa Target') return `Nilai ${f(c.nilai)}. Butir ini tidak memiliki target sendiri, nilainya ikut membentuk CPMK induk.`;
  const d = c.nilai - (c.target ?? 0);
  return c.status === 'Memenuhi'
    ? `Nilai ${f(c.nilai)} dari target ${f(c.target ?? 0)} — tercapai (+${f(d)}).`
    : `Nilai ${f(c.nilai)} dari target ${f(c.target ?? 0)} — belum tercapai (kurang ${f(-d)}).`;
}

export function ringkasCpmkMatkul(list: CpmkItem[]) {
  const dg = list.filter(c => c.status === 'Memenuhi' || c.status === 'Belum Memenuhi');
  const ok = dg.filter(c => c.status === 'Memenuhi').length;
  return dg.length ? `${ok} dari ${dg.length} CPMK bertarget sudah tercapai.` : 'Belum ada CPMK bertarget yang dinilai.';
}
