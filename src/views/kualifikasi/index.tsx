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
import {
  getKualifikasiPendidikanSaya,
  getKualifikasiRiwayatPekerjaanSaya,
} from '../../services/triDharma/index';

const KualifikasiScreen = (props: any) => {
  const [activeTab, setActiveTab] = React.useState<'pendidikan' | 'pekerjaan'>('pendidikan');

  const { data: pendidikanRes, isLoading: isLoadingPendidikan, isError: isErrorPendidikan } = useQuery({
    queryKey: ['kualifikasi-pendidikan-saya'],
    queryFn: getKualifikasiPendidikanSaya,
  });

  const { data: pekerjaanRes, isLoading: isLoadingPekerjaan, isError: isErrorPekerjaan } = useQuery({
    queryKey: ['kualifikasi-riwayat-pekerjaan-saya'],
    queryFn: getKualifikasiRiwayatPekerjaanSaya,
  });

  const pendidikanData: any[] = pendidikanRes?.data || [];
  const pekerjaanData: any[] = pekerjaanRes?.data || [];
  const isLoading = activeTab === 'pendidikan' ? isLoadingPendidikan : isLoadingPekerjaan;
  const isError = activeTab === 'pendidikan' ? isErrorPendidikan : isErrorPekerjaan;
  const currentData = activeTab === 'pendidikan' ? pendidikanData : pekerjaanData;

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kualifikasi</Text>
      </View>

      {/* ── Body Wrapper ── */}
      <View style={styles.bodyWrapper}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pendidikan' && styles.activeTabButton]}
            onPress={() => setActiveTab('pendidikan')}>
            <Text style={[styles.tabButtonText, activeTab === 'pendidikan' && styles.activeTabButtonText]}>
              Pendidikan Formal ({pendidikanData.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pekerjaan' && styles.activeTabButton]}
            onPress={() => setActiveTab('pekerjaan')}>
            <Text style={[styles.tabButtonText, activeTab === 'pekerjaan' && styles.activeTabButtonText]}>
              Riwayat Pekerjaan ({pekerjaanData.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          <View style={styles.infoBanner}>
            <Icons name="information-outline" size={18} color="#1565C0" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Data {activeTab === 'pendidikan' ? 'riwayat pendidikan formal' : 'riwayat pekerjaan'} milik Anda
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.centerText}>Memuat data...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centerBox}>
              <Icons name="alert-circle-outline" size={60} color="#EF4444" />
              <Text style={styles.centerText}>Gagal memuat data</Text>
            </View>
          ) : currentData.length === 0 ? (
            <View style={styles.centerBox}>
              <Icons name="file-document-outline" size={60} color="#CBD5E0" />
              <Text style={styles.centerText}>Belum ada data</Text>
            </View>
          ) : (
            currentData.map((item: any, index: number) => {
              if (activeTab === 'pendidikan') {
                return (
                  <View key={item.pend_id || index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.semesterBadge}>
                        <Text style={styles.semesterText}>{item.jenjang_studi || 'Pendidikan'}</Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.judulLabel}>Asal Institusi:</Text>
                      <Text style={styles.judulText}>{item.asal || '-'}</Text>

                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Tahun: {item.tahun_masuk || '-'} — {item.tahun_lulus || '-'}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Icons name="card-account-details-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>No. Induk: {item.nomor_induk || '-'}</Text>
                      </View>

                      {item.no_ijazah ? (
                        <View style={styles.detailRow}>
                          <Icons name="file-certificate-outline" size={16} color="#6B7280" />
                          <Text style={styles.detailText}>No. Ijazah: {item.no_ijazah}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={item.rwyt_id || index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.semesterBadge, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={[styles.semesterText, { color: '#1565C0' }]}>
                          {item.jenis_pekerjaan || 'Pekerjaan'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.judulLabel}>Jabatan:</Text>
                      <Text style={styles.judulText}>{item.jabatan || '-'}</Text>

                      <View style={styles.detailRow}>
                        <Icons name="office-building" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Instansi: {item.nama_instansi || '-'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Icons name="briefcase-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Bidang Usaha: {item.bidang_usaha || '-'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Mulai Kerja: {item.mulai_kerja || '-'}{item.selesai_kerja ? ` — ${item.selesai_kerja}` : ' — Sekarang'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },

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

  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: responsiveWidth(3),
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#E8F5E9',
  },
  tabButtonText: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#15613F',
    fontWeight: 'bold',
  },

  scrollView: { flex: 1 },
  scrollContent: {
    padding: responsiveWidth(4),
    paddingBottom: responsiveWidth(10),
  },

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
    marginBottom: 10,
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
    flex: 1,
  },
});

export default KualifikasiScreen;
