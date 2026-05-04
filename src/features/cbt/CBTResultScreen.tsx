import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const CBTResultScreen = ({ route, navigation }: any) => {
  const { exam, result } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.resultHeader}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 }}>Hasil Ujian</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>{exam.nama_ujian}</Text>
          <View style={styles.scoreBox}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 }}>Total Skor Sementara</Text>
            <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>{result?.total_score ?? '-'}</Text>
          </View>
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 12 }}>Detail Penilaian</Text>
          {(result?.details ?? []).map((item: any, idx: number) => (
            <View key={item.question_id} style={styles.detailCard}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>Soal {idx + 1}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>{item.tipe?.replace('_', ' ')}</Text>
              </View>
              {item.status === 'menunggu'
                ? <View style={styles.badgeWait}><Text style={{ color: '#D97706', fontSize: 11, fontWeight: '600' }}>Menunggu Koreksi</Text></View>
                : <View style={styles.badgeDone}><Text style={{ color: '#16A34A', fontSize: 11, fontWeight: '600' }}>Skor: {item.score ?? 0}</Text></View>
              }
            </View>
          ))}
          {result?.has_pending && (
            <View style={{ backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginTop: 8 }}>
              <Text style={{ color: '#1D4ED8', fontSize: 13, lineHeight: 20 }}>
                ℹ️ Beberapa soal masih menunggu koreksi dosen. Skor akhir akan diperbarui setelah semua soal dikoreksi.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.navigate('CBTList')}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Kembali ke Daftar Ujian</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultHeader: { backgroundColor: '#2E75B6', padding: 24, paddingTop: 48, alignItems: 'center' },
  scoreBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 20, alignItems: 'center', width: '70%' },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
  badgeWait: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeDone: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  btnBack: { backgroundColor: '#2E75B6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
});

export default CBTResultScreen;
