import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import { forgotPassword } from '../services/auth/index';

const ForgotPasswordScreen = (props: any) => {
  const [email, setEmail] = useState('');

  const { mutate, isLoading } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data: any) => {
      Alert.alert(
        'Email Terkirim',
        'Silakan cek email Anda untuk instruksi pengaturan ulang password.',
        [{ text: 'OK', onPress: () => props.navigation.goBack() }]
      );
    },
    onError: (error: any) => {
      Alert.alert(
        'Gagal',
        error?.response?.data?.message || 'Gagal mengirim email pengaturan ulang password.'
      );
    },
  });

  const handleReset = () => {
    if (!email) {
      Alert.alert('Peringatan', 'Silakan masukkan email Anda.');
      return;
    }
    mutate({ email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={28} color="#15613F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lupa Password</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="lock-reset" size={80} color="#15613F" />
        </View>
        
        <Text style={styles.title}>Atur Ulang Password</Text>
        <Text style={styles.subtitle}>
          Masukkan alamat email Anda yang terdaftar, kami akan mengirimkan tautan untuk mengatur ulang password Anda.
        </Text>

        <View style={styles.inputWrapper}>
          <Icon name="email" size={24} color="#9CA3AF" />
          <TextInput
            placeholder="Masukkan email Anda"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={handleReset}
          disabled={isLoading}
          style={styles.resetBtn}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.resetBtnText}>Kirim Instruksi</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  content: {
    paddingHorizontal: responsiveWidth(8),
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    width: '100%',
    height: 55,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#1F2937',
  },
  resetBtn: {
    backgroundColor: '#15613F',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    elevation: 4,
    shadowColor: '#15613F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  resetBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
