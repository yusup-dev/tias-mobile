import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { useTokenStore } from '../../../../src/store/auth';
import { getSkripsiParent, getAllDosen } from '../../../../src/services/penelitian/index';
import moment from 'moment';

const SkripsiScreen = (props: any) => {
  const { user } = useTokenStore();
  const npm = user?.npm;

  const { data: skripsiRes, isLoading: isSkripsiLoading, isError: isSkripsiError } = useQuery({
    queryKey: ['skripsi-parent', npm],
    queryFn: () => getSkripsiParent(npm as string),
    enabled: !!npm,
  });

  const { data: dosenRes, isLoading: isDosenLoading } = useQuery({
    queryKey: ['all-dosen'],
    queryFn: getAllDosen,
  });

  const skripsiData = skripsiRes?.data || [];
  const dosenData = dosenRes?.data || [];

  const getDosenName = (userId: string) => {
    if (!userId) return 'Belum ditentukan';
    const dosen = dosenData.find((d: any) => d.user_id === userId);
    return dosen ? dosen.nama_lengkap : 'Belum ditentukan';
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pengajuan-sk':
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706' }; // Amber
      case 'aktif':
      case 'approved':
      case 'disetujui':
        return { bg: '#D1FAE5', text: '#059669' }; // Green
      case 'selesai':
      case 'lulus':
        return { bg: '#DBEAFE', text: '#2563EB' }; // Blue
      case 'ditolak':
      case 'rejected':
        return { bg: '#FEE2E2', text: '#DC2626' }; // Red
      default:
        return { bg: '#F3F4F6', text: '#4B5563' }; // Gray
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return '-';
    switch (status.toLowerCase()) {
      case 'pengajuan-sk':
        return 'Pengajuan SK';
      case 'approved':
        return 'Disetujui';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Penelitian</Text>
      </View>

      {/* ── Body Wrapper ── */}
      <View style={styles.bodyWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          <View style={styles.infoBanner}>
            <Icons name="information-outline" size={18} color="#1565C0" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Status penelitian mahasiswa NPM {npm || '-'}
            </Text>
          </View>

          {isSkripsiLoading || isDosenLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.centerText}>Memuat data skripsi...</Text>
            </View>
          ) : isSkripsiError ? (
            <View style={styles.centerBox}>
              <Icons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.centerText}>Gagal memuat data penelitian</Text>
            </View>
          ) : skripsiData.length === 0 ? (
            <View style={styles.centerBox}>
              <Icons name="file-document-outline" size={60} color="#CBD5E0" />
              <Text style={styles.centerText}>Belum ada data</Text>
            </View>
          ) : (
            skripsiData.map((item: any, index: number) => {
              const statusColors = getStatusColor(item.status);

              return (
                <View key={`skripsi-${item.id || index}`} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.semesterBadge}>
                      <Text style={styles.semesterText}>Semester {item.semester || '-'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {getStatusText(item.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.judulLabel}>Judul Penelitian:</Text>
                    <Text style={styles.judulText}>{item.judul_skripsi || '-'}</Text>

                    <View style={styles.detailRow}>
                      <Icons name="map-marker-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{item.lokasi_kegiatan || '-'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.pembimbingLabel}>Dosen Pembimbing:</Text>
                    <View style={styles.pembimbingItem}>
                      <View style={styles.pembimbingIconBox}>
                        <Icons name="account-tie" size={14} color="#10B981" />
                      </View>
                      <View>
                        <Text style={styles.pembimbingRole}>Pembimbing Utama</Text>
                        <Text style={styles.pembimbingNameText}>
                          {getDosenName(item.sk_pembimbing_1)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.pembimbingItem}>
                      <View style={styles.pembimbingIconBox}>
                        <Icons name="account-tie-outline" size={14} color="#10B981" />
                      </View>
                      <View>
                        <Text style={styles.pembimbingRole}>Pembimbing Pendamping</Text>
                        <Text style={styles.pembimbingNameText}>
                          {getDosenName(item.sk_pembimbing_2)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Icons name="clock-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.footerText}>
                      Pembaruan: {item.updated_at ? moment(item.updated_at).format('DD MMM YYYY, HH:mm') : '-'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },

  // Header
  header: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveWidth(3),
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

  // Body wrapper
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  // ScrollView
  scrollView: { flex: 1 },
  scrollContent: {
    padding: responsiveWidth(4),
    paddingBottom: responsiveWidth(10),
  },

  // Info Banner
  infoBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveWidth(2.5),
    marginBottom: responsiveWidth(4),
  },
  infoBannerText: {
    fontSize: responsiveFontSize(1.5),
    color: '#1565C0',
    flex: 1,
  },

  // Center states
  centerBox: {
    alignItems: 'center',
    paddingTop: responsiveWidth(15),
    paddingBottom: responsiveWidth(10),
  },
  centerText: {
    marginTop: responsiveWidth(4),
    fontSize: responsiveFontSize(1.9),
    color: '#718096',
    fontWeight: '600',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    marginBottom: responsiveWidth(4),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  semesterBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  semesterText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#15613F',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
  },
  cardBody: {
    padding: responsiveWidth(4),
  },
  judulLabel: {
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    marginBottom: 4,
  },
  judulText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: responsiveFontSize(1.6),
    color: '#4B5563',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  pembimbingLabel: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  pembimbingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pembimbingIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pembimbingIconText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    color: '#10B981',
  },
  pembimbingRole: {
    fontSize: responsiveFontSize(1.2),
    color: '#6B7280',
    fontWeight: '600',
  },
  pembimbingNameText: {
    fontSize: responsiveFontSize(1.6),
    color: '#1F2937',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2.5),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
    marginLeft: 6,
  },
});

export default SkripsiScreen;
