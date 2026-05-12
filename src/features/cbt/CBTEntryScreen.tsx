import React, { useEffect } from 'react';
import {
  View, Text, ActivityIndicator, TouchableOpacity,
  StyleSheet, Linking, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { useTokenStore } from '../../store/auth';
import { useCbtLogin } from '../../services/cbt/useCbtLogin';

const CBT_WEB_URL = 'https://u-talent.uika-bogor.ac.id/cbt/';

// ============================
//  PALETTE TEMA HIJAU-KUNING UIKA
// ============================
const C = {
  bg: '#F0FDF4',           // hijau sangat muda
  green: '#16A34A',        // hijau utama
  greenDark: '#14532D',    // hijau tua
  greenMed: '#22C55E',     // hijau terang
  greenLight: '#DCFCE7',   // hijau pudar
  greenSoft: '#BBF7D0',    // hijau soft
  yellow: '#FACC15',       // kuning UIKA
  yellowLight: '#FEF9C3',  // kuning muda
  yellowDark: '#CA8A04',   // kuning tua
  white: '#FFFFFF',
  textDark: '#14532D',
  textMid: '#166534',
  textGray: '#6B7280',
  red: '#DC2626',
  redLight: '#FEE2E2',
};

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
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

        {/* Dekorasi lingkaran latar */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <View style={styles.content}>
          {/* Logo / Ikon */}
          <View style={styles.iconWrapper}>
            <Text style={styles.iconText}>👨‍🏫</Text>
          </View>

          {/* Judul */}
          <Text style={styles.title}>Portal Dosen CBT</Text>
          <Text style={styles.subtitle}>
            Pembuatan soal, manajemen ujian, dan rekapitulasi nilai hanya tersedia melalui platform web resmi UIKA.
          </Text>

          {/* Kartu menu */}
          <View style={styles.menuGrid}>
            {/* Buka Web */}
            <TouchableOpacity
              style={[styles.menuCard, { backgroundColor: C.green }]}
              onPress={() => Linking.openURL(CBT_WEB_URL)}
              activeOpacity={0.85}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuIcon}>🌐</Text>
              </View>
              <Text style={styles.menuCardTitle}>Buka Portal Web</Text>
              <Text style={styles.menuCardSub}>Kelola soal & ujian</Text>
            </TouchableOpacity>

            {/* Riwayat Nilai */}
            <TouchableOpacity
              style={[styles.menuCard, { backgroundColor: C.yellowDark }]}
              onPress={() => navigation.navigate('CBTHistory')}
              activeOpacity={0.85}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuIcon}>📋</Text>
              </View>
              <Text style={styles.menuCardTitle}>Riwayat Ujian</Text>
              <Text style={styles.menuCardSub}>Lihat rekap nilai</Text>
            </TouchableOpacity>
          </View>

          {/* Catatan */}
          <View style={styles.noteBox}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>
              Sebagai dosen, Anda dapat memantau riwayat ujian yang telah selesai langsung dari aplikasi.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ⏳ TAMPILAN LOADING (PROSES JABAT TANGAN SSO)
  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.loadingCard}>
          <View style={[styles.iconWrapper, { marginBottom: 20 }]}>
            <Text style={styles.iconText}>🔐</Text>
          </View>
          <ActivityIndicator size="large" color={C.green} />
          <Text style={styles.loadingText}>Menghubungkan ke server ujian...</Text>
          <Text style={styles.loadingSubtext}>SSO UIKA sedang diproses</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🚨 TAMPILAN ERROR JARINGAN
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.content}>
          <View style={[styles.iconWrapper, { backgroundColor: C.redLight }]}>
            <Text style={styles.iconText}>⚠️</Text>
          </View>
          <Text style={styles.title}>Koneksi Gagal</Text>
          <Text style={styles.subtitle}>
            Terjadi gangguan saat menghubungi server CBT. Pastikan jaringan internet Anda stabil.
          </Text>

          <TouchableOpacity
            style={styles.btnRetry}
            onPress={() => loginCbt()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>🔄  Coba Lagi</Text>
          </TouchableOpacity>

          {/* Tetap bisa akses riwayat meski error */}
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('CBTHistory')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnOutlineText}>📋  Lihat Riwayat Ujian</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🛡️ FALLBACK LOADING
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <ActivityIndicator size="large" color={C.green} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ——— Dekorasi lingkaran latar ———
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

  content: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  // ——— Ikon ———
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.greenLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  iconText: { fontSize: 40 },

  // ——— Tipografi ———
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.greenDark,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: C.textMid,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // ——— Menu Grid (Dosen) ———
  menuGrid: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 24,
  },
  menuCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  menuIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: { fontSize: 26 },
  menuCardTitle: {
    color: C.white,
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  menuCardSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },

  // ——— Kotak Catatan ———
  noteBox: {
    flexDirection: 'row',
    backgroundColor: C.yellowLight,
    borderLeftWidth: 4,
    borderLeftColor: C.yellow,
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
    width: '100%',
  },
  noteIcon: { fontSize: 16, marginRight: 10, marginTop: 1 },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: C.yellowDark,
    lineHeight: 18,
    fontWeight: '500',
  },

  // ——— Tombol ———
  btnRetry: {
    backgroundColor: C.red,
    paddingVertical: 16,
    width: '100%',
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: C.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: C.green,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 18,
    alignItems: 'center',
  },
  btnText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  btnOutlineText: {
    color: C.green,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // ——— Loading ———
  loadingCard: {
    backgroundColor: C.white,
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    width: '85%',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  loadingText: {
    marginTop: 20,
    color: C.greenDark,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 6,
    color: C.textGray,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CBTEntryScreen;