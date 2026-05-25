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

  const { data: kompetensiRes, isLoading, isError } = useQuery({
    queryKey: ['kompetensi-parent', npm],
    queryFn: () => getKompetensiParent(npm as string),
    enabled: !!npm,
  });

  const kompetensiData = kompetensiRes?.data || {
    sertifikasi: [],
    tes: [],
  };

  const renderSertifikasi = () => {
    if (!kompetensiData.sertifikasi || kompetensiData.sertifikasi.length === 0) {
      return null;
    }
    return kompetensiData.sertifikasi.map((item: any, index: number) => (
      <View key={`sertifikasi-${index}`} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.kategoriBadge}>
            <Text style={styles.kategoriText}>{item.nama_kategori || 'Sertifikasi'}</Text>
          </View>
          <View style={styles.pointBadge}>
            <Text style={styles.pointText}>{item.point} Poin</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.titleText}>{item.nama_serti || '-'}</Text>
          <View style={styles.detailRow}>
            <Icons name="office-building-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>{item.penyelenggara || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icons name="calendar-check-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>
              {item.tgl_serti ? moment(item.tgl_serti).format('DD MMMM YYYY') : '-'}
            </Text>
          </View>
          {item.jenis_serti && (
            <View style={styles.detailRow}>
              <Icons name="tag-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.detailText}>Jenis: {item.jenis_serti}</Text>
            </View>
          )}
        </View>
      </View>
    ));
  };

  const renderTes = () => {
    if (!kompetensiData.tes || kompetensiData.tes.length === 0) {
      return null;
    }
    return kompetensiData.tes.map((item: any, index: number) => (
      <View key={`tes-${index}`} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.kategoriBadge}>
            <Text style={styles.kategoriText}>{item.nama_kategori || 'Tes'}</Text>
          </View>
          <View style={styles.pointBadge}>
            <Text style={styles.pointText}>{item.point} Poin</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.titleText}>{item.nama_tes || '-'}</Text>
          <View style={styles.detailRow}>
            <Icons name="school-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>{item.penyelenggara || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icons name="chart-bell-curve-cumulative" size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={[styles.detailText, { fontWeight: 'bold', color: '#15613F' }]}>
              Skor: {item.skor_tes || '-'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icons name="calendar-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>
              {item.tgl_tes ? moment(item.tgl_tes).format('DD MMMM YYYY') : '-'}
            </Text>
          </View>
        </View>
      </View>
    ));
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
        <Text style={styles.headerTitle}>Kompetensi</Text>
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
              Menampilkan data kompetensi untuk mahasiswa dengan NPM {npm || '-'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.centerText}>Memuat data kompetensi...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centerBox}>
              <Icons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.centerText}>Gagal memuat data</Text>
            </View>
          ) : (!kompetensiData.sertifikasi?.length && !kompetensiData.tes?.length) ? (
            <View style={styles.centerBox}>
              <Icons name="folder-open-outline" size={60} color="#CBD5E0" />
              <Text style={styles.centerText}>Belum ada data</Text>
            </View>
          ) : (
            <>
              {renderSertifikasi()}
              {renderTes()}
            </>
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
    paddingBottom: responsiveHeight(1),
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
  kategoriBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    flexShrink: 1,
  },
  kategoriText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#15613F',
  },
  pointBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    color: '#D97706',
  },
  cardBody: {
    padding: responsiveWidth(4),
  },
  titleText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: responsiveFontSize(1.5),
    color: '#4B5563',
  },
});

export default KompetensiScreen;
