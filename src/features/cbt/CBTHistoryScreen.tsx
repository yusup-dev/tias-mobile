import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { useHistory } from '../../services/cbt/useHistory'; // ✅ Import React Query Hook

// Mengaktifkan animasi layout untuk Android (iOS sudah otomatis)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CBTHistoryScreen = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null); // State untuk buka/tutup rincian

  // 🌟 1. MENGGUNAKAN REACT QUERY (Sangat bersih tanpa useEffect manual)
  const { data: responseData, isLoading, isError, refetch } = useHistory();
  const historyData = responseData?.data || [];

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderBreakdownRow = (label: string, icon: string, data: any, gradingType: string) => {
    if (!data || data.max === 0) return null; // Sembunyikan jika tidak ada soal tipe ini
    
    // Jika sistemnya mutlak (Per-Soal), tampilkan nilai mentah. Jika Persentase, kita bisa infokan rasio benarnya.
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

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const isPending = item.status.toLowerCase().includes('menunggu');
    const isExpanded = expandedId === String(index);
    const bd = item.breakdown || {};

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9} 
        onPress={() => toggleExpand(String(index))}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.exam_nama}</Text>
            <Text style={styles.cardSub}>{item.matkul}</Text>
          </View>
          {isPending ? (
            <View style={styles.badgeWait}><Text style={styles.badgeWaitText}>Diproses</Text></View>
          ) : (
            <View style={styles.badgeDone}><Text style={styles.badgeDoneText}>Selesai</Text></View>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.footerLabel}>Total Skor Akhir</Text>
            <Text style={styles.gradingTypeBadge}>
              Sistem: {item.grading_type === 'PER_KATEGORI' ? 'Persentase Kategori' : 'Poin Mutlak'}
            </Text>
          </View>
          
          {isPending ? (
            <Text style={styles.scorePending}>Menghitung...</Text>
          ) : (
            <Text style={styles.scoreFinal}>{item.total_skor}</Text>
          )}
        </View>

        {/* 🌟 SEKSI RINCIAN NILAI (BISA DIBUKA/TUTUP) */}
        {isExpanded && (
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>Rincian Perolehan Nilai:</Text>
            {renderBreakdownRow('Pilihan Ganda', '📝', bd.TIPE_1, item.grading_type)}
            {renderBreakdownRow('Esai (Otomatis AI)', '🤖', bd.TIPE_3, item.grading_type)}
            
            {/* Khusus Tipe 4 (Upload), beri peringatan jika belum dinilai */}
            {bd.TIPE_4?.max > 0 && (
              <View style={[styles.breakdownRow, isPending && { opacity: 0.6 }]}>
                <View style={styles.breakdownLabelContainer}>
                  <Text style={styles.breakdownIcon}>📁</Text>
                  <Text style={styles.breakdownLabel}>Praktik/Upload</Text>
                </View>
                <Text style={[styles.breakdownScore, isPending && { color: '#D97706', fontStyle: 'italic' }]}>
                  {isPending ? 'Menunggu Dosen' : `${Math.round(bd.TIPE_4.obtained)} / ${Math.round(bd.TIPE_4.max)}`}
                </Text>
              </View>
            )}

            {isPending && (
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⏳</Text>
                <Text style={styles.warningText}>Nilai akhir masih dapat berubah setelah dosen menyelesaikan koreksi manual.</Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.expandHint}>
          <Text style={styles.expandHintText}>{isExpanded ? 'Tutup rincian ▲' : 'Ketuk untuk lihat rincian ▼'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}><ActivityIndicator size="large" color="#065F46" /><Text style={styles.loadingText}>Memuat riwayat ujian...</Text></View>
    </SafeAreaView>
  );

  if (isError) return (
    <SafeAreaView style={styles.container}>
      {/* 🌟 2. GUNAKAN refetch DARI HOOK REACT QUERY */}
      <View style={styles.center}><Text style={styles.iconLarge}>📡</Text><Text style={styles.errorTitle}>Koneksi Gagal</Text><TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}><Text style={styles.retryBtnText}>Coba Lagi</Text></TouchableOpacity></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Riwayat Ujian</Text>
        <Text style={styles.subHeader}>Pantau hasil & rincian penilaian Anda</Text>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, historyData.length === 0 && { flex: 1 }]}
        // 🌟 3. PASANGKAN KE LIST AGAR BISA PULL-TO-REFRESH
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyState}><Text style={styles.iconLarge}>📭</Text><Text style={styles.emptyStateTitle}>Belum Ada Riwayat</Text><Text style={styles.emptyStateText}>Anda belum menyelesaikan ujian apapun.</Text></View>
        }
      />
    </SafeAreaView>
  );
};

// 🎨 STYLING (Aesthetic: UIKA Green & iOS Minimalist)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  headerContainer: { paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 24 : 10, paddingBottom: 16 },
  header: { fontSize: 34, fontWeight: '800', color: '#111827', letterSpacing: 0.5 },
  subHeader: { fontSize: 15, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
  
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#065F46', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(229, 231, 235, 0.5)', overflow: 'hidden'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4, lineHeight: 24 },
  cardSub: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 14, color: '#4B5563', fontWeight: '700', marginBottom: 4 },
  gradingTypeBadge: { fontSize: 11, color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', overflow: 'hidden', fontWeight: '600' },
  scoreFinal: { fontSize: 32, fontWeight: '900', color: '#065F46' }, // Hijau UIKA
  scorePending: { fontSize: 18, fontWeight: '700', color: '#D97706', fontStyle: 'italic' },
  
  badgeWait: { backgroundColor: '#FEF3C7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  badgeWaitText: { color: '#D97706', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  badgeDone: { backgroundColor: '#D1FAE5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  badgeDoneText: { color: '#059669', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },

  // Breakdown Section
  breakdownContainer: { marginTop: 20, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  breakdownTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  breakdownLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  breakdownIcon: { fontSize: 16, marginRight: 8 },
  breakdownLabel: { fontSize: 14, color: '#334155', fontWeight: '600' },
  breakdownScore: { fontSize: 14, color: '#0F172A', fontWeight: '800' },
  
  warningBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  warningIcon: { fontSize: 16, marginRight: 8 },
  warningText: { flex: 1, fontSize: 12, color: '#B45309', lineHeight: 18, fontWeight: '500' },

  expandHint: { marginTop: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  expandHintText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 16, color: '#065F46', fontSize: 15, fontWeight: '600' },
  iconLarge: { fontSize: 48, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
  retryBtn: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
  retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});

export default CBTHistoryScreen;