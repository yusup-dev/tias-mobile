import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getDetailTagihan, getHistori, getTahapan } from '../../services/akademik';
import { Badge, Header, Loading, Pesan, Tabs, rupiah, s, tglId, useAnakPilihan } from '../../component/akademik/ui';

type Tab = 'tagihan' | 'riwayat';

const TahapCard = ({ no, judul, t, onDetail }: { no: number; judul: string; t: any; onDetail: (k: string) => void }) => (
  <View style={s.card}>
    <View style={s.row}>
      <Text style={s.h2}>Tahap {no} — {judul}</Text>
      {t ? <Badge text={t.status} /> : <Badge text="Belum Terbit" />}
    </View>
    {t ? (
      <>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginVertical: 4 }}>{rupiah(t.totalBayar)}</Text>
        <Text style={s.muted}>{t.nama} · No. {t.kodeInvoice}</Text>
        <Text style={s.text}>Jatuh tempo: {tglId(t.jatuhTempo)}</Text>
        {t.nomorVa ? <Text style={s.text}>Virtual account: {t.nomorVa}{t.metodeBayar ? ` (${t.metodeBayar})` : ''}</Text> : null}
        {t.dibayarPada ? <Text style={[s.text, { color: '#15803D' }]}>Dibayar: {tglId(t.dibayarPada)}</Text> : null}
        <TouchableOpacity onPress={() => onDetail(t.kodeInvoice)} style={{ marginTop: 8 }}>
          <Text style={{ color: '#15613F', fontWeight: '700' }}>Lihat rincian ›</Text>
        </TouchableOpacity>
      </>
    ) : (
      <Text style={s.text}>Tagihan belum diterbitkan.</Text>
    )}
  </View>
);

export default function TagihanScreen(props: any) {
  const { npm, siap, picker, tanpaAnak, isParent } = useAnakPilihan();
  const [tab, setTab] = useState<Tab>('tagihan');
  const [kode, setKode] = useState<string | null>(null);

  const tahapan = useQuery({ queryKey: ['tagihan-tahapan', npm], queryFn: () => getTahapan(npm), enabled: siap && !tanpaAnak });
  const histori = useQuery({ queryKey: ['tagihan-histori', npm], queryFn: () => getHistori(npm), enabled: siap && !tanpaAnak && tab === 'riwayat' });
  const detail = useQuery({ queryKey: ['tagihan-detail', npm, kode], queryFn: () => getDetailTagihan(kode!, npm), enabled: !!kode });

  const t = tahapan.data?.tahapan;
  const active = tab === 'tagihan' ? tahapan : histori;

  return (
    <View style={s.screen}>
      <Header title="Tagihan & Pembayaran" onBack={() => props.navigation.goBack()} />
      {picker}
      <Tabs<Tab> tabs={[{ key: 'tagihan', label: 'Tagihan' }, { key: 'riwayat', label: 'Riwayat Pembayaran' }]} value={tab} onChange={k => { setTab(k); setKode(null); }} />
      <ScrollView refreshControl={<RefreshControl refreshing={active.isRefetching} onRefresh={() => active.refetch()} />}>
        {tanpaAnak ? <Pesan text="Belum ada mahasiswa yang terhubung dengan akun ini." /> : !siap || active.isLoading ? <Loading /> : active.isError ? (
          <Pesan error text={(active.error as any)?.message || 'Gagal memuat data.'} />
        ) : kode ? (
          <View style={s.card}>
            <TouchableOpacity onPress={() => setKode(null)}><Text style={{ color: '#15613F', fontWeight: '700' }}>‹ Kembali</Text></TouchableOpacity>
            {detail.isLoading ? <Loading /> : detail.isError ? <Pesan error text="Gagal memuat rincian." /> : (() => {
              const d = detail.data?.invoice ?? {};
              return (
                <>
                  <View style={[s.row, { marginTop: 8 }]}><Text style={s.h2}>{d.nama}</Text><Badge text={d.status} /></View>
                  <Text style={s.muted}>No. {d.kodeInvoice} · {d.namaPeriode}</Text>
                  {(d.rincian ?? []).map((r: any, i: number) => (
                    <View key={i} style={[s.row, { paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' }]}>
                      <Text style={[s.text, { flex: 1 }]}>{r.nama}{r.jumlah > 1 ? ` ×${r.jumlah}` : ''}</Text>
                      <Text style={s.text}>{rupiah(r.subtotal)}</Text>
                    </View>
                  ))}
                  {d.biayaAdmin ? <View style={[s.row, { paddingVertical: 6 }]}><Text style={s.text}>Biaya administrasi</Text><Text style={s.text}>{rupiah(d.biayaAdmin)}</Text></View> : null}
                  <View style={[s.row, { paddingTop: 8 }]}><Text style={s.h2}>Total</Text><Text style={s.h2}>{rupiah(d.totalBayar)}</Text></View>
                  <Text style={s.text}>Jatuh tempo: {tglId(d.jatuhTempo)}</Text>
                  {d.dibayarPada ? <Text style={[s.text, { color: '#15803D' }]}>Dibayar: {tglId(d.dibayarPada)}</Text> : null}
                </>
              );
            })()}
          </View>
        ) : tab === 'tagihan' ? (
          <>
            {t?.periode ? <Text style={[s.muted, { marginHorizontal: 16, marginTop: 10 }]}>Periode {t.periode.nama}</Text> : null}
            <TahapCard no={1} judul="SPP" t={t?.tahap1} onDetail={setKode} />
            <TahapCard no={2} judul="KRS" t={t?.tahap2} onDetail={setKode} />
            {t?.langkahBerikutnya ? (
              <View style={[s.card, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[s.text, { fontWeight: '700' }]}>Langkah berikutnya</Text>
                <Text style={s.text}>{t.langkahBerikutnya}</Text>
              </View>
            ) : null}
            <Text style={[s.muted, { margin: 16 }]}>
              {isParent ? 'Pembayaran dilakukan oleh mahasiswa/keluarga melalui nomor virtual account atau kanal yang tertera pada tagihan.' : 'Pembayaran dilakukan melalui nomor virtual account pada tagihan. Status diperbarui setelah diverifikasi bagian Keuangan.'}
            </Text>
          </>
        ) : (histori.data?.histori ?? []).length === 0 ? (
          <Pesan text="Belum ada riwayat pembayaran." />
        ) : (
          (histori.data.histori as any[]).map(h => (
            <TouchableOpacity key={h.kodeInvoice} style={s.card} onPress={() => setKode(h.kodeInvoice)}>
              <View style={s.row}><Text style={[s.h2, { flex: 1 }]}>{h.namaTagihan}</Text><Badge text="Lunas" /></View>
              <Text style={s.muted}>{h.namaPeriode} · {h.tahap ? `Tahap ${h.tahap}` : h.jenis}</Text>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 4 }}>{rupiah(h.nominalTagihan)}</Text>
              <Text style={s.text}>Dibayar {tglId(h.tanggalBayar)}{h.metodeBayar ? ` · ${h.metodeBayar}` : ''}</Text>
              <Text style={s.muted}>No. {h.kodeInvoice}{h.kodeTransaksi ? ` · Trx ${h.kodeTransaksi}` : ''}</Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
