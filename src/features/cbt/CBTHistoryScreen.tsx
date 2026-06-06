import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, SafeAreaView, Platform, StatusBar,
  LayoutAnimation, UIManager, TextInput,
} from 'react-native';
import { useHistory } from '../../services/cbt/useHistory';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ============================
//  PALETTE TEMA HIJAU-KUNING UIKA
// ============================
const C = {
  bg: '#F0FDF4',
  green: '#16A34A',
  greenDark: '#14532D',
  greenMed: '#22C55E',
  greenLight: '#DCFCE7',
  greenSoft: '#BBF7D0',
  yellow: '#FACC15',
  yellowLight: '#FEF9C3',
  yellowDark: '#CA8A04',
  white: '#FFFFFF',
  textDark: '#14532D',
  textMid: '#166534',
  textGray: '#6B7280',
  border: '#D1FAE5',
  slate: '#F8FAFC',
  slateText: '#64748B',
};

type FilterType = 'all' | 'SELESAI' | 'MENUNGGU_VERIFIKASI';

const CBTHistoryScreen = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { data: responseData, isLoading, isError, refetch } = useHistory();
  const historyData = responseData?.data || [];

  // =============================
  //  FILTER & SEARCH (client-side)
  // =============================
  const filteredData = useMemo(() => {
    let result = historyData;

    // Filter by status
    if (activeFilter !== 'all') {
      result = result.filter((item: any) => item.status === activeFilter);
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((item: any) =>
        (item.exam_nama || '').toLowerCase().includes(q) ||
        (item.matkul || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [historyData, activeFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const FILTERS: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: '✅ Selesai', value: 'SELESAI' },
    { label: '⏳ Proses', value: 'MENUNGGU_VERIFIKASI' },
  ];

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // 🔒 Status baru dari exam_attempts: 'MENUNGGU_VERIFIKASI' | 'SELESAI'
    const isPending = item.status === 'MENUNGGU_VERIFIKASI';
    const isExpanded = expandedId === String(index);

    // Skor per kategori (skala 0-100) dari API baru
    const skorPilgan = item.skor_pilgan_100 ?? 0;
    const skorEsai   = item.skor_esai_100   ?? 0;
    const skorFile   = item.skor_file_100   ?? 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => toggleExpand(String(index))}
      >
        {/* Strip aksen kuning kiri */}
        <View style={[styles.cardAccent, isPending && { backgroundColor: C.yellow }]} />

        <View style={styles.cardBody}>
          {/* Top: judul & badge */}
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.exam_nama}</Text>
              <Text style={styles.cardSub}>{item.matkul}</Text>
            </View>
            {isPending ? (
              <View style={styles.badgeWait}>
                <Text style={styles.badgeWaitText}>⏳ Proses</Text>
              </View>
            ) : (
              <View style={styles.badgeDone}>
                <Text style={styles.badgeDoneText}>✅ Selesai</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Bottom: skor */}
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.footerLabel}>Nilai Akhir</Text>
              <View style={styles.gradingTypePill}>
                <Text style={styles.gradingTypePillText}>
                  {item.grading_type === 'PER_KATEGORI' ? '📊 Bobot Persentase' : '📌 Poin Mutlak'}
                </Text>
              </View>
            </View>
            {isPending ? (
              <View style={styles.lockBadge}>
                <Text style={styles.lockBadgeText}>🔒  Belum Dipublikasi</Text>
              </View>
            ) : (
              <Text style={styles.scoreFinal}>{Number(item.final_score).toFixed(1)}</Text>
            )}
          </View>

          {/* Rincian (expandable) */}
          {isExpanded && (
            <View style={styles.breakdownContainer}>
              <Text style={styles.breakdownTitle}>Rincian Skor per Kategori (Skala 0–100)</Text>

              {/* Pilihan Ganda */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLabelContainer}>
                  <Text style={styles.breakdownIcon}>📝</Text>
                  <Text style={styles.breakdownLabel}>Pilihan Ganda</Text>
                </View>
                <Text style={styles.breakdownScore}>
                  {isPending ? `${skorPilgan}/100 (sementara)` : `${skorPilgan}/100`}
                </Text>
              </View>

              {/* Esai AI */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLabelContainer}>
                  <Text style={styles.breakdownIcon}>🤖</Text>
                  <Text style={styles.breakdownLabel}>Esai (Koreksi AI)</Text>
                </View>
                <Text style={[styles.breakdownScore, isPending && { color: C.yellowDark, fontStyle: 'italic' }]}>
                  {isPending && skorEsai === 0 ? 'Sedang diproses...' : `${skorEsai}/100`}
                </Text>
              </View>

              {/* File Upload */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLabelContainer}>
                  <Text style={styles.breakdownIcon}>📁</Text>
                  <Text style={styles.breakdownLabel}>Praktik / Upload</Text>
                </View>
                <Text style={[styles.breakdownScore, isPending && { color: C.yellowDark, fontStyle: 'italic' }]}>
                  {isPending ? 'Menunggu Dosen' : `${skorFile}/100`}
                </Text>
              </View>

              {isPending ? (
                <View style={styles.warningBox}>
                  <Text style={styles.warningIcon}>🔒</Text>
                  <Text style={styles.warningText}>
                    Nilai akhir dikunci sampai dosen memverifikasi dan mempublikasikan hasil penilaian.
                  </Text>
                </View>
              ) : (
                <View style={styles.doneBox}>
                  <Text style={styles.warningIcon}>✅</Text>
                  <Text style={[styles.warningText, { color: C.textMid }]}>
                    Nilai telah diverifikasi dan dipublikasikan oleh dosen.
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.expandHint}>
            <Text style={styles.expandHintText}>
              {isExpanded ? 'Tutup rincian ▲' : 'Ketuk untuk lihat rincian ▼'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.green} />
        <Text style={styles.loadingText}>Memuat riwayat ujian...</Text>
      </View>
    </SafeAreaView>
  );

  if (isError) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.iconLarge}>📡</Text>
        <Text style={styles.errorTitle}>Koneksi Gagal</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={styles.bgCircle} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Riwayat Ujian</Text>
          <Text style={styles.subHeader}>Pantau hasil & rincian penilaian Anda</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{historyData.length} Ujian</Text>
        </View>
      </View>

      {/* ✅ BARU: Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama ujian atau mata kuliah..."
            placeholderTextColor={C.textGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ✅ BARU: Filter Chip Row */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.value)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterChipText, activeFilter === f.value && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Counter */}
        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>{filteredData.length}/{historyData.length}</Text>
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, filteredData.length === 0 && { flex: 1 }]}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.iconLarge}>
              {searchQuery || activeFilter !== 'all' ? '🔍' : '📭'}
            </Text>
            <Text style={styles.emptyStateTitle}>
              {searchQuery || activeFilter !== 'all' ? 'Tidak Ditemukan' : 'Belum Ada Riwayat'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? `Tidak ada hasil untuk "${searchQuery}"`
                : activeFilter !== 'all'
                ? 'Tidak ada ujian dengan status ini.'
                : 'Anda belum menyelesaikan ujian apapun.'}
            </Text>
            {(searchQuery || activeFilter !== 'all') && (
              <TouchableOpacity
                style={styles.resetFilterBtn}
                onPress={() => { setSearchQuery(''); setActiveFilter('all'); }}
              >
                <Text style={styles.resetFilterBtnText}>Reset Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  bgCircle: {
    position: 'absolute',
    top: -60, right: -60,
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: C.greenSoft,
    opacity: 0.35,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 12,
  },
  header: { fontSize: 28, fontWeight: '800', color: C.greenDark, letterSpacing: 0.3 },
  subHeader: { fontSize: 13, color: C.textMid, marginTop: 3, fontWeight: '500' },
  countBadge: {
    backgroundColor: C.greenLight,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
  },
  countBadgeText: { color: C.green, fontSize: 13, fontWeight: '700' },

  // ✅ Search Bar
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    gap: 10,
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.textDark,
    fontWeight: '500',
    padding: 0,
  },
  clearBtn: {
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: C.textGray,
    justifyContent: 'center', alignItems: 'center',
  },
  clearBtnText: { color: C.white, fontSize: 11, fontWeight: '700' },

  // ✅ Filter Chips
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.border,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  filterChipText: {
    fontSize: 12.5, fontWeight: '700', color: C.textGray,
  },
  filterChipTextActive: {
    color: C.white,
  },
  resultCount: {
    marginLeft: 'auto',
    backgroundColor: C.greenLight,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10,
  },
  resultCountText: { fontSize: 11.5, fontWeight: '800', color: C.green },

  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 4 },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 20, marginBottom: 16,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
    borderWidth: 1, borderColor: C.border,
  },
  cardAccent: {
    width: 5, backgroundColor: C.green,
    borderTopLeftRadius: 20, borderBottomLeftRadius: 20,
  },
  cardBody: { flex: 1, padding: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.greenDark, lineHeight: 22, marginBottom: 4 },
  cardSub: { fontSize: 13, color: C.textGray, fontWeight: '500' },
  divider: { height: 1, backgroundColor: C.greenLight, marginVertical: 14 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 13, color: C.slateText, fontWeight: '700', marginBottom: 6 },
  gradingTypePill: {
    backgroundColor: C.greenLight,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  gradingTypePillText: { fontSize: 11, color: C.green, fontWeight: '700' },
  scoreFinal: { fontSize: 34, fontWeight: '900', color: C.greenDark },
  scorePending: { fontSize: 18, fontWeight: '700', color: C.yellowDark, fontStyle: 'italic' },

  badgeWait: { backgroundColor: C.yellowLight, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: C.yellow },
  badgeWaitText: { color: C.yellowDark, fontSize: 11, fontWeight: '800' },
  badgeDone: { backgroundColor: C.greenLight, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  badgeDoneText: { color: C.green, fontSize: 11, fontWeight: '800' },

  lockBadge: {
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
  },
  lockBadgeText: { fontSize: 12, fontWeight: '700', color: '#DC2626' },

  // Breakdown
  breakdownContainer: {
    marginTop: 16, backgroundColor: C.slate,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.greenLight,
  },
  breakdownTitle: {
    fontSize: 11, fontWeight: '800', color: C.slateText,
    marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  breakdownLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  breakdownIcon: { fontSize: 15, marginRight: 8 },
  breakdownLabel: { fontSize: 13, color: C.greenDark, fontWeight: '600' },
  breakdownScore: { fontSize: 13, color: C.greenDark, fontWeight: '800' },

  warningBox: {
    flexDirection: 'row', backgroundColor: C.yellowLight,
    borderLeftWidth: 3, borderLeftColor: C.yellow,
    padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center',
  },
  warningIcon: { fontSize: 14, marginRight: 8 },
  warningText: { flex: 1, fontSize: 11, color: C.yellowDark, lineHeight: 16, fontWeight: '500' },

  doneBox: {
    flexDirection: 'row', backgroundColor: C.greenLight,
    borderLeftWidth: 3, borderLeftColor: C.green,
    padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center',
  },

  expandHint: {
    marginTop: 14, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: C.greenLight, paddingTop: 10,
  },
  expandHintText: { fontSize: 11, color: C.slateText, fontWeight: '600' },

  // State helpers
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 16, color: C.greenDark, fontSize: 15, fontWeight: '600' },
  iconLarge: { fontSize: 52, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: C.greenDark, marginBottom: 16 },
  retryBtn: { backgroundColor: C.green, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
  retryBtnText: { color: C.white, fontWeight: '700', fontSize: 15 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: C.greenDark, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: C.textGray, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  resetFilterBtn: {
    backgroundColor: C.green,
    paddingVertical: 10, paddingHorizontal: 24,
    borderRadius: 14,
  },
  resetFilterBtnText: { color: C.white, fontWeight: '700', fontSize: 13 },
});

export default CBTHistoryScreen;