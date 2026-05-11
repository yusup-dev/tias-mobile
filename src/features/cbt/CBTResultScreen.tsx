import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';

const CBTResultScreen = ({ route, navigation }: any) => {
  const { exam, result } = route.params || {};

  // 💡 AUTO-EXTRACTOR: Logika Anti-Gagal untuk mengekstrak angka dari teks backend
  const getScore = () => {
    if (result?.total_score !== undefined) return result.total_score;
    
    // Sedot angka dari "Skor Otomatis: 15"
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

  // Mengalikan nilai mentah dari backend dengan 10 agar selaras dengan hitungan di Web Portal
  const rawScore = String(Number(getScore()) * 10);
  
  const detailSoal = result?.details || [];
  const hasPending = result?.has_pending || (detailSoal.length === 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header - Typography */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Ujian Selesai! 🎉</Text>
          <Text style={styles.headerSubtitle}>{exam?.nama_ujian || 'Ujian CBT'}</Text>
        </View>

        {/* Score Card - UIKA Green Theme */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Total Skor Sementara</Text>
          <Text style={styles.scoreValue}>{rawScore}</Text>
          {hasPending && (
            <View style={styles.pendingContainer}>
              <Text style={styles.scoreNote}>⏳ Menunggu koreksi dosen untuk esai/unggahan</Text>
            </View>
          )}
        </View>

        {/* List Detail Penilaian */}
        {detailSoal.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Detail Penilaian</Text>
            <View style={styles.listContainer}>
              {detailSoal.map((item: any, idx: number) => (
                <View key={item.question_id || idx} style={[styles.listItem, idx === detailSoal.length - 1 && styles.noBorder]}>
                  <View>
                    <Text style={styles.itemTitle}>Soal {idx + 1}</Text>
                    <Text style={styles.itemSubtitle}>{item.tipe?.replace('_', ' ') || 'Tipe Soal'}</Text>
                  </View>
                  {item.status === 'menunggu' ? (
                     <View style={styles.badgeWait}>
                       <Text style={styles.statusWaitText}>Menunggu</Text>
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
          // Jika detail dari backend belum dikirim di endpoint submit
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Detail butir soal dapat dilihat setelah dosen menyelesaikan seluruh proses rekapitulasi penilaian.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('CBTList')}>
          <Text style={styles.btnPrimaryText}>Kembali ke Daftar Ujian</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 🎨 STYLING (Aesthetic: UIKA Green Theme)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' }, // Abu-abu kehijauan sangat muda
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  headerContainer: { marginTop: 20, marginBottom: 24, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#111827', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 6, fontWeight: '500', textAlign: 'center' },

  // Kartu Nilai Utama
  scoreCard: {
    backgroundColor: '#065F46', // Hijau gelap elegan (UIKA Vibe)
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#065F46',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 30,
  },
  scoreLabel: { fontSize: 14, color: '#A7F3D0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.5 },
  scoreValue: { fontSize: 80, fontWeight: '900', color: '#FFFFFF', marginVertical: 8, letterSpacing: -2 },
  pendingContainer: { backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 8 },
  scoreNote: { fontSize: 13, color: '#FFFFFF', textAlign: 'center', fontWeight: '500' },

  // Daftar Detail
  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 14, marginLeft: 4 },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  noBorder: { borderBottomWidth: 0 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  itemSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  
  // Badges
  badgeWait: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusWaitText: { fontSize: 13, fontWeight: '700', color: '#D97706' },
  badgeDone: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusDoneText: { fontSize: 14, fontWeight: '800', color: '#059669' }, 

  emptyState: { padding: 30, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  emptyStateText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },

  // Footer Button
  footer: { 
    padding: 20, 
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, 
    backgroundColor: '#F4F7F6' 
  },
  btnPrimary: {
    backgroundColor: '#10B981', // Hijau UIKA Cerah untuk tombol
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
});

export default CBTResultScreen;