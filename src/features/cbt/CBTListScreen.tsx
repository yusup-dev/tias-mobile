import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useExamList, Exam } from '../../services/cbt/useExamList';

const CBTListScreen = ({ navigation }: any) => {
  const { data: exams, isLoading, isError, refetch, isFetching } = useExamList();

  const renderItem = ({ item }: { item: Exam }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('CBTToken', { exam: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.nama_ujian}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Berlangsung</Text>
        </View>
      </View>
      
      <Text style={styles.cardSub}>{item.mata_kuliah?.nama_mk || 'Mata Kuliah Umum'}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <View style={styles.timeContainer}>
          <Text style={styles.iconText}>⏱</Text>
          <Text style={styles.cardInfo}>{item.durasi} menit</Text>
        </View>
        <Text style={styles.actionText}>Mulai ➔</Text>
      </View>
    </TouchableOpacity>
  );

  // ⏳ TAMPILAN LOADING
  if (isLoading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#065F46" />
        <Text style={styles.loadingText}>Memuat daftar ujian...</Text>
      </View>
    </SafeAreaView>
  );

  // 🚨 TAMPILAN ERROR
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

  // 📱 TAMPILAN UTAMA (LIST UJIAN)
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Ala iOS */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Daftar Ujian</Text>
        <Text style={styles.subHeader}>Pilih ujian yang sedang berlangsung</Text>
      </View>

      <FlatList
        data={exams}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          exams?.length === 0 && { flex: 1 } // Agar Empty State berada di tengah
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={isFetching} 
            onRefresh={refetch} 
            colors={['#10B981']} // Android refresh color
            tintColor="#10B981" // iOS refresh color
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.iconLarge}>☕</Text>
            <Text style={styles.emptyStateTitle}>Tidak ada ujian</Text>
            <Text style={styles.emptyStateText}>
              Saat ini tidak ada sesi ujian yang sedang berlangsung untuk Anda.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// 🎨 STYLING (Aesthetic: UIKA Green & iOS-like Minimalist)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  
  // Header
  headerContainer: { paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 24 : 10, paddingBottom: 16 },
  header: { fontSize: 34, fontWeight: '800', color: '#111827', letterSpacing: 0.5 },
  subHeader: { fontSize: 15, color: '#6B7280', marginTop: 4, fontWeight: '500' },

  // List & Cards
  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#065F46',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', flex: 1, marginRight: 12, lineHeight: 24 },
  cardSub: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  
  // Divider dalam Card
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeContainer: { flexDirection: 'row', alignItems: 'center' },
  iconText: { fontSize: 14, marginRight: 6 },
  cardInfo: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  actionText: { fontSize: 14, fontWeight: '700', color: '#10B981' }, // Hijau UIKA

  // Badges
  badge: { backgroundColor: '#D1FAE5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  badgeText: { color: '#059669', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Layout Helpers
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  
  // State: Loading & Error & Empty
  loadingText: { marginTop: 16, color: '#065F46', fontSize: 15, fontWeight: '600' },
  iconLarge: { fontSize: 48, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  errorSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  retryBtn: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
});

export default CBTListScreen;