import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTranskrip } from '../../services/akademik';
import { Header, Loading, Pesan, s, useAnakPilihan } from '../../component/akademik/ui';

const f2 = (n: any) => (n === null || n === undefined ? '-' : Number(n).toFixed(2));

export default function TranskripScreen(props: any) {
  const { npm, siap, picker, tanpaAnak } = useAnakPilihan();
  const q = useQuery({ queryKey: ['akademik-transkrip', npm], queryFn: () => getTranskrip(npm), enabled: siap && !tanpaAnak });
  const t = q.data?.transkrip;

  return (
    <View style={s.screen}>
      <Header title="Transkrip Nilai" onBack={() => props.navigation.goBack()} />
      {picker}
      <ScrollView refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} />}>
        {tanpaAnak ? <Pesan text="Belum ada mahasiswa yang terhubung dengan akun ini." /> : !siap || q.isLoading ? <Loading /> : q.isError ? (
          <Pesan error text={(q.error as any)?.message || 'Gagal memuat transkrip.'} />
        ) : !t ? <Pesan text="Transkrip belum tersedia." /> : (
          <>
            <View style={[s.card, { backgroundColor: '#15613F' }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t.mahasiswa?.nama}</Text>
              <Text style={{ color: '#D1FAE5', fontSize: 12 }}>{t.mahasiswa?.npm} · {t.mahasiswa?.prodi || '-'} · Angkatan {t.mahasiswa?.angkatan || '-'}</Text>
              <View style={[s.row, { marginTop: 12 }]}>
                {[['IPK', f2(t.ringkasan?.ipk)], ['Total SKS', t.ringkasan?.totalSks ?? 0], ['Mata kuliah', t.ringkasan?.totalMatkul ?? 0]].map(([k, v]) => (
                  <View key={String(k)} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{v}</Text>
                    <Text style={{ color: '#D1FAE5', fontSize: 11 }}>{k}</Text>
                  </View>
                ))}
              </View>
            </View>
            {(t.semester ?? []).length === 0 ? <Pesan text="Belum ada mata kuliah yang bernilai." /> : (t.semester as any[]).map(sm => (
              <View key={sm.semester} style={s.card}>
                <View style={s.row}>
                  <Text style={s.h2}>Semester {sm.semester}</Text>
                  <Text style={s.muted}>{sm.sks} SKS · IPS {f2(sm.ips)}</Text>
                </View>
                <View style={[s.row, { paddingVertical: 4 }]}>
                  <Text style={[s.muted, { flex: 1 }]}>Mata kuliah</Text>
                  <Text style={[s.muted, { width: 34, textAlign: 'center' }]}>SKS</Text>
                  <Text style={[s.muted, { width: 40, textAlign: 'center' }]}>Nilai</Text>
                  <Text style={[s.muted, { width: 34, textAlign: 'center' }]}>Mutu</Text>
                </View>
                {sm.matkul.map((m: any, i: number) => (
                  <View key={`${m.kode}-${i}`} style={[s.row, { paddingVertical: 6, borderTopWidth: 0.5, borderTopColor: '#E5E7EB' }]}>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={s.text}>{m.nama}</Text>
                      <Text style={s.muted}>{m.kode}</Text>
                    </View>
                    <Text style={[s.text, { width: 34, textAlign: 'center' }]}>{m.sks}</Text>
                    <Text style={[s.text, { width: 40, textAlign: 'center' }]}>{m.nilaiAkhir === null ? '-' : Math.round(m.nilaiAkhir)}</Text>
                    <Text style={[s.text, { width: 34, textAlign: 'center', fontWeight: '800' }]}>{m.hurufMutu || '-'}</Text>
                  </View>
                ))}
              </View>
            ))}
            <Text style={[s.muted, { margin: 16 }]}>Transkrip ini bersifat informasi. Dokumen resmi diterbitkan oleh bagian akademik.</Text>
          </>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
