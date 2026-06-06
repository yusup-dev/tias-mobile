import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Platform, ActivityIndicator,
} from 'react-native';
import { useExamTerms } from '../../services/cbt/useExamTerms';

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
  red: '#DC2626',
  redLight: '#FEE2E2',
  slate: '#F8FAFC',
  slateText: '#64748B',
};

// S&K Default jika API belum mengembalikan data
const DEFAULT_TERMS = [
  'Peserta wajib mengerjakan ujian secara mandiri dan jujur.',
  'Dilarang membuka catatan, buku, atau sumber lain selama ujian berlangsung.',
  'Dilarang berdiskusi atau bekerja sama dengan peserta lain.',
  'Jawaban tidak dapat diubah setelah ujian dikumpulkan.',
  'Pelanggaran akademik dapat berakibat pada pembatalan nilai ujian.',
];

const CBTTermsScreen = ({ route, navigation }: any) => {
  const { exam, questions, durasi } = route.params;
  const [isAgreed, setIsAgreed] = useState(false);

  const { data: termsData, isLoading, isError } = useExamTerms(exam?.id ?? null);

  // Gunakan S&K dari API jika tersedia, jika tidak pakai default
  const terms: string[] =
    termsData?.data?.terms?.map((t: any) => t.isi_syarat) ?? DEFAULT_TERMS;

  const handleMulaiUjian = () => {
    navigation.replace('CBTExam', {
      exam,
      questions,
      durasi,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Dekorasi */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Text style={styles.headerIcon}>📜</Text>
        </View>
        <Text style={styles.headerTitle}>Syarat & Ketentuan Ujian</Text>
        <Text style={styles.headerSubtitle} numberOfLines={2}>
          {exam?.nama_ujian}
        </Text>
        {/* Chip info ujian */}
        <View style={styles.infoBadgeRow}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>
              📚 {exam?.mata_kuliah?.nama_mk || 'Umum'}
            </Text>
          </View>
          <View style={[styles.infoBadge, { backgroundColor: C.yellowLight, borderColor: C.yellow }]}>
            <Text style={[styles.infoBadgeText, { color: C.yellowDark }]}>
              ⏱ {durasi ?? exam?.durasi} Menit
            </Text>
          </View>
        </View>
      </View>

      {/* Konten S&K */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card S&K */}
        <View style={styles.termsCard}>
          <View style={styles.termsCardHeader}>
            <View style={styles.termsAccentBar} />
            <Text style={styles.termsCardTitle}>
              {termsData?.data?.is_custom
                ? '⚖️ Ketentuan Khusus Dosen'
                : '⚖️ Tata Tertib Ujian'}
            </Text>
          </View>
          <Text style={styles.termsCardSubtitle}>
            Baca dan pahami seluruh ketentuan berikut sebelum memulai ujian.
          </Text>

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={C.green} />
              <Text style={styles.loadingText}>Memuat ketentuan ujian...</Text>
            </View>
          ) : (
            <View style={styles.termsList}>
              {terms.map((term, index) => (
                <View key={index} style={styles.termItem}>
                  <View style={styles.termBullet}>
                    <Text style={styles.termBulletText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          )}

          {isError && !isLoading && (
            <View style={styles.warningBox}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                Tidak dapat memuat ketentuan khusus dari server. Ketentuan umum berlaku.
              </Text>
            </View>
          )}
        </View>

        {/* Penting */}
        <View style={styles.importantBox}>
          <Text style={styles.importantIcon}>🔒</Text>
          <Text style={styles.importantText}>
            Pelanggaran terhadap tata tertib ujian dapat berakibat pada{' '}
            <Text style={{ fontWeight: '800' }}>pembatalan nilai</Text> secara permanen.
          </Text>
        </View>

        {/* Checkbox Persetujuan */}
        <TouchableOpacity
          style={[styles.checkboxRow, isAgreed && styles.checkboxRowActive]}
          activeOpacity={0.75}
          onPress={() => setIsAgreed(v => !v)}
        >
          <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
            {isAgreed && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={[styles.checkboxLabel, isAgreed && { color: C.greenDark }]}>
            Saya telah membaca dan menyetujui seluruh syarat & ketentuan di atas
          </Text>
        </TouchableOpacity>

        {/* Spacer bawah */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Tombol */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnCancel}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnCancelText}>← Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnStart, !isAgreed && styles.btnStartDisabled]}
          onPress={handleMulaiUjian}
          disabled={!isAgreed}
          activeOpacity={0.85}
        >
          <Text style={styles.btnStartText}>
            {isAgreed ? '🚀  Mulai Ujian' : '🔒  Setujui Dulu'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Dekorasi
  bgCircle1: {
    position: 'absolute', top: -80, right: -80,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: C.greenSoft, opacity: 0.4,
  },
  bgCircle2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: C.yellowLight, opacity: 0.5,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 20,
  },
  headerIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.yellowLight,
    borderWidth: 2, borderColor: C.yellow,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
    shadowColor: C.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 4,
  },
  headerIcon: { fontSize: 32 },
  headerTitle: {
    fontSize: 22, fontWeight: '800', color: C.greenDark,
    marginBottom: 6, letterSpacing: 0.3, textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14, color: C.textMid, textAlign: 'center',
    marginBottom: 14, fontWeight: '600', lineHeight: 20,
    paddingHorizontal: 16,
  },
  infoBadgeRow: {
    flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
  },
  infoBadge: {
    backgroundColor: C.greenLight, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
  },
  infoBadgeText: { color: C.textMid, fontSize: 12, fontWeight: '700' },

  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  // Card S&K
  termsCard: {
    backgroundColor: C.white, borderRadius: 20,
    padding: 20, marginBottom: 16,
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
    borderWidth: 1, borderColor: C.border,
  },
  termsCardHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 6,
  },
  termsAccentBar: {
    width: 4, height: 20, borderRadius: 2,
    backgroundColor: C.yellow, marginRight: 10,
  },
  termsCardTitle: {
    fontSize: 15, fontWeight: '800', color: C.greenDark,
  },
  termsCardSubtitle: {
    fontSize: 12, color: C.textGray, marginBottom: 18, lineHeight: 18,
  },

  // Loading
  loadingBox: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingVertical: 16, justifyContent: 'center',
  },
  loadingText: { color: C.textGray, fontSize: 13 },

  // List S&K
  termsList: { gap: 12 },
  termItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  },
  termBullet: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.greenLight,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0, marginTop: 1,
  },
  termBulletText: {
    fontSize: 11, fontWeight: '800', color: C.green,
  },
  termText: {
    flex: 1, fontSize: 13.5, color: C.textDark,
    lineHeight: 21, fontWeight: '500',
  },

  // Warning box
  warningBox: {
    flexDirection: 'row', backgroundColor: C.yellowLight,
    borderLeftWidth: 3, borderLeftColor: C.yellow,
    padding: 12, borderRadius: 10, marginTop: 14, alignItems: 'flex-start',
  },
  warningIcon: { fontSize: 14, marginRight: 8, marginTop: 1 },
  warningText: {
    flex: 1, fontSize: 12, color: C.yellowDark,
    lineHeight: 17, fontWeight: '500',
  },

  // Important Box
  importantBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4, borderLeftColor: C.red,
    borderRadius: 14, padding: 14, marginBottom: 16,
    alignItems: 'flex-start',
  },
  importantIcon: { fontSize: 16, marginRight: 10, marginTop: 1 },
  importantText: {
    flex: 1, fontSize: 12.5, color: '#7F1D1D',
    lineHeight: 18, fontWeight: '500',
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: C.white,
    borderWidth: 2, borderColor: C.border,
    borderRadius: 16, padding: 16, marginBottom: 16, gap: 14,
  },
  checkboxRowActive: {
    borderColor: C.green, backgroundColor: C.greenLight,
  },
  checkbox: {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 2, borderColor: C.border,
    backgroundColor: C.white,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: C.green, borderColor: C.green,
  },
  checkMark: { fontSize: 14, color: C.white, fontWeight: '800' },
  checkboxLabel: {
    flex: 1, fontSize: 13, color: C.slateText,
    lineHeight: 19, fontWeight: '500',
  },

  // Footer
  footer: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: C.white,
    borderTopWidth: 1, borderTopColor: C.border,
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 6,
  },
  btnCancel: {
    flex: 1,
    borderWidth: 2, borderColor: C.greenLight,
    paddingVertical: 14, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  btnCancelText: { color: C.textMid, fontWeight: '700', fontSize: 14 },
  btnStart: {
    flex: 2,
    backgroundColor: C.green,
    paddingVertical: 14, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnStartDisabled: {
    backgroundColor: C.greenSoft,
    shadowOpacity: 0, elevation: 0,
  },
  btnStartText: { color: C.white, fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
});

export default CBTTermsScreen;
