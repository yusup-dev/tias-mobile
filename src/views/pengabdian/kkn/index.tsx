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
import moment from 'moment';
import { useTokenStore } from '../../../store/auth';
import { getPengabdianParent } from '../../../services/pengabdian/index';

const PengabdianScreen = (props: any) => {
  const { user } = useTokenStore();
  const npm = user?.npm;
  const [activeTab, setActiveTab] = React.useState<'pengabdian' | 'pembicara'>('pengabdian');

  const { data: pengabdianRes, isLoading, isError } = useQuery({
    queryKey: ['pengabdian-ortu', npm],
    queryFn: () => getPengabdianParent(npm as string),
    enabled: !!npm,
  });

  const pengabdianData: any[] = pengabdianRes?.data?.pengabdian || [];
  const pembicaraData: any[] = pengabdianRes?.data?.pembicara || [];
  const currentData = activeTab === 'pengabdian' ? pengabdianData : pembicaraData;

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengabdian</Text>
      </View>

      {/* ── Body Wrapper ── */}
      <View style={styles.bodyWrapper}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pengabdian' && styles.activeTabButton]}
            onPress={() => setActiveTab('pengabdian')}>
            <Text style={[styles.tabButtonText, activeTab === 'pengabdian' && styles.activeTabButtonText]}>
              Pengabdian ({pengabdianData.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pembicara' && styles.activeTabButton]}
            onPress={() => setActiveTab('pembicara')}>
            <Text style={[styles.tabButtonText, activeTab === 'pembicara' && styles.activeTabButtonText]}>
              Pembicara ({pembicaraData.length})
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
              Data {activeTab === 'pengabdian' ? 'pengabdian masyarakat' : 'pembicara seminar'} NPM {npm || '-'}
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
              if (activeTab === 'pengabdian') {
                return (
                  <View key={item.pengabdian_id || index} style={styles.card}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.semesterBadge}>
                        <Text style={styles.semesterText}>{item.kelompok_bidang || 'Pengabdian'}</Text>
                      </View>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointText}>+{item.point || 0} Poin</Text>
                      </View>
                    </View>

                    {/* Card Body */}
                    <View style={styles.cardBody}>
                      {/* Judul Kegiatan */}
                      <Text style={styles.judulLabel}>Judul Kegiatan:</Text>
                      <Text style={styles.judulText}>{item.judul_kegiatan || '-'}</Text>

                      {/* Kategori */}
                      <View style={styles.detailRow}>
                        <Icons name="bookmark-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.nama_kategori || '-'}</Text>
                      </View>

                      {/* Lokasi & Durasi */}
                      <View style={styles.detailRow}>
                        <Icons name="map-marker-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Lokasi: {item.lokasi_kegiatan || '-'} ({item.lama_kegiatan || '-'})
                        </Text>
                      </View>

                      {/* SK Penugasan */}
                      <View style={styles.detailRow}>
                        <Icons name="file-document-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>SK: {item.no_sk_penugasan || '-'}</Text>
                      </View>

                      {/* Tanggal SK */}
                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Tanggal SK: {item.tgl_sk_penugasan ? moment(item.tgl_sk_penugasan).format('DD MMMM YYYY') : '-'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={item.pembicara_id || index} style={styles.card}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={[styles.semesterBadge, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={[styles.semesterText, { color: '#1565C0' }]}>
                          {item.kategori_pembicara || 'Pembicara'}
                        </Text>
                      </View>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointText}>+{item.point || 0} Poin</Text>
                      </View>
                    </View>

                    {/* Card Body */}
                    <View style={styles.cardBody}>
                      {/* Judul Makalah */}
                      <Text style={styles.judulLabel}>Judul Makalah / Materi:</Text>
                      <Text style={styles.judulText}>{item.judul_makalah || '-'}</Text>

                      {/* Kategori */}
                      <View style={styles.detailRow}>
                        <Icons name="bookmark-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.nama_kategori || '-'}</Text>
                      </View>

                      {/* Pertemuan */}
                      <View style={styles.detailRow}>
                        <Icons name="account-group-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Pertemuan: {item.nama_pertemuan || '-'} ({item.tingkat_pertemuan || '-'})
                        </Text>
                      </View>

                      {/* Penyelenggara */}
                      <View style={styles.detailRow}>
                        <Icons name="office-building" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Penyelenggara: {item.penyelenggara || '-'}</Text>
                      </View>

                      {/* Bahasa */}
                      <View style={styles.detailRow}>
                        <Icons name="translate" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Bahasa: {item.bahasa || '-'}</Text>
                      </View>

                      {/* SK Penugasan */}
                      <View style={styles.detailRow}>
                        <Icons name="file-document-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>SK: {item.no_sk_penugasan || '-'}</Text>
                      </View>

                      {/* Tanggal SK */}
                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Tanggal SK: {item.tgl_sk_penugasan ? moment(item.tgl_sk_penugasan).format('DD MMMM YYYY') : '-'}
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

  // Tabs style
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

export default PengabdianScreen;

export default PengabdianScreen;
