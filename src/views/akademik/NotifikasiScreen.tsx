import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNotifikasi, markRead } from '../../services/akademik';
import { Header, Loading, Pesan, s } from '../../component/akademik/ui';

const ikon = (t: string) => ((t === 'tagihan' || t === 'slip_keuangan') ? 'cash-multiple' : t === 'jadwal_kuliah' ? 'school-outline' : t === 'event_invite' ? 'calendar-account' : 'bell');

const waktu = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

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
  const baca = async (n?: any) => {
    if (n && !n.read_at) await markRead(n.id);
    qc.invalidateQueries({ queryKey: ['notifikasi'] });
    qc.invalidateQueries({ queryKey: ['notifikasi-unread'] });
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
            onPress={async () => { await baca(n); bukaNotifikasi(props.navigation, n); }}>
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
    </View>
  );
}
