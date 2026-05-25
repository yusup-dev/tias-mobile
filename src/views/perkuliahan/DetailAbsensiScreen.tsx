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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'hadir':
        return '#2D9CDB'; // Blue
      case 'alpa':
        return '#EB5757'; // Red
      case 'izin':
        return '#F2994A'; // Orange
      case 'sakit':
        return '#27AE60'; // Green
      default:
        return '#828282';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'hadir':
        return 'check-circle';
      case 'alpa':
        return 'close-circle';
      case 'izin':
        return 'email-open';
      case 'sakit':
        return 'medical-bag';
      default:
        return 'help-circle';
    }
  };

  // Safe calculations
  const total = absensiData?.total_pertemuan || 0;
  const hadir = absensiData?.hadir || 0;
  const izin = absensiData?.izin || 0;
  const sakit = absensiData?.sakit || 0;
  const alpa = absensiData?.alpa ?? Math.max(0, total - hadir - izin - sakit);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15613F" />
      
      {/* Header */}
      <LinearGradient
        colors={['#15613F', '#219653']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icons name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Absensi</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.matkulInfo}>
          <Text style={styles.matkulName}>{absensiData?.nama_matkul || namaMatkul || '-'}</Text>
          <Text style={styles.matkulCode}>{absensiData?.kode || kodeMatkul || '-'}</Text>
        </View>

        {/* Attendance Percentage Card overlaying header and content */}
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
              <Text style={styles.statText}>Izin/Sakit: {izin + sakit}</Text>
            </View>
            <Text style={styles.totalPertemuan}>Total: {total} Pertemuan</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Pertemuan</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{absensiData?.rincian_absensi?.length || 0} Data</Text>
          </View>
        </View>

        {absensiData?.rincian_absensi?.map((item: any, index: number) => (
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
                  {item.status === 'Hadir' ? 'Tercatat hadir' : (item.keterangan || '-')}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Icons name={getStatusIcon(item.status)} size={14} color="white" style={{ marginRight: 4 }} />
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}

        {!absensiData?.rincian_absensi?.length && (
          <View style={styles.emptyContainer}>
            <Icons name="information-outline" size={40} color="#CBD5E0" />
            <Text style={styles.emptyText}>Belum ada data riwayat pertemuan.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  matkulInfo: {
    alignItems: 'center',
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
  percentageCard: {
    position: 'absolute',
    bottom: -60,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
