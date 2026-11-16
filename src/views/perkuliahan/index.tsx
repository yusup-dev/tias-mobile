import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/FontAwesome';
import { perkuliahan } from '../../services/perkuliahan/index';
import { useTokenStore } from '../../store/auth';

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
type Tab = 'jadwal' | 'matkul' | 'agenda';

const formatTanggal = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
};

const PerkuliahanComponent = (props: any) => {
  const user = useTokenStore(state => state.user);
  const isParent = user?.role === 'Parent';
  const [tab, setTab] = useState<Tab>('jadwal');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['perkuliahan', user?.role, user?.npm],
    queryFn: () => perkuliahan(),
  });

  // respons BE: { isSuccess, data:{ schedule, matkul, agenda, totalSks, totalMatkul } }
  const payload = data?.data ?? {};
  const schedule: Record<string, any[]> = payload.schedule ?? {};
  const matkulList: any[] = payload.matkul ?? [];
  const agenda: any[] = payload.agenda ?? [];
  const totalSks = payload.totalSks ?? 0;
  const totalMatkul = payload.totalMatkul ?? 0;
  const hariAktif = HARI.filter(h => (schedule[h] ?? []).length > 0);
  const failed = isError || (data && data.isSuccess === false);

  const renderEmpty = (text: string) => <Text style={styles.emptyText}>{text}</Text>;

  const renderJadwal = () =>
    hariAktif.length === 0
      ? renderEmpty('Jadwal perkuliahan belum tersedia.')
      : hariAktif.map(hari => (
          <View key={hari} style={styles.dayBlock}>
            <Text style={styles.dayTitle}>{hari}</Text>
            {schedule[hari].map((item: any, i: number) => (
              <View key={`${hari}-${item.kelasKuliahId}-${i}`} style={styles.card}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{item.jamMulai ?? '--:--'}</Text>
                  <Text style={styles.timeTextSub}>{item.jamSelesai ?? '--:--'}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.matkulName} numberOfLines={2}>
                    {item.mataKuliah} <Text style={styles.sksText}>({item.sks} SKS)</Text>
                  </Text>
                  {!!item.kelas && <Text style={styles.detailText}>{item.kelas}</Text>}
                  {!!item.dosen && (
                    <View style={styles.detailRow}>
                      <Icons name="user" size={12} color="#666" />
                      <Text style={styles.detailText} numberOfLines={1}>{item.dosen}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Icons name="map-marker" size={12} color="#666" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {item.ruangan || 'Ruangan belum ditentukan'}{item.metode ? ` · ${item.metode}` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ));

  const renderMatkul = () =>
    matkulList.length === 0
      ? renderEmpty('Data perkuliahan belum tersedia.')
      : matkulList.map((list: any, index: number) => (
          <TouchableOpacity
            key={`${index}-perkuliahan-${list.kelasKuliahId}`}
            style={styles.card}
            disabled={!isParent}
            onPress={() =>
              isParent &&
              props.navigation.navigate('perkuliahan.detail-absensi', {
                npm: payload.npm ?? user?.npm,
                kodeMatkul: list.kode,
                namaMatkul: list.mataKuliah,
              })
            }>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{list.kode}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.matkulName} numberOfLines={2}>
                {list.mataKuliah} <Text style={styles.sksText}>({list.sks} SKS)</Text>
              </Text>
              {!!list.kelas && <Text style={styles.detailText}>{list.kelas}</Text>}
              {!!list.dosen && (
                <View style={styles.detailRow}>
                  <Icons name="user" size={12} color="#666" />
                  <Text style={styles.detailText} numberOfLines={1}>{list.dosen}</Text>
                </View>
              )}
              {!list.adaJadwal && <Text style={styles.detailText}>Jadwal belum diatur di SIAKAD</Text>}
            </View>
            {isParent && (
              <View style={styles.chevronBox}>
                <Icons name="chevron-right" size={16} color="#15613F" />
              </View>
            )}
          </TouchableOpacity>
        ));

  const renderAgenda = () =>
    agenda.length === 0
      ? renderEmpty('Belum ada pertemuan terjadwal dalam 3 minggu ke depan.')
      : agenda.map((item: any, i: number) => (
          <View key={`ag-${i}-${item.kelasKuliahId}-${item.pertemuan}`} style={styles.card}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{item.jam}</Text>
              <Text style={styles.timeTextSub}>P{item.pertemuan}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.matkulName} numberOfLines={2}>{item.mataKuliah}</Text>
              <Text style={styles.detailText}>{formatTanggal(item.tanggal)}</Text>
              {!!item.judul && <Text style={styles.detailText} numberOfLines={2}>{item.judul}</Text>}
              {!!item.ruangan && (
                <View style={styles.detailRow}>
                  <Icons name="map-marker" size={12} color="#666" />
                  <Text style={styles.detailText}>{item.ruangan}</Text>
                </View>
              )}
            </View>
          </View>
        ));

  const TABS: { key: Tab; label: string }[] = [
    { key: 'jadwal', label: 'Jadwal' },
    { key: 'agenda', label: 'Agenda' },
    { key: 'matkul', label: 'Mata Kuliah' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perkuliahan</Text>
        <TouchableOpacity style={styles.historyButton} onPress={() => props.navigation.push('perkuliahan.history')}>
          <Icons size={20} name="history" color={'#15613F'} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalSks}</Text>
          <Text style={styles.statLabel}>Total SKS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalMatkul}</Text>
          <Text style={styles.statLabel}>Mata Kuliah</Text>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.tabRow}>
          {TABS.map(t => (
            <TouchableOpacity key={t.key} style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]} onPress={() => setTab(t.key)}>
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={() => refetch()} colors={['#15613F']} />}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#15613F" style={styles.centerLoading} />
          ) : failed ? (
            renderEmpty('Gagal memuat jadwal perkuliahan. Tarik ke bawah untuk mencoba lagi.')
          ) : tab === 'jadwal' ? (
            renderJadwal()
          ) : tab === 'agenda' ? (
            renderAgenda()
          ) : (
            renderMatkul()
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', paddingHorizontal: responsiveWidth(5), paddingTop: responsiveWidth(4), gap: 8 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EEF3F0', alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#15613F' },
  tabText: { color: '#15613F', fontWeight: '600', fontSize: responsiveFontSize(1.6) },
  tabTextActive: { color: 'white' },
  dayBlock: { marginBottom: 8 },
  dayTitle: { fontWeight: 'bold', color: '#15613F', fontSize: responsiveFontSize(1.9), marginBottom: 6, marginTop: 4 },
  timeBox: { width: 56, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#EEF3F0', borderRadius: 10, paddingVertical: 8 },
  timeText: { color: '#15613F', fontWeight: 'bold', fontSize: responsiveFontSize(1.7) },
  timeTextSub: { color: '#6B7280', fontSize: responsiveFontSize(1.4) },
  container: {
    flex: 1,
    backgroundColor: '#15613F', // Hijau Utama
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveWidth(8),
    paddingBottom: responsiveWidth(4),
  },
  headerTitle: {
    color: 'white',
    fontSize: responsiveFontSize(3.2),
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveWidth(6),
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: responsiveWidth(6),
    borderRadius: 16,
    paddingVertical: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#E2E8F0',
    fontSize: responsiveFontSize(1.4),
    marginTop: 4,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingBottom: responsiveWidth(10),
  },
  centerLoading: {
    marginTop: responsiveWidth(10),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    elevation: 3, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarBox: {
    backgroundColor: '#E8F5E9', // Hijau pudar
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#15613F',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: responsiveWidth(4),
    justifyContent: 'center',
  },
  matkulName: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  sksText: {
    fontWeight: 'normal',
    color: '#888',
    fontSize: responsiveFontSize(1.6),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: responsiveFontSize(1.5),
    color: '#666',
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: responsiveWidth(10),
    color: '#888',
    fontSize: responsiveFontSize(1.8),
  },
  chevronBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default PerkuliahanComponent;