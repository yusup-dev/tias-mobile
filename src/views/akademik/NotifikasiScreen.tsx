import React, { useState } from 'react';
import { Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNotifikasi, markRead } from '../../services/akademik';
import { Header, Loading, Pesan, s } from '../../component/akademik/ui';

const ikon = (t: string) => ((t === 'tagihan' || t === 'slip_keuangan') ? 'cash-multiple' : t === 'jadwal_kuliah' ? 'school-outline' : t === 'event_invite' ? 'calendar-account' : 'bell');

const waktu = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const rupiah = (n: number) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

/** Buka tujuan sesuai jenis notifikasi (dipakai juga saat push diketuk). */
export function bukaNotifikasi(navigation: any, n: { type?: string; data?: any }) {
  const d = n.data || {};
  if ((n.type || d.type) === 'tagihan') navigation.navigate('home.tagihan');
  else if ((n.type || d.type) === 'jadwal_kuliah') navigation.getParent()?.navigate('Kuliah');
  else if ((n.type || d.type) === 'event_invite') navigation.navigate('home.meeting');
}

export default function NotifikasiScreen(props: any) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['notifikasi'], queryFn: () => getNotifikasi(1) });
  const list = q.data?.data ?? [];
  const [detail, setDetail] = useState<any>(null);
  const baca = async (n?: any) => {
    if (n && !n.read_at) await markRead(n.id);
    qc.invalidateQueries({ queryKey: ['notifikasi'] });
    qc.invalidateQueries({ queryKey: ['notifikasi-unread'] });
  };
  const tekanItem = async (n: any) => {
    await baca(n);
    const tipe = n.type || n.data?.type;
    if (tipe === 'slip_keuangan') setDetail(n);
    else bukaNotifikasi(props.navigation, n);
  };
  return (
    <View style={s.screen}>
      <Header title="Notifikasi" onBack={() => props.navigation.goBack()}
        right={list.some((n: any) => !n.read_at) ? (
          <TouchableOpacity onPress={async () => { await markRead(); baca(); }}><Icon name="check-all" size={22} color="#fff" /></TouchableOpacity>
        ) : undefined} />
      <ScrollView refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} />}>
        {q.isLoading ? <Loading /> : q.isError ? <Pesan error text="Gagal memuat notifikasi." /> : list.length === 0 ? <Pesan text="Belum ada notifikasi." /> : list.map((n: any) => (
          <TouchableOpacity key={n.id} style={[s.card, !n.read_at && { borderLeftWidth: 4, borderLeftColor: '#15613F' }]}
            onPress={() => tekanItem(n)}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name={ikon(n.type)} size={22} color="#15613F" style={{ marginRight: 10, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[s.h2, { marginBottom: 2 }]}>{n.title}</Text>
                {n.body ? <Text style={s.text}>{n.body}</Text> : null}
                <Text style={[s.muted, { marginTop: 4 }]}>{waktu(n.created_at)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={!!detail} transparent animationType="fade" onRequestClose={() => setDetail(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20 }}>
            <Text style={[s.h2, { fontSize: 17, marginBottom: 10 }]}>{detail?.title}</Text>
            <Text style={[s.text, { marginBottom: 12 }]}>{detail?.data?.keterangan || detail?.body}</Text>

            <View style={{ backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12 }}>
              <Text style={s.muted}>Nominal</Text>
              <Text style={[s.h2, { color: '#15613F', marginTop: 2 }]}>{rupiah(detail?.data?.nominal)}</Text>
              {detail?.data?.nama_bank && detail?.data?.no_rekening ? (
                <>
                  <Text style={[s.muted, { marginTop: 10 }]}>Rekening Tujuan</Text>
                  <Text style={[s.text, { fontWeight: '600', marginTop: 2 }]}>{detail.data.nama_bank} {detail.data.no_rekening}</Text>
                </>
              ) : null}
            </View>

            <Text style={[s.muted, { marginTop: 12 }]}>{waktu(detail?.created_at)}</Text>

            <TouchableOpacity onPress={() => setDetail(null)} style={{ marginTop: 16, alignSelf: 'flex-end' }}>
              <Text style={{ color: '#15613F', fontWeight: '700' }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
