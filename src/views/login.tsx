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
  StyleSheet,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Checkbox } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import { login, loginOrangTua } from '../services/auth/index';
import { useTokenStore } from '../store/auth';
import { DialogComponent } from '../component/dialog';

type Role = 'mahasiswa' | 'orang_tua';

const Login = (props: any) => {
  const [role, setRole] = useState<Role>('mahasiswa');
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({ value: '', secure: true });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    desc: { buttonCancel: 'Ok', buttonDone: '', title: '' },
  });

  const { setAuthentication, setToken, setUser, setRememberMe: storeSetRememberMe } =
    useTokenStore();

  const showDialog = (title: string, message: string) => {
    setModalQuery({
      visible: true,
      title,
      desc: { buttonCancel: 'Ok', buttonDone: '', title: message },
    });
  };

  const handleSuccess = (succ: any, expectedRole: 'Parent' | 'Mahasiswa') => {
    const isSuccess =
      succ?.isSuccess ||
      succ?.message?.toLowerCase().includes('success') ||
      succ?.responseMessage?.toLowerCase().includes('success') ||
      succ?.data?.token;

    if (isSuccess) {
      const userData = {
        ...succ?.data,
        role: succ?.data?.role || expectedRole,
      };

      setUser(userData);
      setToken(succ?.data?.token);
      storeSetRememberMe(rememberMe);
      setAuthentication(true);
    } else {
      const errorMsg =
        succ?.responseMessage &&
        succ?.responseMessage !== 'error' &&
        succ?.responseMessage !== 'Error'
          ? succ.responseMessage
          : typeof succ?.data === 'string'
          ? succ.data
          : succ?.message || 'Login gagal. Periksa kembali email dan password Anda.';

      showDialog('Gagal', errorMsg);
    }
  };

  const handleError = (err: any) => {
    const data = err?.response?.data;
    const msg =
      data?.responseMessage &&
      data?.responseMessage !== 'error' &&
      data?.responseMessage !== 'Error'
        ? data.responseMessage
        : typeof data?.data === 'string'
        ? data.data
        : data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi.';
    showDialog('Gagal', msg);
  };

  const { mutate: mutateMhs, isLoading: loadingMhs } = useMutation({
    mutationFn: login,
    onError: handleError,
    onSuccess: data => handleSuccess(data, 'Mahasiswa'),
  });

  const { mutate: mutateOt, isLoading: loadingOt } = useMutation({
    mutationFn: loginOrangTua,
    onError: handleError,
    onSuccess: data => handleSuccess(data, 'Parent'),
  });

  const isLoading = loadingMhs || loadingOt;

  const submitPassword = () => {
    if (!email.trim() || !password.value) {
      showDialog('Perhatian', 'Email dan Password wajib diisi.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showDialog('Perhatian', 'Format email tidak valid.');
      return;
    }

    if (password.value.length < 6) {
      showDialog('Perhatian', 'Password minimal 6 karakter.');
      return;
    }

    const payload = { email: email.trim(), password: password.value };

    if (role === 'mahasiswa') {
      mutateMhs(payload);
    } else {
      mutateOt(payload);
    }
  };

  const submitFace = () => {
    props.navigation.navigate('faceLoginVerification', { rememberMe });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <DialogComponent
        visible={modalQuery.visible}
        title={modalQuery.title}
        desc={modalQuery.desc}
        onDismiss={() => setModalQuery({ ...modalQuery, visible: false })}
        onDone={() => setModalQuery({ ...modalQuery, visible: false })}
      />

      <View style={styles.hero}>
        <Image
          source={require('../../assets/login/ikhwan.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.titleText}>Masuk Akun</Text>
              <Text style={styles.subtitleText}>Selamat datang kembali di TIAS</Text>
            </View>
            <Image
              source={require('../../assets/login/logo_uika.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Role selector */}
          <View style={styles.roleWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.roleBtn, role === 'mahasiswa' && styles.roleBtnActive]}
              onPress={() => setRole('mahasiswa')}>
              <Icon
                name="school-outline"
                size={16}
                color={role === 'mahasiswa' ? '#fff' : '#15613F'}
              />
              <Text
                style={[
                  styles.roleBtnText,
                  role === 'mahasiswa' && styles.roleBtnTextActive,
                ]}>
                Mahasiswa / Dosen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.roleBtn, role === 'orang_tua' && styles.roleBtnActive]}
              onPress={() => setRole('orang_tua')}>
              <Icon
                name="account-supervisor-outline"
                size={16}
                color={role === 'orang_tua' ? '#fff' : '#15613F'}
              />
              <Text
                style={[
                  styles.roleBtnText,
                  role === 'orang_tua' && styles.roleBtnTextActive,
                ]}>
                Orang Tua
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'email' && styles.inputRowFocused,
              ]}>
              <Icon
                name="email-outline"
                size={20}
                color={focusedField === 'email' ? '#15613F' : '#9CA3AF'}
              />
              <TextInput
                placeholder="Masukkan email"
                placeholderTextColor="#B0B4BB"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'password' && styles.inputRowFocused,
              ]}>
              <Icon
                name="lock-outline"
                size={20}
                color={focusedField === 'password' ? '#15613F' : '#9CA3AF'}
              />
              <TextInput
                placeholder="Masukkan password"
                placeholderTextColor="#B0B4BB"
                secureTextEntry={password.secure}
                value={password.value}
                onChangeText={val => setPassword({ ...password, value: val })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => setPassword({ ...password, secure: !password.secure })}>
                <Icon
                  name={password.secure ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                color="#15613F"
              />
              <Text style={styles.rememberText}>Ingat Saya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => props.navigation.navigate('forgotPassword')}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={submitPassword} style={styles.submitBtn}>
            <Text style={styles.submitText}>Masuk</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.75} onPress={submitFace} style={styles.faceLoginBtn}>
            <Icon name="face-recognition" size={19} color="#15613F" />
            <Text style={styles.faceLoginBtnText}>atau Login via Verifikasi Wajah</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerHint}>Belum punya akun? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('register')}>
              <Text style={styles.registerLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Memproses data login...</Text>
          <ActivityIndicator color="#15613F" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: responsiveHeight(3),
  },
  heroImage: {
    height: responsiveHeight(22),
    width: responsiveWidth(60),
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: responsiveHeight(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(3.2),
    paddingBottom: responsiveHeight(3),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(2.6),
  },
  titleText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: responsiveFontSize(2.9),
    letterSpacing: 0.2,
  },
  subtitleText: {
    color: '#8A8F98',
    fontSize: responsiveFontSize(1.55),
    marginTop: 4,
  },
  logo: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
  },
  roleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F5F6F9',
    borderRadius: 14,
    marginBottom: responsiveHeight(2.2),
    padding: 4,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  roleBtnActive: {
    backgroundColor: '#15613F',
    shadowColor: '#15613F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  roleBtnText: {
    color: '#15613F',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.45),
  },
  roleBtnTextActive: {
    color: '#fff',
  },
  fieldWrapper: {
    marginBottom: responsiveHeight(2),
  },
  label: {
    fontSize: responsiveFontSize(1.5),
    marginBottom: 7,
    color: '#4B5563',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    borderWidth: 1.3,
    borderColor: '#F7F8FA',
    paddingHorizontal: 14,
    height: responsiveHeight(6.2),
  },
  inputRowFocused: {
    borderColor: '#15613F',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.6),
    color: '#1A1A1A',
    padding: 0,
  },
  faceLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 13,
    borderRadius: 16,
    marginBottom: responsiveHeight(2.6),
  },
  faceLoginBtnText: {
    color: '#15613F',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.6),
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  rememberText: {
    color: '#4B5563',
    fontSize: responsiveFontSize(1.45),
    marginLeft: -4,
  },
  forgotText: {
    color: '#15613F',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.45),
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#15613F',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: responsiveHeight(1.2),
    marginBottom: responsiveHeight(2.6),
    shadowColor: '#15613F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.85),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerHint: {
    color: '#8A8F98',
    fontSize: responsiveFontSize(1.5),
  },
  registerLink: {
    color: '#15613F',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.5),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 99,
  },
  loadingText: {
    marginRight: responsiveWidth(2),
    color: '#333',
    fontSize: responsiveFontSize(1.5),
  },
});

export default Login;
