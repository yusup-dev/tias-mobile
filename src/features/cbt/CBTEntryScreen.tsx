import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { useTokenStore } from '../../store/auth';
import { useCbtLogin } from '../../services/cbt/useCbtLogin';

const CBT_WEB_URL = 'https://u-talent.uika-bogor.ac.id/cbt/';

const CBTEntryScreen = ({ navigation }: any) => {
  const { cbt_token, user } = useTokenStore();
  const { mutate: loginCbt, isPending, isError } = useCbtLogin();

  // ⚙️ LOGIKA INTI (TIDAK DISENTUH)
  const isDosen = user?.role === 'Dosen' || user?.role === 'dosen';

  useEffect(() => {
    if (!isDosen && !cbt_token) {
      loginCbt();
    }
  }, []);

  useEffect(() => {
    if (cbt_token && !isDosen) {
      navigation.replace('CBTList');
    }
  }, [cbt_token]);

  // 🎨 TAMPILAN KHUSUS DOSEN
  if (isDosen) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Text style={styles.iconText}>👨‍🏫</Text>
          </View>
          <Text style={styles.title}>Portal Dosen CBT</Text>
          <Text style={styles.subtitle}>
            Pembuatan soal, manajemen ujian, dan rekapitulasi nilai hanya dapat diakses melalui platform web.
          </Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => Linking.openURL(CBT_WEB_URL)}>
            <Text style={styles.btnPrimaryText}>Buka Portal Web CBT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ⏳ TAMPILAN LOADING (PROSES JABAT TANGAN SSO)
  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#065F46" />
          <Text style={styles.loadingText}>Menghubungkan ke server ujian...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🚨 TAMPILAN ERROR JARINGAN
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.iconText}>⚠️</Text>
          </View>
          <Text style={styles.title}>Koneksi Gagal</Text>
          <Text style={styles.errorSubtitle}>
            Terjadi gangguan saat menghubungi server CBT. Pastikan jaringan internet Anda stabil.
          </Text>
          <TouchableOpacity style={styles.btnRetry} onPress={() => loginCbt()}>
            <Text style={styles.btnPrimaryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🛡️ FALLBACK LOADING
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#065F46" />
    </SafeAreaView>
  );
};

// 🎨 STYLING (Aesthetic: UIKA Green & iOS-like Minimalist)
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F4F7F6', // Latar abu-hijau terang
    padding: 24 
  },
  
  // Card Container
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 32, 
    alignItems: 'center', 
    width: '100%',
    shadowColor: '#065F46',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  
  // Icon Wrapper
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5', // Hijau UIKA sangat pudar
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: { fontSize: 36 },

  // Typography
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#111827', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginBottom: 32, 
    lineHeight: 22 
  },
  errorSubtitle: {
    fontSize: 15, 
    color: '#EF4444', // Merah peringatan
    textAlign: 'center', 
    marginBottom: 32, 
    lineHeight: 22 
  },

  // Buttons
  btnPrimary: { 
    backgroundColor: '#10B981', // UIKA Green
    paddingVertical: 16, 
    width: '100%',
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnRetry: {
    backgroundColor: '#065F46', // Hijau gelap untuk retry
    paddingVertical: 16, 
    width: '100%',
    borderRadius: 16, 
    alignItems: 'center',
  },
  btnPrimaryText: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 16,
    letterSpacing: 0.5 
  },

  // Loading Specific
  loadingCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  loadingText: { 
    marginTop: 20, 
    color: '#065F46', 
    fontSize: 15, 
    fontWeight: '600' 
  },
});

export default CBTEntryScreen;