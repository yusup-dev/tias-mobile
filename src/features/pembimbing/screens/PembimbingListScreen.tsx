import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import {
  getPengajuanPembimbingUntukDosen,
  PengajuanPembimbingItem,
} from '../../../services/tugasAkhir';

const cleanPeran = (peran?: string) => {
  if (!peran) return '-';
  return peran
    .split('|')
    .map(p => p.trim())
    .filter(Boolean)
    .join(', ');
};

const MY_ROLE_FIELDS: { keyword: string; field: keyof PengajuanPembimbingItem }[] = [
  { keyword: 'SK Pembimbing 1', field: 'sk_status_pem_1' },
  { keyword: 'SK Pembimbing 2', field: 'sk_status_pem_2' },
  { keyword: 'SK Pembimbing 3', field: 'sk_status_pem_3' },
  { keyword: 'Kepala Lab', field: 'status_kepala_lab' },
];

// `peran` cuma berisi peran milik dosen yang sedang login (lihat query getForDosen di backend),
// jadi status "sudah ACC" di sini harus dicek per-peran dosen ybs, bukan menunggu semua pihak lain.
const isApprovedByMe = (item: PengajuanPembimbingItem) => {
  const myFields = MY_ROLE_FIELDS.filter(r => item.peran?.includes(r.keyword)).map(r => r.field);
  if (myFields.length === 0) return false;
  return myFields.every(field => !!item[field]);
};

const PembimbingListScreen = (props: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['pengajuan-pembimbing-dosen'],
    queryFn: getPengajuanPembimbingUntukDosen,
  });

  // Jaga-jaga: pastikan data selalu di-refresh tiap kali layar ini dibuka lagi
  // (mis. baru selesai approve di layar detail lalu kembali ke sini), bukan cuma
  // mengandalkan invalidateQueries dari layar lain.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const list: PengajuanPembimbingItem[] = data?.data || [];

  const filteredList = list.filter(item => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.nama_lengkap?.toLowerCase().includes(q) ||
      item.npm?.toLowerCase().includes(q) ||
      item.judul_skripsi?.toLowerCase().includes(q) ||
      item.peran?.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icons name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajuan Dosen Pembimbing</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchContainer}>
          <Icons name="magnify" size={22} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, NPM, atau judul skripsi..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.bodyWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} colors={['#15613F']} />}
        >
          <View style={styles.infoBanner}>
            <Icons name="information-outline" size={18} color="#1565C0" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Daftar mahasiswa yang mengajukan Anda sebagai dosen pembimbing / kepala lab tugas akhir.
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.centerText}>Memuat data ajuan...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centerBox}>
              <Icons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.centerText}>Gagal memuat data ajuan</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
                <Text style={styles.retryBtnText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : list.length === 0 ? (
            <View style={styles.centerBox}>
              <Icons name="file-account-outline" size={60} color="#CBD5E0" />
              <Text style={styles.centerText}>Belum ada ajuan pembimbing</Text>
            </View>
          ) : filteredList.length === 0 ? (
            <View style={styles.centerBox}>
              <Icons name="magnify" size={60} color="#CBD5E0" />
              <Text style={styles.centerText}>Tidak ada hasil untuk "{searchQuery}"</Text>
            </View>
          ) : (
            filteredList.map((item, index) => {
              const approved = isApprovedByMe(item);
              return (
                <TouchableOpacity
                  key={`pengajuan-${item.id || index}`}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() =>
                    props.navigation.navigate('home.pembimbing-detail', { id: item.id })
                  }
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText} numberOfLines={1}>
                        {cleanPeran(item.peran)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: approved ? '#D1FAE5' : '#FEF3C7' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: approved ? '#059669' : '#D97706' },
                        ]}
                      >
                        {approved ? 'Sudah ACC' : 'Menunggu ACC Anda'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.judulText}>{item.judul_skripsi || '-'}</Text>
                    <View style={styles.detailRow}>
                      <Icons name="account-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {item.nama_lengkap || '-'} · {item.npm || '-'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icons name="map-marker-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{item.lokasi_kegiatan || '-'}</Text>
                    </View>
                  </View>
                  <Icons name="chevron-right" size={22} color="#D1D5DB" style={styles.chevron} />
                </TouchableOpacity>
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
  header: {
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: responsiveWidth(4) },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: responsiveFontSize(2.1), fontWeight: 'bold', color: '#FFF' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(1.45),
    color: '#1F2937',
    marginLeft: 8,
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollContent: { padding: responsiveWidth(4), paddingBottom: responsiveWidth(10) },
  infoBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveWidth(2.5),
    marginBottom: responsiveWidth(4),
  },
  infoBannerText: { fontSize: responsiveFontSize(1.5), color: '#1565C0', flex: 1 },
  centerBox: { alignItems: 'center', paddingTop: responsiveWidth(15), paddingBottom: responsiveWidth(10) },
  centerText: { marginTop: responsiveWidth(4), fontSize: responsiveFontSize(1.9), color: '#718096', fontWeight: '600', textAlign: 'center' },
  retryBtn: {
    marginTop: responsiveWidth(4),
    backgroundColor: '#15613F',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryBtnText: { color: '#FFF', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: responsiveWidth(6),
  },
  roleBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 1,
    marginRight: 8,
  },
  roleBadgeText: { fontSize: responsiveFontSize(1.3), fontWeight: 'bold', color: '#15613F' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: responsiveFontSize(1.3), fontWeight: 'bold' },
  cardBody: {},
  judulText: { fontSize: responsiveFontSize(1.8), fontWeight: 'bold', color: '#1F2937', marginBottom: 8, lineHeight: 22 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: responsiveFontSize(1.5), color: '#4B5563', marginLeft: 6, flexShrink: 1 },
  chevron: { position: 'absolute', right: responsiveWidth(4), top: '50%' },
});

export default PembimbingListScreen;
