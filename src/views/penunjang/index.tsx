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
import { useTokenStore } from '../../store/auth';
import { getPenunjangOrangTua } from '../../services/penunjang/index';
import { getPenunjangPenghargaanSaya, getPenunjangProfesiSaya } from '../../services/triDharma/index';

const PenunjangScreen = (props: any) => {
  const { user } = useTokenStore();
  const npm = user?.npm;
  const isParent = user?.role === 'Parent';
  const [activeTab, setActiveTab] = React.useState<'penghargaan' | 'organisasi'>('penghargaan');

  const { data: penunjangRes, isLoading: isLoadingParent, isError: isErrorParent } = useQuery({
    queryKey: ['penunjang-orang-tua', npm],
    queryFn: () => getPenunjangOrangTua(npm as string),
    enabled: isParent && !!npm,
  });

  const { data: penghargaanRes, isLoading: isLoadingPenghargaan, isError: isErrorPenghargaan } = useQuery({
    queryKey: ['penunjang-penghargaan-saya'],
    queryFn: getPenunjangPenghargaanSaya,
    enabled: !isParent,
  });

  const { data: profesiRes, isLoading: isLoadingProfesi, isError: isErrorProfesi } = useQuery({
    queryKey: ['penunjang-profesi-saya'],
    queryFn: getPenunjangProfesiSaya,
    enabled: !isParent,
  });

  const isLoading = isParent ? isLoadingParent : isLoadingPenghargaan || isLoadingProfesi;
  const isError = isParent ? isErrorParent : isErrorPenghargaan || isErrorProfesi;

  const penghargaanData: any[] = isParent
    ? penunjangRes?.data?.penghargaan || []
    : penghargaanRes?.data || [];
  const organisasiData: any[] = isParent
    ? penunjangRes?.data?.organisasi || []
    : profesiRes?.data || [];
  const currentData = activeTab === 'penghargaan' ? penghargaanData : organisasiData;

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Penunjang</Text>
      </View>

      {/* ── Body Wrapper ── */}
      <View style={styles.bodyWrapper}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'penghargaan' && styles.activeTabButton]}
            onPress={() => setActiveTab('penghargaan')}>
            <Text style={[styles.tabButtonText, activeTab === 'penghargaan' && styles.activeTabButtonText]}>
              Penghargaan ({penghargaanData.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'organisasi' && styles.activeTabButton]}
            onPress={() => setActiveTab('organisasi')}>
            <Text style={[styles.tabButtonText, activeTab === 'organisasi' && styles.activeTabButtonText]}>
              Organisasi Profesi ({organisasiData.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Icons name="information-outline" size={18} color="#1565C0" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Data {activeTab === 'penghargaan' ? 'penghargaan/prestasi' : 'keanggotaan organisasi profesi'}
              {isParent ? ` NPM ${npm || '-'}` : ' milik Anda'}
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
              if (activeTab === 'penghargaan') {
                return (
                  <View key={item.peng_id || index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.semesterBadge}>
                        <Text style={styles.semesterText}>{item.nama_kategori || 'Penghargaan'}</Text>
                      </View>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointText}>+{item.point || 0} Poin</Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.judulLabel}>Nama Penghargaan:</Text>
                      <Text style={styles.judulText}>{item.nama_peng || '-'}</Text>

                      <View style={styles.detailRow}>
                        <Icons name="office-building" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Pemberi: {item.instansi_pemberi || '-'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Icons name="podium-gold" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Tingkat: {item.tingkat_peng || '-'} ({item.jenis_peng || '-'})
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Tahun: {item.tahun_peng || '-'}</Text>
                      </View>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={item.prof_id || index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.semesterBadge, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={[styles.semesterText, { color: '#1565C0' }]}>
                          {item.peran || 'Anggota'}
                        </Text>
                      </View>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointText}>+{item.point || 0} Poin</Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.judulLabel}>Organisasi:</Text>
                      <Text style={styles.judulText}>{item.nama_organisasi || '-'}</Text>

                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Periode: {item.mulai_bulan || '-'}/{item.mulai_tahun || '-'} — {item.selesai_bulan || '-'}/{item.selesai_tahun || '-'}
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
    fontSize: responsiveFontSize(1.6),
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
  pointBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    color: '#E65100',
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

export default PenunjangScreen;
