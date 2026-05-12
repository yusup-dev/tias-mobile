import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, SafeAreaView, Platform, StatusBar,
  LayoutAnimation, UIManager,
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

const CBTHistoryScreen = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: responseData, isLoading, isError, refetch } = useHistory();
  const historyData = responseData?.data || [];

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderBreakdownRow = (label: string, icon: string, data: any, gradingType: string) => {
    if (!data || data.max === 0) return null;
    const scoreText = gradingType === 'PER_KATEGORI'
      ? `${Math.round(data.obtained)} / ${Math.round(data.max)} poin`
      : `${Math.round(data.obtained)} / ${Math.round(data.max)}`;
    return (
      <View style={styles.breakdownRow}>
        <View style={styles.breakdownLabelContainer}>
          <Text style={styles.breakdownIcon}>{icon}</Text>
          <Text style={styles.breakdownLabel}>{label}</Text>
        </View>
        <Text style={styles.breakdownScore}>{scoreText}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isPending = item.status.toLowerCase().includes('menunggu');
    const isExpanded = expandedId === String(index);
    const bd = item.breakdown || {};

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
              <Text style={styles.footerLabel}>Total Skor Akhir</Text>
              <View style={styles.gradingTypePill}>
                <Text style={styles.gradingTypePillText}>
                  {item.grading_type === 'PER_KATEGORI' ? '📊 Persentase' : '📌 Poin Mutlak'}
                </Text>
              </View>
            </View>
            {isPending ? (
              <Text style={styles.scorePending}>Menghitung...</Text>
            ) : (
              <Text style={styles.scoreFinal}>{item.total_skor}</Text>
            )}
          </View>

          {/* Rincian (expandable) */}
          {isExpanded && (
            <View style={styles.breakdownContainer}>
              <Text style={styles.breakdownTitle}>Rincian Perolehan Nilai</Text>
              {renderBreakdownRow('Pilihan Ganda', '📝', bd.TIPE_1, item.grading_type)}
              {renderBreakdownRow('Esai (Otomatis AI)', '🤖', bd.TIPE_3, item.grading_type)}

              {bd.TIPE_4?.max > 0 && (
                <View style={[styles.breakdownRow, isPending && { opacity: 0.6 }]}>
                  <View style={styles.breakdownLabelContainer}>
                    <Text style={styles.breakdownIcon}>📁</Text>
                    <Text style={styles.breakdownLabel}>Praktik/Upload</Text>
                  </View>
                  <Text style={[styles.breakdownScore, isPending && { color: C.yellowDark, fontStyle: 'italic' }]}>
                    {isPending ? 'Menunggu Dosen' : `${Math.round(bd.TIPE_4.obtained)} / ${Math.round(bd.TIPE_4.max)}`}
                  </Text>
                </View>
              )}

              {isPending && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningIcon}>⏳</Text>
                  <Text style={styles.warningText}>
                    Nilai akhir masih dapat berubah setelah dosen menyelesaikan koreksi manual.
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

      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Riwayat Ujian</Text>
          <Text style={styles.subHeader}>Pantau hasil & rincian penilaian Anda</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{historyData.length} Ujian</Text>
        </View>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, historyData.length === 0 && { flex: 1 }]}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.iconLarge}>📭</Text>
            <Text style={styles.emptyStateTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyStateText}>Anda belum menyelesaikan ujian apapun.</Text>
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
    top: -60,
    right: -60,
    width: 200,
    height: 200,
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
    paddingBottom: 16,
  },
  header: { fontSize: 30, fontWeight: '800', color: C.greenDark, letterSpacing: 0.3 },
  subHeader: { fontSize: 13, color: C.textMid, marginTop: 3, fontWeight: '500' },
  countBadge: {
    backgroundColor: C.greenLight,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countBadgeText: { color: C.green, fontSize: 13, fontWeight: '700' },

  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardAccent: {
    width: 5,
    backgroundColor: C.green,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  gradingTypePillText: { fontSize: 11, color: C.green, fontWeight: '700' },
  scoreFinal: { fontSize: 34, fontWeight: '900', color: C.greenDark },
  scorePending: { fontSize: 18, fontWeight: '700', color: C.yellowDark, fontStyle: 'italic' },

  badgeWait: { backgroundColor: C.yellowLight, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: C.yellow },
  badgeWaitText: { color: C.yellowDark, fontSize: 11, fontWeight: '800' },
  badgeDone: { backgroundColor: C.greenLight, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  badgeDoneText: { color: C.green, fontSize: 11, fontWeight: '800' },

  // Breakdown
  breakdownContainer: {
    marginTop: 16,
    backgroundColor: C.slate,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.greenLight,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: C.slateText,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  breakdownLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  breakdownIcon: { fontSize: 15, marginRight: 8 },
  breakdownLabel: { fontSize: 13, color: C.greenDark, fontWeight: '600' },
  breakdownScore: { fontSize: 13, color: C.greenDark, fontWeight: '800' },

  warningBox: {
    flexDirection: 'row',
    backgroundColor: C.yellowLight,
    borderLeftWidth: 3,
    borderLeftColor: C.yellow,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  warningIcon: { fontSize: 14, marginRight: 8 },
  warningText: { flex: 1, fontSize: 11, color: C.yellowDark, lineHeight: 16, fontWeight: '500' },

  expandHint: {
    marginTop: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.greenLight,
    paddingTop: 10,
  },
  expandHintText: { fontSize: 11, color: C.slateText, fontWeight: '600' },

  // State helpers
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 16, color: C.greenDark, fontSize: 15, fontWeight: '600' },
  iconLarge: { fontSize: 52, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: C.greenDark, marginBottom: 16 },
  retryBtn: { backgroundColor: C.green, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
  retryBtnText: { color: C.white, fontWeight: '700', fontSize: 15 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: C.greenDark, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: C.textGray, textAlign: 'center' },
});

export default CBTHistoryScreen;