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
import { getPengabdianOrangTua } from '../../../../src/services/pengabdian/index';

const PengabdianScreen = (props: any) => {
  const { user } = useTokenStore();
  const npm = user?.npm;

  const { data: pengabdianRes, isLoading, isError } = useQuery({
    queryKey: ['pengabdian-ortu', npm],
    queryFn: () => getPengabdianOrangTua(npm as string),
    enabled: !!npm,
  });

  const pengabdianData: any[] = pengabdianRes?.data || [];

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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Icons name="information-outline" size={18} color="#1565C0" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Data pengabdian (KKN) mahasiswa NPM {npm || '-'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.centerText}>Memuat data pengabdian...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centerBox}>
              <Icons name="alert-circle-outline" size={60} color="#EF4444" />
              <Text style={styles.centerText}>Gagal memuat data pengabdian</Text>
            </View>
          ) : pengabdianData.length === 0 ? (
            <View style={styles.centerBox}>
              <Icons name="file-document-outline" size={60} color="#CBD5E0" />
              <Text style={styles.centerText}>Belum ada data</Text>
            </View>
          ) : (
            pengabdianData.map((item: any, index: number) => {
              const mk = item.kelasKuliah?.mataKuliah || {};
              const semester = item.krsMahasiswa?.semester ?? '-';

              return (
                <View key={item.id || index} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.semesterBadge}>
                      <Text style={styles.semesterText}>Semester {semester}</Text>
                    </View>
                  </View>

                  {/* Card Body */}
                  <View style={styles.cardBody}>
                    {/* Mata Kuliah */}
                    <Text style={styles.judulLabel}>Mata Kuliah:</Text>
                    <Text style={styles.judulText}>{mk.nama || 'Kuliah Kerja Nyata (KKN)'}</Text>

                    {/* Kode & SKS */}
                    <View style={styles.detailRow}>
                      <Icons name="book-open-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {mk.kode || '-'}  ·  {mk.totalSks || '-'} SKS
                      </Text>
                    </View>
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
  },
});

export default PengabdianScreen;
