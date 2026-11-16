import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { Anak, getAnak } from '../../services/akademik';
import { useTokenStore } from '../../store/auth';

export const rupiah = (n: number | string | null | undefined) =>
  'Rp' + Math.round(Number(n || 0)).toLocaleString('id-ID');

export const tglId = (v?: string | null) => {
  if (!v) return '-';
  const d = new Date(String(v).length <= 10 ? `${v}T00:00:00` : v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const warnaStatus = (s?: string) =>
  s === 'Lunas' || s === 'Memenuhi' || s === 'Sudah Memenuhi' ? '#15803D'
  : s === 'Menunggu Pembayaran' ? '#B45309'
  : s === 'Belum Bayar' || s === 'Belum Memenuhi' ? '#B91C1C'
  : '#6B7280';

/** Mahasiswa: npm kosong (BE memakai akun sendiri). Orang tua: pilih anak bila >1. */
export function useAnakPilihan() {
  const user = useTokenStore(s => s.user);
  const isParent = user?.role === 'Parent';
  const { data: anak = [], isLoading } = useQuery({ queryKey: ['akademik-anak', user?.id], queryFn: getAnak, enabled: isParent });
  const [npm, setNpm] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (isParent && !npm && anak.length) setNpm(anak[0].npm);
  }, [isParent, anak, npm]);
  const siap = !isParent || (!isLoading && (anak.length === 0 || !!npm));
  const picker = isParent && anak.length > 1 ? <AnakPicker anak={anak} npm={npm} onChange={setNpm} /> : null;
  const tanpaAnak = isParent && !isLoading && anak.length === 0;
  return { npm, isParent, siap, picker, tanpaAnak, anak };
}

export const AnakPicker = ({ anak, npm, onChange }: { anak: Anak[]; npm?: string; onChange: (n: string) => void }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pickerRow}>
    {anak.map(a => (
      <TouchableOpacity key={a.npm} onPress={() => onChange(a.npm)} style={[s.chip, npm === a.npm && s.chipOn]}>
        <Text style={[s.chipText, npm === a.npm && { color: '#fff' }]}>{a.nama || a.npm}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

export const Header = ({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) => (
  <View style={s.header}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
    ) : <View style={{ width: 32 }} />}
    <Text style={s.headerTitle}>{title}</Text>
    <View style={{ minWidth: 32 }}>{right}</View>
  </View>
);

export const Tabs = <T extends string>({ tabs, value, onChange }: { tabs: { key: T; label: string }[]; value: T; onChange: (k: T) => void }) => (
  <View style={s.tabs}>
    {tabs.map(t => (
      <TouchableOpacity key={t.key} onPress={() => onChange(t.key)} style={[s.tab, value === t.key && s.tabOn]}>
        <Text style={[s.tabText, value === t.key && { color: '#15613F', fontWeight: '700' }]}>{t.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const Loading = () => <ActivityIndicator style={{ marginTop: 40 }} color="#15613F" size="large" />;
export const Pesan = ({ text, error }: { text: string; error?: boolean }) => (
  <View style={[s.pesan, error && { backgroundColor: '#FEE2E2' }]}>
    <Text style={{ color: error ? '#991B1B' : '#374151', textAlign: 'center' }}>{text}</Text>
  </View>
);
export const Badge = ({ text }: { text: string }) => (
  <View style={{ backgroundColor: warnaStatus(text) + '22', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
    <Text style={{ color: warnaStatus(text), fontSize: 11, fontWeight: '700' }}>{text}</Text>
  </View>
);

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#15613F', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 14 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginHorizontal: 14, marginTop: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  h2: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6 },
  muted: { color: '#6B7280', fontSize: 12 },
  text: { color: '#374151', fontSize: 13, lineHeight: 19 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerRow: { paddingHorizontal: 10, paddingVertical: 8, flexGrow: 0 },
  chip: { borderWidth: 1, borderColor: '#15613F', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8, backgroundColor: '#fff' },
  chipOn: { backgroundColor: '#15613F' },
  chipText: { color: '#15613F', fontSize: 12, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 11, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: '#15613F' },
  tabText: { color: '#6B7280', fontSize: 13 },
  pesan: { margin: 14, padding: 16, borderRadius: 12, backgroundColor: '#E5E7EB' },
});
