import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getObe } from '../../services/akademik';
import { GLOSARIUM, jelaskanCpl, jelaskanCpmk, ringkasCpl, ringkasCpmkMatkul } from '../../services/akademik/obeNarasi';
import SpiderChart from '../../component/akademik/SpiderChart';
import { Badge, Header, Loading, Pesan, Tabs, s, useAnakPilihan } from '../../component/akademik/ui';

type Tab = 'cpl' | 'cpmk';
const f = (n: number) => (Math.round(n * 100) / 100).toLocaleString('id-ID');

/** Kotak "Apa itu CPL / CPMK?" yang bisa dibuka-tutup. */
const Penjelasan = ({ tab }: { tab: Tab }) => {
  const [open, setOpen] = useState(true);
  return (
    <View style={[s.card, { backgroundColor: '#EFF6FF' }]}>
      <TouchableOpacity style={s.row} onPress={() => setOpen(o => !o)}>
        <Text style={s.h2}>Apa itu {tab === 'cpl' ? 'CPL' : 'CPMK'}?</Text>
        <Text style={{ color: '#1D4ED8', fontWeight: '700' }}>{open ? 'Tutup' : 'Buka'}</Text>
      </TouchableOpacity>
      {open ? (
        <>
          <Text style={s.text}>{tab === 'cpl' ? GLOSARIUM.cpl : GLOSARIUM.cpmk}</Text>
          {tab === 'cpl' ? <Text style={[s.text, { marginTop: 6 }]}>{GLOSARIUM.baca}</Text> : <Text style={[s.text, { marginTop: 6 }]}>CPMK yang memiliki target ditandai Memenuhi bila nilainya mencapai target. Butir tanpa target (sub-CPMK) hanya menunjukkan nilai dan ikut membentuk CPMK induk.</Text>}
        </>
      ) : null}
    </View>
  );
};

const CplTab = ({ cpl, pesan }: { cpl: any; pesan?: string }) => {
  const [open, setOpen] = useState<string | null>(null);
  const items = cpl?.items ?? [];
  const ringkas = useMemo(() => ringkasCpl(items), [items]);
  if (!cpl) return <Pesan text={pesan || 'Capaian CPL belum tersedia.'} />;
  return (
    <>
      <Penjelasan tab="cpl" />
      <View style={s.card}>
        <Text style={s.h2}>Pencapaian CPL</Text>
        {items.length >= 3 ? (
          <SpiderChart data={items.map((c: any) => ({ label: c.kode, value: c.rerata, target: c.target }))} />
        ) : (
          items.map((c: any) => (
            <Text key={c.kode} style={s.text}>{c.kode}: {f(c.rerata)} (target {f(c.target)})</Text>
          ))
        )}
        {items.length > 0 && items.length < 3 ? <Text style={s.muted}>Grafik laba-laba tampil bila ada minimal 3 CPL.</Text> : null}
      </View>
      <View style={s.card}>
        <Text style={s.h2}>Ringkasan</Text>
        {ringkas.kalimat.map((k, i) => <Text key={i} style={[s.text, { marginBottom: 3 }]}>• {k}</Text>)}
        {cpl.kurikulum ? <Text style={[s.muted, { marginTop: 6 }]}>Kurikulum {cpl.kurikulum}</Text> : null}
      </View>
      {items.map((c: any) => (
        <TouchableOpacity key={c.kode} style={s.card} onPress={() => setOpen(open === c.kode ? null : c.kode)}>
          <View style={s.row}>
            <Text style={s.h2}>{c.kode}</Text>
            <Badge text={c.status} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
            {f(c.rerata)} <Text style={s.muted}>/ target {c.target > 0 ? f(c.target) : '60 (standar)'}</Text>
          </Text>
          <Text style={[s.text, { marginTop: 4 }]}>{jelaskanCpl(c)}</Text>
          {open === c.kode ? (
            <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: '#E5E7EB' }}>
              <Text style={[s.text, { fontWeight: '700' }]}>Arti {c.kode}</Text>
              <Text style={s.text}>{c.deskripsi || 'Deskripsi belum tersedia.'}</Text>
            </View>
          ) : <Text style={[s.muted, { marginTop: 4 }]}>Ketuk untuk melihat arti {c.kode}</Text>}
        </TouchableOpacity>
      ))}
    </>
  );
};

const CpmkTab = ({ cpmk }: { cpmk: any[] }) => {
  const [idx, setIdx] = useState(0);
  if (!cpmk.length) return <Pesan text="Belum ada data CPMK. Nilai CPMK muncul setelah dosen menginput penilaian mata kuliah." />;
  const mk = cpmk[Math.min(idx, cpmk.length - 1)];
  const dinilai = mk.cpmk.filter((c: any) => c.nilai !== null);
  return (
    <>
      <Penjelasan tab="cpmk" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10, paddingTop: 10, flexGrow: 0 }}>
        {cpmk.map((m, i) => (
          <TouchableOpacity key={`${m.kode}-${i}`} onPress={() => setIdx(i)} style={[s.chip, idx === i && s.chipOn]}>
            <Text style={[s.chipText, idx === i && { color: '#fff' }]}>{m.mataKuliah}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.card}>
        <Text style={s.h2}>{mk.mataKuliah}</Text>
        <Text style={s.muted}>{mk.kode}{mk.semester ? ` · Semester ${mk.semester}` : ''}</Text>
        {dinilai.length >= 3 ? (
          <SpiderChart data={dinilai.map((c: any) => ({ label: c.kode, value: c.nilai, target: c.target ?? 0 }))} />
        ) : <Text style={[s.muted, { marginTop: 6 }]}>Grafik laba-laba tampil bila ada minimal 3 CPMK yang sudah dinilai.</Text>}
        <Text style={[s.text, { marginTop: 8 }]}>{ringkasCpmkMatkul(mk.cpmk)}</Text>
      </View>
      {mk.cpmk.map((c: any) => (
        <View key={c.kode} style={s.card}>
          <View style={s.row}><Text style={s.h2}>{c.kode}</Text><Badge text={c.status} /></View>
          <Text style={s.text}>{c.deskripsi || 'Deskripsi belum tersedia.'}</Text>
          <Text style={[s.text, { marginTop: 4, fontWeight: '700' }]}>{jelaskanCpmk(c)}</Text>
        </View>
      ))}
    </>
  );
};

export default function ObeScreen(props: any) {
  const { npm, siap, picker, tanpaAnak } = useAnakPilihan();
  const [tab, setTab] = useState<Tab>('cpl');
  const q = useQuery({ queryKey: ['akademik-obe', npm], queryFn: () => getObe(npm), enabled: siap && !tanpaAnak });
  const obe = q.data?.obe;

  return (
    <View style={s.screen}>
      <Header title="Pencapaian OBE" onBack={() => props.navigation.goBack()} />
      {picker}
      <Tabs<Tab> tabs={[{ key: 'cpl', label: 'CPL (Lulusan)' }, { key: 'cpmk', label: 'CPMK (Mata Kuliah)' }]} value={tab} onChange={setTab} />
      <ScrollView refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} />}>
        {tanpaAnak ? <Pesan text="Belum ada mahasiswa yang terhubung dengan akun ini." /> : !siap || q.isLoading ? <Loading /> : q.isError ? (
          <Pesan error text={(q.error as any)?.message || 'Gagal memuat capaian.'} />
        ) : !obe ? <Pesan text="Capaian OBE belum tersedia." /> : tab === 'cpl' ? (
          <CplTab cpl={obe.cpl} pesan={obe.cplPesan} />
        ) : (
          <CpmkTab cpmk={obe.cpmk ?? []} />
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
