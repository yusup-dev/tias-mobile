import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, SafeAreaView, Platform, StatusBar,
} from 'react-native';
import { useExamList, Exam } from '../../services/cbt/useExamList';

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
};

const CBTListScreen = ({ navigation }: any) => {
  const { data: exams, isLoading, isError, refetch, isFetching } = useExamList();

  const renderItem = ({ item }: { item: Exam }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('CBTToken', { exam: item })}
    >
      {/* Strip aksen kuning di kiri */}
      <View style={styles.cardAccent} />

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.nama_ujian}</Text>
            <Text style={styles.cardSub}>{item.mata_kuliah?.nama_mk || 'Mata Kuliah Umum'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🟢 Aktif</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.infoChip}>
            <Text style={styles.infoChipText}>⏱ {item.durasi} menit</Text>
          </View>
          <View style={styles.startBtn}>
            <Text style={styles.startBtnText}>Mulai Ujian →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ⏳ Loading
  if (isLoading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.green} />
        <Text style={styles.loadingText}>Memuat daftar ujian...</Text>
      </View>
    </SafeAreaView>
  );

  // 🚨 Error
  if (isError) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.iconLarge}>📡</Text>
        <Text style={styles.errorTitle}>Koneksi Gagal</Text>
        <Text style={styles.errorSubtitle}>Tidak dapat mengambil data ujian dari server.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Dekorasi */}
      <View style={styles.bgCircle} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Daftar Ujian</Text>
          <Text style={styles.subHeader}>Pilih sesi yang sedang berlangsung</Text>
        </View>
        {/* Tombol ke Riwayat */}
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate('CBTHistory')}
          activeOpacity={0.8}
        >
          <Text style={styles.historyBtnIcon}>📋</Text>
          <Text style={styles.historyBtnText}>Riwayat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={exams}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          exams?.length === 0 && { flex: 1 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[C.green]}
            tintColor={C.green}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.iconLarge}>☕</Text>
            <Text style={styles.emptyStateTitle}>Tidak Ada Ujian</Text>
            <Text style={styles.emptyStateText}>
              Saat ini tidak ada sesi ujian yang sedang berlangsung untuk Anda.
            </Text>
            <TouchableOpacity
              style={styles.emptyHistoryBtn}
              onPress={() => navigation.navigate('CBTHistory')}
            >
              <Text style={styles.emptyHistoryBtnText}>📋  Lihat Riwayat Ujian</Text>
            </TouchableOpacity>
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

  // Header
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

  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.yellowLight,
    borderWidth: 1.5,
    borderColor: C.yellow,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  historyBtnIcon: { fontSize: 16 },
  historyBtnText: { color: C.yellowDark, fontWeight: '700', fontSize: 13 },

  // List
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
    backgroundColor: C.yellow,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardBody: { flex: 1, padding: 18 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.greenDark, lineHeight: 22 },
  cardSub: { fontSize: 13, color: C.textGray, marginTop: 4, fontWeight: '500' },
  divider: { height: 1, backgroundColor: C.greenLight, marginBottom: 14 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoChip: {
    backgroundColor: C.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  infoChipText: { color: C.textMid, fontSize: 12, fontWeight: '700' },

  startBtn: {
    backgroundColor: C.green,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  startBtnText: { color: C.white, fontSize: 13, fontWeight: '800' },

  badge: {
    backgroundColor: C.greenLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  badgeText: { color: C.green, fontSize: 11, fontWeight: '800' },

  // State helpers
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 16, color: C.greenDark, fontSize: 15, fontWeight: '600' },
  iconLarge: { fontSize: 52, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: C.greenDark, marginBottom: 8 },
  errorSubtitle: { fontSize: 14, color: C.textGray, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  retryBtn: {
    backgroundColor: C.green,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryBtnText: { color: C.white, fontWeight: '700', fontSize: 15 },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: C.greenDark, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: C.textGray, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  emptyHistoryBtn: {
    backgroundColor: C.yellowLight,
    borderWidth: 1.5,
    borderColor: C.yellow,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  emptyHistoryBtnText: { color: C.yellowDark, fontWeight: '700', fontSize: 14 },
});

export default CBTListScreen;