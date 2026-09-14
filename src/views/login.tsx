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
type LoginMethod = 'password' | 'face';

const Login = (props: any) => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [role, setRole] = useState<Role>('mahasiswa');
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({ value: '', secure: true });
  const [npm, setNpm] = useState('');
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
    if (!npm.trim()) {
      showDialog('Perhatian', 'NPM wajib diisi.');
      return;
    }

    props.navigation.navigate('faceLoginVerification', {
      npm: npm.trim(),
      rememberMe,
    });
  };

  const submit = () => {
    if (loginMethod === 'password') {
      submitPassword();
    } else {
      submitFace();
    }
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
        <View style={styles.heroBottom}>
          <Text style={styles.titleText}>Masuk Akun</Text>
          <Image
            source={require('../../assets/login/logo_uika.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Metode login */}
          <View style={styles.roleWrapper}>
            <TouchableOpacity
              style={[styles.roleBtn, loginMethod === 'password' && styles.roleBtnActive]}
              onPress={() => setLoginMethod('password')}>
              <Icon
                name="lock"
                size={18}
                color={loginMethod === 'password' ? '#fff' : '#15613F'}
              />
              <Text
                style={[
                  styles.roleBtnText,
                  loginMethod === 'password' && styles.roleBtnTextActive,
                ]}>
                Email & Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, loginMethod === 'face' && styles.roleBtnActive]}
              onPress={() => setLoginMethod('face')}>
              <Icon
                name="face-recognition"
                size={18}
                color={loginMethod === 'face' ? '#fff' : '#15613F'}
              />
              <Text
                style={[
                  styles.roleBtnText,
                  loginMethod === 'face' && styles.roleBtnTextActive,
                ]}>
                Verifikasi Wajah
              </Text>
            </TouchableOpacity>
          </View>

          {loginMethod === 'password' ? (
            <>
              {/* Role selector */}
              <View style={styles.roleWrapper}>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'mahasiswa' && styles.roleBtnActive]}
                  onPress={() => setRole('mahasiswa')}>
                  <Icon
                    name="school"
                    size={18}
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
                  style={[styles.roleBtn, role === 'orang_tua' && styles.roleBtnActive]}
                  onPress={() => setRole('orang_tua')}>
                  <Icon
                    name="account-supervisor"
                    size={18}
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
                <View style={styles.inputRow}>
                  <View style={styles.inputIcon}>
                    <Icon name="email" size={22} color="gray" />
                  </View>
                  <TextInput
                    placeholder="Masukkan email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputIcon}>
                    <Icon name="lock" size={22} color="gray" />
                  </View>
                  <TextInput
                    placeholder="Masukkan password"
                    secureTextEntry={password.secure}
                    value={password.value}
                    onChangeText={val => setPassword({ ...password, value: val })}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setPassword({ ...password, secure: !password.secure })}>
                    <View style={styles.inputIcon}>
                      <Icon
                        name={password.secure ? 'eye' : 'eye-off'}
                        size={22}
                        color="gray"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.faceVerifyRow}>
                <View style={styles.faceVerifyLeft}>
                  <Icon name="information" size={20} color="#15613F" />
                  <Text style={styles.faceVerifyLabel}>
                    Login wajah hanya untuk Mahasiswa yang wajahnya sudah didaftarkan di menu Profil.
                  </Text>
                </View>
              </View>

              {/* NPM */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>NPM</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputIcon}>
                    <Icon name="card-account-details" size={22} color="gray" />
                  </View>
                  <TextInput
                    placeholder="Masukkan NPM"
                    value={npm}
                    onChangeText={setNpm}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.optionsRow}>
            <View style={styles.rememberRow}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => {
                  setRememberMe(!rememberMe);
                }}
                color="#15613F"
              />
              <Text style={styles.rememberText}>Ingat Saya</Text>
            </View>

            {loginMethod === 'password' && (
              <TouchableOpacity
                onPress={() => props.navigation.navigate('forgotPassword')}>
                <Text style={styles.forgotText}>Lupa Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={submit} style={styles.submitBtn}>
            <Text style={styles.submitText}>
              {loginMethod === 'password' ? 'Masuk' : 'Verifikasi Wajah & Masuk'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerHint}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('register')}>
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
    backgroundColor: '#fff',
  },
  hero: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: responsiveHeight(2),
  },
  heroImage: {
    height: responsiveHeight(24),
    width: responsiveWidth(65),
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(2),
    paddingBottom: responsiveWidth(6),
  },
  titleText: {
    color: '#15613F',
    fontWeight: '700',
    fontSize: responsiveFontSize(3),
  },
  logo: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
  },
  roleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F1FD',
    borderRadius: responsiveWidth(3),
    marginBottom: responsiveWidth(3.5),
    padding: responsiveWidth(1),
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(2.5),
    borderRadius: responsiveWidth(2.5),
  },
  roleBtnActive: {
    backgroundColor: '#15613F',
  },
  roleBtnText: {
    color: '#15613F',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.6),
    marginLeft: 4,
  },
  roleBtnTextActive: {
    color: '#fff',
  },
  fieldWrapper: {
    marginBottom: responsiveWidth(2.5),
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    marginBottom: responsiveWidth(1),
    color: '#333',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F1FD',
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    alignItems: 'center',
  },
  inputIcon: {
    justifyContent: 'center',
    paddingVertical: responsiveWidth(2),
  },
  input: {
    flex: 1,
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.6),
    color: '#333',
  },
  faceVerifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: responsiveWidth(2.5),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1),
    marginVertical: responsiveWidth(1.5),
  },
  faceVerifyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faceVerifyLabel: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveWidth(1),
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#333',
    fontSize: responsiveFontSize(1.5),
  },
  forgotText: {
    color: 'gray',
    fontSize: responsiveFontSize(1.5),
  },
  submitBtn: {
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(3.2),
    borderRadius: responsiveWidth(3),
    marginTop: responsiveWidth(2),
    marginBottom: responsiveWidth(3),
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.9),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: responsiveWidth(3),
  },
  registerHint: {
    color: '#555',
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
