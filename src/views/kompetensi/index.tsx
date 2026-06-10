import React, { useState } from 'react';
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
import { useTokenStore } from '../../../src/store/auth';
import { getKompetensiParent } from '../../../src/services/kompetensi/index';
import moment from 'moment';

const KompetensiScreen = (props: any) => {
  const { user } = useTokenStore();
  const npm = user?.npm;
  const [activeTab, setActiveTab] = useState<'sertifikasi' | 'tes'>('sertifikasi');

  const { data: kompetensiRes, isLoading, isError } = useQuery({
    queryKey: ['kompetensi-parent', npm],
    queryFn: () => getKompetensiParent(npm as string),
    enabled: !!npm,
  });

  const kompetensiData = kompetensiRes?.data || {
    sertifikasi: [],
    tes: [],
  };

  const sertifikasiData: any[] = kompetensiData.sertifikasi || [];
  const tesData: any[] = kompetensiData.tes || [];
  const currentData = activeTab === 'sertifikasi' ? sertifikasiData : tesData;

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kompetensi</Text>
      </View>

      {/* ── Body Wrapper ── */}
      <View style={styles.bodyWrapper}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'sertifikasi' && styles.activeTabButton]}
            onPress={() => setActiveTab('sertifikasi')}>
            <Text style={[styles.tabButtonText, activeTab === 'sertifikasi' && styles.activeTabButtonText]}>
              Sertifikasi ({sertifikasiData.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'tes' && styles.activeTabButton]}
            onPress={() => setActiveTab('tes')}>
            <Text style={[styles.tabButtonText, activeTab === 'tes' && styles.activeTabButtonText]}>
              Tes Bahasa/Lain ({tesData.length})
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
              Data {activeTab === 'sertifikasi' ? 'sertifikasi kompetensi/pelatihan' : 'riwayat tes akademik'} NPM {npm || '-'}
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
              if (activeTab === 'sertifikasi') {
                return (
                  <View key={item.sertifikat_id || index} style={styles.card}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.semesterBadge}>
                        <Text style={styles.semesterText}>{item.bidang_studi || 'Kompetensi'}</Text>
                      </View>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointText}>+{item.point || 0} Poin</Text>
                      </View>
                    </View>

                    {/* Card Body */}
                    <View style={styles.cardBody}>
                      {/* Nama Sertifikasi */}
                      <Text style={styles.judulLabel}>Nama Sertifikasi / Pelatihan:</Text>
                      <Text style={styles.judulText}>{item.nama_serti || '-'}</Text>

                      {/* Kategori */}
                      <View style={styles.detailRow}>
                        <Icons name="bookmark-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.nama_kategori || '-'}</Text>
                      </View>

                      {/* Penyelenggara */}
                      <View style={styles.detailRow}>
                        <Icons name="office-building" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Penyelenggara: {item.penyelenggara || '-'}</Text>
                      </View>

                      {/* Jenis Sertifikat */}
                      <View style={styles.detailRow}>
                        <Icons name="tag-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Jenis: {item.jenis_serti || '-'}</Text>
                      </View>

                      {/* Tanggal Terbit */}
                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Tanggal Sertifikasi: {item.tgl_serti ? moment(item.tgl_serti).format('DD MMMM YYYY') : '-'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={item.tes_id || index} style={styles.card}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={[styles.semesterBadge, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={[styles.semesterText, { color: '#1565C0' }]}>
                          {item.jenis_tes || 'Tes'}
                        </Text>
                      </View>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointText}>+{item.point || 0} Poin</Text>
                      </View>
                    </View>

                    {/* Card Body */}
                    <View style={styles.cardBody}>
                      {/* Nama Tes */}
                      <Text style={styles.judulLabel}>Nama Tes:</Text>
                      <Text style={styles.judulText}>{item.nama_tes || '-'}</Text>

                      {/* Kategori */}
                      <View style={styles.detailRow}>
                        <Icons name="bookmark-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.nama_kategori || '-'}</Text>
                      </View>

                      {/* Skor Tes */}
                      <View style={styles.detailRow}>
                        <Icons name="chart-bell-curve-cumulative" size={16} color="#15613F" />
                        <Text style={[styles.detailText, { fontWeight: 'bold', color: '#15613F' }]}>
                          Skor: {item.skor_tes || '-'}
                        </Text>
                      </View>

                      {/* Penyelenggara */}
                      <View style={styles.detailRow}>
                        <Icons name="office-building" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Penyelenggara: {item.penyelenggara || '-'}</Text>
                      </View>

                      {/* Tanggal Tes */}
                      <View style={styles.detailRow}>
                        <Icons name="calendar-range" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Tanggal Tes: {item.tgl_tes ? moment(item.tgl_tes).format('DD MMMM YYYY') : '-'}
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

export default KompetensiScreen;

export default KompetensiScreen;
