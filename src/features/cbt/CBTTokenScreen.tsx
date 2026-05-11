import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useVerifyToken } from '../../services/cbt/useVerifyToken';

const CBTTokenScreen = ({ route, navigation }: any) => {
  const { exam } = route.params;
  const [tokenInput, setTokenInput] = useState('');
  const { mutate: verifyToken, isPending } = useVerifyToken();

  // ⚙️ LOGIKA INTI (TIDAK DISENTUH)
  const handleVerifikasi = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      Alert.alert('Perhatian', 'Masukkan token ujian terlebih dahulu.');
      return;
    }

    verifyToken(trimmed, {
      onSuccess: (data) => {
        if (data?.data || data?.message === "Akses Diberikan!") { 
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inner}>
          
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <Text style={styles.title}>{exam.nama_ujian}</Text>
            <View style={styles.badge}>
              <Text style={styles.subtitle}>{exam.mata_kuliah?.nama_mk} • {exam.durasi} Menit</Text>
            </View>
          </View>

          {/* Card Section */}
          <View style={styles.card}>
            <Text style={styles.label}>Token Akses Ujian</Text>
            <Text style={styles.hint}>Masukkan 6 digit token rahasia dari dosen pengawas</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Contoh: ABC123"
              placeholderTextColor="#9CA3AF"
              value={tokenInput}
              onChangeText={setTokenInput}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={20}
              editable={!isPending}
            />
            
            <TouchableOpacity
              style={[styles.btnPrimary, isPending && styles.btnDisabled]}
              onPress={handleVerifikasi}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>Masuk ke Ruang Ujian</Text>
              )}
            </TouchableOpacity>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 🎨 STYLING (Aesthetic: UIKA Green & iOS-like Minimalist)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  keyboardView: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 24, paddingBottom: Platform.OS === 'ios' ? 60 : 40 },
  
  // Header
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconText: { fontSize: 32 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 12, letterSpacing: 0.5 },
  badge: { backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  subtitle: { fontSize: 13, color: '#4B5563', fontWeight: '600', textAlign: 'center' },

  // Card
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 28, 
    shadowColor: '#065F46', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 20, 
    elevation: 5 
  },
  label: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  hint: { fontSize: 13, color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  
  // Input
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5, 
    borderColor: '#E5E7EB', 
    borderRadius: 16,
    paddingVertical: 18, 
    paddingHorizontal: 20,
    fontSize: 22, 
    fontWeight: '800', 
    letterSpacing: 6, 
    textAlign: 'center', 
    color: '#111827',
    marginBottom: 24,
  },

  // Button
  btnPrimary: { 
    backgroundColor: '#10B981', // Hijau UIKA Terang
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: '#6EE7B7', // Hijau pudar saat loading
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
});

export default CBTTokenScreen;