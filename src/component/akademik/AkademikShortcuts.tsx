import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../../services/akademik';
import { useTokenStore } from '../../store/auth';
import { s } from './ui';

/** Pintasan Tagihan / Transkrip / OBE / Notifikasi di beranda mahasiswa & orang tua; dosen hanya Notifikasi. */
export default function AkademikShortcuts({ navigation }: { navigation: any }) {
  const user = useTokenStore(st => st.user);
  const isDosen = /^Dosen/.test(user?.role || '');
  const ok = user?.role === 'Mahasiswa' || user?.role === 'Parent' || isDosen;
  const { data: unread = 0 } = useQuery({ queryKey: ['notifikasi-unread', user?.role], queryFn: getUnreadCount, enabled: ok, refetchInterval: 60000 });
  if (!ok) return null;
  const semua = [
    { icon: 'cash-multiple', label: 'Tagihan', to: 'home.tagihan', color: '#B45309' },
    { icon: 'file-document-outline', label: 'Transkrip', to: 'home.transkrip', color: '#1D4ED8' },
    { icon: 'radar', label: 'Capaian OBE', to: 'home.obe', color: '#15803D' },
    { icon: 'bell-outline', label: 'Notifikasi', to: 'home.notifikasi', color: '#7C3AED', badge: unread },
  ];
  // dosen: hanya Notifikasi (pengingat mengajar, undangan rapat)
  const items = isDosen ? semua.filter(i => i.to === 'home.notifikasi') : semua;
  return (
    <View style={[s.card, { flexDirection: 'row', justifyContent: isDosen ? 'flex-start' : 'space-around', paddingHorizontal: isDosen ? 24 : 14 }]}>
      {items.map(it => (
        <TouchableOpacity key={it.to} style={{ alignItems: 'center', width: '24%' }} onPress={() => navigation.push(it.to)}>
          <View style={{ backgroundColor: it.color + '1A', borderRadius: 14, padding: 10 }}>
            <Icon name={it.icon} size={26} color={it.color} />
            {it.badge ? (
              <View style={{ position: 'absolute', top: -4, right: -6, backgroundColor: '#DC2626', borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{it.badge > 99 ? '99+' : it.badge}</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ fontSize: 11, marginTop: 4, color: '#374151', textAlign: 'center' }}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
