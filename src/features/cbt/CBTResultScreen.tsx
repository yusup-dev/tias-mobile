import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform, StatusBar,
} from 'react-native';

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
  slateText: '#64748B',
};

const CBTResultScreen = ({ route, navigation }: any) => {
  const { exam, result } = route.params || {};

  const getScore = () => {
    if (result?.total_score !== undefined) return result.total_score;
    if (result?.info_nilai) {
      const match = String(result.info_nilai).match(/(\d+(\.\d+)?)/);
      return match ? match[0] : '0';
    }
    if (result?.data?.info_nilai) {
      const match = String(result.data.info_nilai).match(/(\d+(\.\d+)?)/);
      return match ? match[0] : '0';
    }
    return '0';
  };

  const rawScore = String(Number(getScore()) * 10);
  const detailSoal = result?.details || [];
  const hasPending = result?.has_pending || detailSoal.length === 0;
  const scoreNum = Number(rawScore);
  const scoreColor = scoreNum >= 75 ? C.green : scoreNum >= 60 ? C.yellowDark : '#DC2626';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Dekorasi */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerEmoji}>🎉</Text>
          <Text style={styles.headerTitle}>Ujian Selesai!</Text>
          <Text style={styles.headerSubtitle}>{exam?.nama_ujian || 'Ujian CBT'}</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          {/* Strip atas kuning */}
          <View style={styles.scoreCardStrip} />
          <View style={styles.scoreCardInner}>
            <Text style={styles.scoreLabel}>TOTAL SKOR SEMENTARA</Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{rawScore}</Text>
            <View style={styles.scoreOuterCircle}>
              <View style={[styles.scoreDot, { backgroundColor: scoreColor }]} />
            </View>
            {hasPending && (
              <View style={styles.pendingContainer}>
                <Text style={styles.pendingText}>⏳ Menunggu koreksi dosen untuk esai/unggahan</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ringkasan statistik */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statValue}>{detailSoal.length || '—'}</Text>
            <Text style={styles.statLabel}>Total Soal</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{detailSoal.filter((s: any) => s.status !== 'menunggu').length || '—'}</Text>
            <Text style={styles.statLabel}>Sudah Dinilai</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏳</Text>
            <Text style={[styles.statValue, { color: C.yellowDark }]}>
              {detailSoal.filter((s: any) => s.status === 'menunggu').length || '—'}
            </Text>
            <Text style={styles.statLabel}>Menunggu</Text>
          </View>
        </View>

        {/* Detail Penilaian */}
        {detailSoal.length > 0 ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionTitleDot} />
              <Text style={styles.sectionTitle}>Detail Penilaian</Text>
            </View>
            <View style={styles.listContainer}>
              {detailSoal.map((item: any, idx: number) => (
                <View
                  key={item.question_id || idx}
                  style={[styles.listItem, idx === detailSoal.length - 1 && styles.noBorder]}
                >
                  <View>
                    <Text style={styles.itemTitle}>Soal {idx + 1}</Text>
                    <Text style={styles.itemSubtitle}>{item.tipe?.replace('_', ' ') || 'Tipe Soal'}</Text>
                  </View>
                  {item.status === 'menunggu' ? (
                    <View style={styles.badgeWait}>
                      <Text style={styles.statusWaitText}>⏳ Menunggu</Text>
                    </View>
                  ) : (
                    <View style={styles.badgeDone}>
                      <Text style={styles.statusDoneText}>Skor: {item.score ?? 0}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📄</Text>
            <Text style={styles.emptyStateText}>
              Detail butir soal dapat dilihat setelah dosen menyelesaikan seluruh proses rekapitulasi penilaian.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnHistory}
          onPress={() => navigation.navigate('CBTHistory')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnHistoryText}>📋  Lihat Riwayat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('CBTList')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Kembali ke Daftar Ujian</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scrollContent: { padding: 20, paddingBottom: 24 },

  // Dekorasi
  bgCircle1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: C.greenSoft,
    opacity: 0.35,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.yellowLight,
    opacity: 0.5,
  },

  // Header
  headerContainer: { alignItems: 'center', marginTop: 10, marginBottom: 24 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: C.greenDark, letterSpacing: 0.3 },
  headerSubtitle: {
    fontSize: 14,
    color: C.textMid,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // Score Card
  scoreCard: {
    backgroundColor: C.white,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  scoreCardStrip: { height: 6, backgroundColor: C.yellow },
  scoreCardInner: { padding: 28, alignItems: 'center' },
  scoreLabel: {
    fontSize: 11,
    color: C.slateText,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  scoreValue: { fontSize: 80, fontWeight: '900', letterSpacing: -2, lineHeight: 90 },
  scoreOuterCircle: {
    marginTop: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.greenLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreDot: { width: 6, height: 6, borderRadius: 3 },
  pendingContainer: {
    marginTop: 14,
    backgroundColor: C.yellowLight,
    borderWidth: 1,
    borderColor: C.yellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  pendingText: { fontSize: 12, color: C.yellowDark, textAlign: 'center', fontWeight: '600' },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: C.border,
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '900', color: C.greenDark, marginBottom: 2 },
  statLabel: { fontSize: 11, color: C.slateText, fontWeight: '600', textAlign: 'center' },

  // Detail Penilaian
  sectionContainer: { marginBottom: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitleDot: {
    width: 5,
    height: 20,
    borderRadius: 3,
    backgroundColor: C.yellow,
    marginRight: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.greenDark },
  listContainer: {
    backgroundColor: C.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.greenLight,
  },
  noBorder: { borderBottomWidth: 0 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: C.greenDark },
  itemSubtitle: { fontSize: 12, color: C.textGray, marginTop: 3 },

  badgeWait: {
    backgroundColor: C.yellowLight,
    borderWidth: 1,
    borderColor: C.yellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusWaitText: { fontSize: 12, fontWeight: '700', color: C.yellowDark },
  badgeDone: {
    backgroundColor: C.greenLight,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusDoneText: { fontSize: 12, fontWeight: '800', color: C.green },

  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
  },
  emptyStateIcon: { fontSize: 40, marginBottom: 12 },
  emptyStateText: { fontSize: 13, color: C.textGray, textAlign: 'center', lineHeight: 20 },

  // Footer
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.greenLight,
    gap: 10,
  },
  btnHistory: {
    backgroundColor: C.yellowLight,
    borderWidth: 1.5,
    borderColor: C.yellow,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnHistoryText: { color: C.yellowDark, fontSize: 14, fontWeight: '700' },
  btnPrimary: {
    backgroundColor: C.green,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: { color: C.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
});

export default CBTResultScreen;