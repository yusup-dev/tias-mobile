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

  // 🆕 Deteksi status dari response API baru
  // Backend sekarang hanya mengembalikan { message, status: 'MENUNGGU_VERIFIKASI' }
  const isPending =
    result?.status === 'MENUNGGU_VERIFIKASI' ||
    result?.status === 'pending' ||
    result?.final_score === null ||
    result?.final_score === undefined;

  const finalScore = isPending ? null : (result?.final_score ?? result?.total_skor ?? null);
  const scoreNum = finalScore !== null ? Number(finalScore) : null;
  const scoreColor =
    scoreNum === null ? C.slateText
    : scoreNum >= 75 ? C.green
    : scoreNum >= 60 ? C.yellowDark
    : '#DC2626';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Dekorasi latar */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerEmoji}>{isPending ? '📬' : '🎉'}</Text>
          <Text style={styles.headerTitle}>
            {isPending ? 'Ujian Dikumpulkan!' : 'Hasil Ujian'}
          </Text>
          <Text style={styles.headerSubtitle}>{exam?.nama_ujian || 'Ujian CBT'}</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={[styles.scoreCardStrip, isPending && { backgroundColor: C.yellow }]} />
          <View style={styles.scoreCardInner}>
            {isPending ? (
              /* ======== STATE PENDING: Nilai belum bisa dilihat ======== */
              <>
                <View style={styles.lockIconContainer}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
                <Text style={styles.pendingTitle}>Menunggu Verifikasi Dosen</Text>
                <Text style={styles.pendingDescription}>
                  Ujian Anda telah berhasil dikumpulkan. Nilai akan ditampilkan setelah dosen memverifikasi dan mempublikasikan hasil penilaian.
                </Text>
                <View style={styles.pendingSteps}>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: C.green }]} />
                    <Text style={styles.stepText}>✅ Jawaban berhasil tersimpan</Text>
                  </View>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: C.yellow }]} />
                    <Text style={styles.stepText}>⏳ AI sedang menilai jawaban esai</Text>
                  </View>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: C.border }]} />
                    <Text style={[styles.stepText, { color: C.textGray }]}>🔒 Dosen melakukan verifikasi akhir</Text>
                  </View>
                </View>
              </>
            ) : (
              /* ======== STATE SELESAI: Tampilkan nilai ======== */
              <>
                <Text style={styles.scoreLabel}>NILAI AKHIR</Text>
                <Text style={[styles.scoreValue, { color: scoreColor }]}>
                  {scoreNum?.toFixed(1) ?? '—'}
                </Text>
                <View style={styles.scoreOuterCircle}>
                  <View style={[styles.scoreDot, { backgroundColor: scoreColor }]} />
                </View>
                <View style={[styles.gradeBadge, { borderColor: scoreColor }]}>
                  <Text style={[styles.gradeText, { color: scoreColor }]}>
                    {scoreNum! >= 85 ? 'A — Sangat Baik' :
                     scoreNum! >= 75 ? 'B — Baik' :
                     scoreNum! >= 60 ? 'C — Cukup' :
                     scoreNum! >= 50 ? 'D — Kurang' : 'E — Tidak Lulus'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Info Ujian */}
        <View style={styles.infoCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleDot} />
            <Text style={styles.sectionTitle}>Informasi Ujian</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mata Kuliah</Text>
            <Text style={styles.infoValue}>{exam?.mata_kuliah?.nama_mk || exam?.kode_mk || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Ujian</Text>
            <Text style={styles.infoValue}>{exam?.nama_ujian || '—'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={[styles.statusBadge, isPending && styles.statusBadgePending]}>
              <Text style={[styles.statusBadgeText, isPending && styles.statusBadgeTextPending]}>
                {isPending ? '⏳ Menunggu Verifikasi' : '✅ Nilai Dipublikasikan'}
              </Text>
            </View>
          </View>
        </View>

        {/* Info box jika pending */}
        {isPending && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxIcon}>💡</Text>
            <Text style={styles.infoBoxText}>
              Cek kembali riwayat ujian Anda secara berkala. Notifikasi akan tersedia saat dosen telah mempublikasikan nilai.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Footer */}
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
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: C.greenSoft, opacity: 0.35,
  },
  bgCircle2: {
    position: 'absolute', bottom: 100, left: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: C.yellowLight, opacity: 0.5,
  },

  // Header
  headerContainer: { alignItems: 'center', marginTop: 10, marginBottom: 24 },
  headerEmoji: { fontSize: 52, marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: C.greenDark, letterSpacing: 0.3 },
  headerSubtitle: { fontSize: 13, color: C.textMid, marginTop: 6, fontWeight: '500', textAlign: 'center', paddingHorizontal: 16 },

  // Score Card
  scoreCard: {
    backgroundColor: C.white, borderRadius: 24, overflow: 'hidden', marginBottom: 20,
    shadowColor: C.greenDark, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
    borderWidth: 1, borderColor: C.border,
  },
  scoreCardStrip: { height: 6, backgroundColor: C.green },
  scoreCardInner: { padding: 28, alignItems: 'center' },

  // Pending state
  lockIconContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.yellowLight, justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, borderWidth: 2, borderColor: C.yellow,
  },
  lockIcon: { fontSize: 36 },
  pendingTitle: { fontSize: 18, fontWeight: '800', color: C.greenDark, marginBottom: 12, textAlign: 'center' },
  pendingDescription: {
    fontSize: 13, color: C.textGray, textAlign: 'center', lineHeight: 20,
    marginBottom: 20, paddingHorizontal: 8,
  },
  pendingSteps: { width: '100%', gap: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepText: { fontSize: 13, color: C.textMid, fontWeight: '600' },

  // Score display
  scoreLabel: { fontSize: 11, color: C.slateText, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  scoreValue: { fontSize: 80, fontWeight: '900', letterSpacing: -2, lineHeight: 90 },
  scoreOuterCircle: { marginTop: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: C.greenLight, justifyContent: 'center', alignItems: 'center' },
  scoreDot: { width: 6, height: 6, borderRadius: 3 },
  gradeBadge: { marginTop: 14, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  gradeText: { fontSize: 13, fontWeight: '700' },

  // Info card
  infoCard: {
    backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.greenDark, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitleDot: { width: 5, height: 20, borderRadius: 3, backgroundColor: C.yellow, marginRight: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: C.greenDark },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.greenLight,
  },
  infoLabel: { fontSize: 13, color: C.textGray, fontWeight: '500' },
  infoValue: { fontSize: 13, color: C.greenDark, fontWeight: '700', maxWidth: '60%', textAlign: 'right' },
  statusBadge: { backgroundColor: C.greenLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: C.green },
  statusBadgePending: { backgroundColor: C.yellowLight, borderColor: C.yellow },
  statusBadgeTextPending: { color: C.yellowDark },

  // Info box
  infoBox: {
    flexDirection: 'row', backgroundColor: C.greenLight, borderLeftWidth: 4,
    borderLeftColor: C.green, padding: 14, borderRadius: 14, marginBottom: 16, alignItems: 'flex-start',
  },
  infoBoxIcon: { fontSize: 18, marginRight: 10 },
  infoBoxText: { flex: 1, fontSize: 12, color: C.textMid, lineHeight: 18, fontWeight: '500' },

  // Footer
  footer: {
    padding: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.greenLight, gap: 10,
  },
  btnHistory: {
    backgroundColor: C.yellowLight, borderWidth: 1.5, borderColor: C.yellow,
    borderRadius: 16, paddingVertical: 13, alignItems: 'center',
  },
  btnHistoryText: { color: C.yellowDark, fontSize: 14, fontWeight: '700' },
  btnPrimary: {
    backgroundColor: C.green, borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    shadowColor: C.green, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  btnPrimaryText: { color: C.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
});

export default CBTResultScreen;