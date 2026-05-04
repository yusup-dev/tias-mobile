import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useExamList, Exam } from '../../services/cbt/useExamList';

const CBTListScreen = ({ navigation }: any) => {
  const { data: exams, isLoading, isError, refetch, isFetching } = useExamList();

  const renderItem = ({ item }: { item: Exam }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CBTToken', { exam: item })}
    >
      <Text style={styles.cardTitle}>{item.nama_ujian}</Text>
      <Text style={styles.cardSub}>{item.mata_kuliah}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardInfo}>⏱ {item.durasi} menit</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>Berlangsung</Text></View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#2E75B6" />
      <Text style={{ marginTop: 12, color: '#555' }}>Memuat daftar ujian...</Text>
    </View>
  );

  if (isError) return (
    <View style={styles.center}>
      <Text style={{ color: '#e53e3e', marginBottom: 12 }}>Gagal memuat ujian.</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ujian Berlangsung</Text>
      <FlatList
        data={exams}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: '#888', textAlign: 'center' }}>
              Tidak ada ujian yang sedang berlangsung.
            </Text>
          </View>
        }
        contentContainerStyle={exams?.length === 0 ? { flex: 1 } : { paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 20, paddingBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  retryBtn: { backgroundColor: '#2E75B6', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  card: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 12, padding: 16, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#666', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { fontSize: 12, color: '#888' },
  badge: { backgroundColor: '#DCFCE7', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20 },
  badgeText: { color: '#16A34A', fontSize: 11, fontWeight: 'bold' },
});

export default CBTListScreen;
