import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useVerifyToken } from '../../services/cbt/useVerifyToken';

const CBTTokenScreen = ({ route, navigation }: any) => {
  const { exam } = route.params;
  const [tokenInput, setTokenInput] = useState('');
  const { mutate: verifyToken, isPending } = useVerifyToken();

  const handleVerifikasi = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      Alert.alert('Perhatian', 'Masukkan token ujian terlebih dahulu.');
      return;
    }

    verifyToken(trimmed, {
      onSuccess: (data) => {
        if (data?.success) {
          navigation.replace('CBTExam', {
            exam,
            questions: data.data?.questions ?? [],
            durasi: data.data?.durasi ?? exam.durasi,
          });
        } else {
          Alert.alert('Token Tidak Valid', data?.message || 'Periksa kembali token ujian Anda.');
        }
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Token tidak valid atau ujian sudah ditutup.';
        Alert.alert('Gagal Masuk', msg);
      },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>{exam.nama_ujian}</Text>
        <Text style={styles.subtitle}>{exam.mata_kuliah} · {exam.durasi} menit</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Token Ujian</Text>
          <Text style={styles.hint}>Masukkan token yang diberikan oleh dosen</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: ABC123"
            placeholderTextColor="#aaa"
            value={tokenInput}
            onChangeText={setTokenInput}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={20}
          />
          <TouchableOpacity
            style={[styles.button, isPending && { backgroundColor: '#93B8D8' }]}
            onPress={handleVerifikasi}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Masuk ke Ruang Ujian</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 3 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  hint: { fontSize: 12, color: '#888', marginBottom: 14 },
  input: {
    borderWidth: 1.5, borderColor: '#CBD5E0', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 16,
    fontSize: 20, fontWeight: 'bold', letterSpacing: 4, textAlign: 'center', marginBottom: 20,
  },
  button: { backgroundColor: '#2E75B6', paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CBTTokenScreen;
