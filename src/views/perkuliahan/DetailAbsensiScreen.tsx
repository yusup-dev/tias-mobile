import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { absensiDetail } from '../../services/perkuliahan/index';
import moment from 'moment';

const DetailAbsensiScreen = ({ route, navigation }: any) => {
  const { npm, kodeMatkul, namaMatkul } = route.params || {};

  const { data, isLoading, isError } = useQuery({
    queryKey: ['absensi-detail', npm, kodeMatkul],
    queryFn: () => absensiDetail(npm, kodeMatkul),
    enabled: !!npm && !!kodeMatkul,
  });

  const absensiData = data?.data;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15613F" />
        <Text style={styles.loadingText}>Memuat Detail Absensi...</Text>
      </View>
    );
  }

  if (isError || !absensiData) {
    return (
      <View style={styles.errorContainer}>
        <Icons name="alert-circle-outline" size={50} color="#E53E3E" />
        <Text style={styles.errorText}>Gagal memuat data absensi.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const normalizeStatus = (s: any) => (s ?? '').toString().trim().toLowerCase();

  const isAlpaStatus = (s: string) =>
    s === 'alpa' ||
    s === 'alfa' ||
    s === 'alpha' ||
    s.includes('tidak hadir') ||
    s.includes('tanpa keterangan');

  const getStatusColor = (status: string) => {
    const s = normalizeStatus(status);
    if (s === 'hadir') return '#2D9CDB'; // Blue
    if (isAlpaStatus(s)) return '#EB5757'; // Red
    if (s === 'izin') return '#F2994A'; // Orange
    if (s === 'sakit') return '#27AE60'; // Green
    return '#828282';
  };

  const getStatusIcon = (status: string) => {
    const s = normalizeStatus(status);
    if (s === 'hadir') return 'check-circle';
    if (isAlpaStatus(s)) return 'close-circle';
    if (s === 'izin') return 'email-open';
    if (s === 'sakit') return 'medical-bag';
    return 'help-circle';
  };

  // Rincian per pertemuan = sumber kebenaran yang benar-benar ditampilkan ke user.
  const rincian: any[] = Array.isArray(absensiData?.rincian_absensi)
    ? absensiData.rincian_absensi
    : [];

  const countStatus = (predicate: (s: string) => boolean) =>
    rincian.filter(item => predicate(normalizeStatus(item.status))).length;

  const hasRincian = rincian.length > 0;

  // Kalau ada rincian, hitung langsung dari list agar ringkasan selalu cocok
  // dengan daftar pertemuan. Kalau tidak ada, fallback ke agregat dari API.
  const hadir = hasRincian
    ? countStatus(s => s === 'hadir')
    : absensiData?.hadir || 0;
  const izin = hasRincian
    ? countStatus(s => s === 'izin')
    : absensiData?.izin || 0;
  const sakit = hasRincian
    ? countStatus(s => s === 'sakit')
    : absensiData?.sakit || 0;
  const alpa = hasRincian
    ? countStatus(
        s =>
          s === 'alpa' ||
          s === 'alfa' ||
          s === 'alpha' ||
          s.includes('tidak hadir') ||
          s.includes('tanpa keterangan'),
      )
    : absensiData?.alpa ?? 0;

  const total = absensiData?.total_pertemuan || (hasRincian ? rincian.length : 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15613F" />

      {/* ── Header (Fixed Green Section) ── */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Icons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Absensi</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.matkulInfo}>
          <Text style={styles.matkulName}>{absensiData?.nama_matkul || namaMatkul || '-'}</Text>
          <Text style={styles.matkulCode}>{absensiData?.kode || kodeMatkul || '-'}</Text>
        </View>
      </View>

      {/* ── Body Wrapper (White Scrolling Container like SKPI) ── */}
      <View style={styles.bodyWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* Attendance Percentage Card */}
          <View style={styles.percentageCard}>
            <View style={styles.percentageCircle}>
              <Text style={styles.percentageValue}>{absensiData?.persentase || '0%'}</Text>
              <Text style={styles.percentageLabel}>Kehadiran</Text>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#2D9CDB' }]} />
                <Text style={styles.statText}>Hadir: {hadir}</Text>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#EB5757' }]} />
                <Text style={styles.statText}>Alpa: {alpa}</Text>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#F2994A' }]} />
                <Text style={styles.statText}>Izin: {izin}</Text>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#27AE60' }]} />
                <Text style={styles.statText}>Sakit: {sakit}</Text>
              </View>
              <Text style={styles.totalPertemuan}>Total: {total} Pertemuan</Text>
            </View>
          </View>

          {/* List Container */}
          <View style={styles.listContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Riwayat Pertemuan</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{rincian.length} Data</Text>
              </View>
            </View>

            {rincian.map((item: any, index: number) => (
              <View key={index} style={styles.attendanceItem}>
                <View style={styles.itemLeft}>
                  <View style={[styles.pertemuanCircle, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.pertemuanNumber, { color: getStatusColor(item.status) }]}>
                      {item.pertemuan}
                    </Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemDate}>
                      {moment(item.tanggal).isValid() ? moment(item.tanggal).format('DD MMMM YYYY') : '-'}
                    </Text>
                    <Text style={styles.itemKeterangan}>
                      {normalizeStatus(item.status) === 'hadir' ? 'Tercatat hadir' : (item.keterangan || '-')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Icons name={getStatusIcon(item.status)} size={14} color="white" style={{ marginRight: 4 }} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            ))}

            {!rincian.length && (
              <View style={styles.emptyContainer}>
                <Icons name="information-outline" size={40} color="#CBD5E0" />
                <Text style={styles.emptyText}>Belum ada data riwayat pertemuan.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    color: '#15613F',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#15613F',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: '#15613F',
    paddingBottom: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(4),
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },
  matkulInfo: {
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  matkulName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  matkulCode: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  percentageCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  percentageCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#15613F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15613F',
  },
  percentageLabel: {
    fontSize: 10,
    color: '#666',
  },
  summaryStats: {
    flex: 1,
    marginLeft: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statText: {
    fontSize: 13,
    color: '#4F4F4F',
    fontWeight: '500',
  },
  totalPertemuan: {
    fontSize: 12,
    color: '#828282',
    marginTop: 4,
    fontStyle: 'italic',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  badgeText: {
    color: '#15613F',
    fontSize: 12,
    fontWeight: '600',
  },
  attendanceItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pertemuanCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pertemuanNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfo: {
    justifyContent: 'center',
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemKeterangan: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DetailAbsensiScreen;
