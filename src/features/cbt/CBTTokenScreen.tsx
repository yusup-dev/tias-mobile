import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, SafeAreaView, StatusBar,
} from 'react-native';
import { useVerifyToken } from '../../services/cbt/useVerifyToken';

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
  textInput: '#1A2E1A',
  border: '#D1FAE5',
};

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
        if (data?.data || data?.message === 'Akses Diberikan!') {
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
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Dekorasi lingkaran */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>

          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>🔒</Text>
            </View>

            <Text style={styles.examTitle}>{exam.nama_ujian}</Text>

            <View style={styles.infoBadgeRow}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>📚 {exam.mata_kuliah?.nama_mk || 'Umum'}</Text>
              </View>
              <View style={[styles.infoBadge, { backgroundColor: C.yellowLight, borderColor: C.yellow }]}>
                <Text style={[styles.infoBadgeText, { color: C.yellowDark }]}>⏱ {exam.durasi} Menit</Text>
              </View>
            </View>
          </View>

          {/* Token Card */}
          <View style={styles.card}>
            {/* Judul Card */}
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleDot} />
              <Text style={styles.cardTitle}>Token Akses Ujian</Text>
            </View>
            <Text style={styles.hint}>
              Masukkan kode token yang diberikan dosen pengawas untuk memulai ujian.
            </Text>

            {/* Input Token */}
            <TextInput
              style={[styles.input, isPending && { opacity: 0.6 }]}
              placeholder="A B C 1 2 3"
              placeholderTextColor="#9CA3AF"
              value={tokenInput}
              onChangeText={setTokenInput}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={20}
              editable={!isPending}
            />

            {/* Tombol Verifikasi */}
            <TouchableOpacity
              style={[styles.btnPrimary, isPending && styles.btnDisabled]}
              onPress={handleVerifikasi}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <Text style={styles.btnPrimaryText}>🚀  Masuk ke Ruang Ujian</Text>
              )}
            </TouchableOpacity>

            {/* Catatan kecil */}
            <View style={styles.noteBox}>
              <Text style={styles.noteIcon}>💡</Text>
              <Text style={styles.noteText}>
                Token bersifat rahasia dan hanya berlaku selama sesi ujian berlangsung.
              </Text>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  keyboardView: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
  },

  // Dekorasi
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: C.greenSoft,
    opacity: 0.4,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: C.yellowLight,
    opacity: 0.6,
  },

  // Header
  headerSection: { alignItems: 'center', marginBottom: 32 },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.greenLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  iconText: { fontSize: 36 },
  examTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.greenDark,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.3,
    lineHeight: 30,
  },
  infoBadgeRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  infoBadge: {
    backgroundColor: C.greenLight,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoBadgeText: { color: C.textMid, fontSize: 12, fontWeight: '700' },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: C.greenDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardTitleDot: {
    width: 5,
    height: 20,
    borderRadius: 3,
    backgroundColor: C.yellow,
    marginRight: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: C.greenDark },
  hint: { fontSize: 13, color: C.textGray, marginBottom: 24, lineHeight: 20 },

  // Input
  input: {
    backgroundColor: C.bg,
    borderWidth: 2,
    borderColor: C.greenLight,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
    color: C.textInput,
    marginBottom: 20,
  },

  // Tombol
  btnPrimary: {
    backgroundColor: C.green,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  btnDisabled: {
    backgroundColor: C.greenSoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPrimaryText: { color: C.white, fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },

  // Catatan
  noteBox: {
    flexDirection: 'row',
    backgroundColor: C.yellowLight,
    borderLeftWidth: 4,
    borderLeftColor: C.yellow,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  noteIcon: { fontSize: 14, marginRight: 8, marginTop: 1 },
  noteText: { flex: 1, fontSize: 11, color: C.yellowDark, lineHeight: 17, fontWeight: '500' },
});

export default CBTTokenScreen;