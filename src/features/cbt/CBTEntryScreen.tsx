import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTokenStore } from '../../store/auth';
import { useCbtLogin } from '../../services/cbt/useCbtLogin';

const CBT_WEB_URL = 'https://u-talent.uika-bogor.ac.id/cbt/';

const CBTEntryScreen = ({ navigation }: any) => {
  const { cbt_token, user } = useTokenStore();
  const { mutate: loginCbt, isPending, isError } = useCbtLogin();

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

  if (isDosen) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Portal Dosen CBT</Text>
        <Text style={styles.subtitle}>
          Untuk membuat dan mengelola ujian, gunakan Portal Web CBT.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(CBT_WEB_URL)}>
          <Text style={styles.buttonText}>Buka Portal Web CBT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E75B6" />
        <Text style={styles.loadingText}>Menghubungkan ke sistem ujian...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Gagal terhubung ke sistem CBT.</Text>
        <TouchableOpacity style={styles.button} onPress={() => loginCbt()}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <View style={styles.container}><ActivityIndicator size="large" color="#2E75B6" /></View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  button: { backgroundColor: '#2E75B6', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  loadingText: { marginTop: 16, color: '#555', fontSize: 14 },
  errorText: { color: '#e53e3e', marginBottom: 16, fontSize: 15, textAlign: 'center' },
});

export default CBTEntryScreen;
