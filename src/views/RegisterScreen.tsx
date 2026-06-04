import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useMutation } from '@tanstack/react-query';
import { register } from '../services/auth/index';

const RegisterScreen = (props: any) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Mahasiswa', // Default role
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: register,
    onSuccess: (data: any) => {
      Alert.alert('Berhasil', 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.', [
        { text: 'OK', onPress: () => props.navigation.navigate('login') }
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Gagal', error?.response?.data?.message || 'Terjadi kesalahan saat registrasi.');
    },
  });

  const handleRegister = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Peringatan', 'Semua field harus diisi.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Peringatan', 'Password tidak cocok.');
      return;
    }
    mutate({
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={28} color="#15613F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar Akun</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputWrapper}>
            <Icon name="account" size={24} color="#9CA3AF" />
            <TextInput
              placeholder="Masukkan username"
              value={form.username}
              onChangeText={(val) => setForm({ ...form, username: val })}
              style={styles.input}
            />
          </View>

          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Icon name="email" size={24} color="#9CA3AF" />
            <TextInput
              placeholder="Masukkan email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(val) => setForm({ ...form, email: val })}
              style={styles.input}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={24} color="#9CA3AF" />
            <TextInput
              placeholder="Masukkan password"
              secureTextEntry
              value={form.password}
              onChangeText={(val) => setForm({ ...form, password: val })}
              style={styles.input}
            />
          </View>

          <Text style={styles.inputLabel}>Konfirmasi Password</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock-check" size={24} color="#9CA3AF" />
            <TextInput
              placeholder="Ulangi password"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(val) => setForm({ ...form, confirmPassword: val })}
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.registerBtn}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerBtnText}>Daftar Sekarang</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('login')}>
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: '#15613F',
    marginLeft: 15,
  },
  formContainer: {
    paddingHorizontal: responsiveWidth(8),
    marginTop: 20,
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 55,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#1F2937',
  },
  registerBtn: {
    backgroundColor: '#15613F',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#15613F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  registerBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: responsiveFontSize(1.8),
    color: '#6B7280',
  },
  loginLink: {
    fontSize: responsiveFontSize(1.8),
    color: '#15613F',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
