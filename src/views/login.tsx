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
import { LogoUika } from '../../assets/svg';

type Role = 'mahasiswa' | 'orang_tua';

type Props = {
  navigation?: any;
};

const Login = (props: any) => {
  const [check, setCheck] = useState(false);
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: {
      value: '',
      secure: true,
    },
  });
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

  const handleSuccess = (succ: any) => {
    const isSuccess = succ?.isSuccess ||
      succ?.message?.toLowerCase().includes('success') ||
      succ?.responseMessage?.toLowerCase().includes('success') ||
      succ?.data?.token;

    if (isSuccess) {
      const userData = {
        ...succ?.data,
        role: succ?.data?.role || (role === 'orang_tua' ? 'Parent' : 'Mahasiswa')
      };
      setUser(userData);
      setToken(succ?.data?.token);
      storeSetRememberMe(rememberMe);
      setAuthentication(true);
    } else {
      // Ambil pesan error dari response
      const errorMsg = (succ?.responseMessage && succ?.responseMessage !== 'error' && succ?.responseMessage !== 'Error')
        ? succ.responseMessage
        : (typeof succ?.data === 'string' ? succ.data : (succ?.message || 'Login gagal. Periksa kembali email dan password Anda.'));

      showDialog('Gagal', errorMsg);
    }
  };

  const { mutate: mutateMhs, isLoading: loadingMhs } = useMutation({
    mutationFn: login,
    onError: (err: any) => {
      const data = err?.response?.data;
      const msg = (data?.responseMessage && data?.responseMessage !== 'error' && data?.responseMessage !== 'Error')
        ? data.responseMessage
        : (typeof data?.data === 'string' ? data.data : (data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi.'));
      showDialog('Gagal', msg);
    },
    onSuccess: handleSuccess,
  });

  const { mutate: mutateOt, isLoading: loadingOt } = useMutation({
    mutationFn: loginOrangTua,
    onError: (err: any) => {
      const data = err?.response?.data;
      const msg = (data?.responseMessage && data?.responseMessage !== 'error' && data?.responseMessage !== 'Error')
        ? data.responseMessage
        : (typeof data?.data === 'string' ? data.data : (data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi.'));
      showDialog('Gagal', msg);
    },
    onSuccess: handleSuccess,
  });

  const isLoading = loadingMhs || loadingOt;

  const submit = () => {
    if (!email.trim() || !password.value) {
      showDialog('Perhatian', 'Email dan Password wajib diisi.');
      return;
    }

    // Validasi format email sederhana
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>

      {/* Hero image */}
      <View style={styles.hero}>
        <Image
          source={require('../../assets/login/ikhwan.png')}
          resizeMode="contain"
          style={styles.heroImage}
        />
        {/* Title & Logo at bottom of hero */}
        <View style={styles.heroBottom}>
          <Text style={styles.titleText}>Sign In</Text>
          <Image source={LogoUika} resizeMode="contain" style={styles.logo} />
        </View>
      </View>

      <DialogComponent
        visible={modalQuery.visible}
        onDismiss={() => setModalQuery({ ...modalQuery, visible: false })}
        title={modalQuery.title}
        desc={modalQuery.desc}
      />

      {/* Card */}
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Role Toggle */}
          <View style={styles.roleWrapper}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'mahasiswa' && styles.roleBtnActive]}
              onPress={() => setRole('mahasiswa')}>
              <Icon name="school" size={18} color={role === 'mahasiswa' ? '#fff' : '#15613F'} />
              <Text style={[styles.roleBtnText, role === 'mahasiswa' && styles.roleBtnTextActive]}>
                Akademik
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'orang_tua' && styles.roleBtnActive]}
              onPress={() => setRole('orang_tua')}>
              <Icon name="account-supervisor" size={18} color={role === 'orang_tua' ? '#fff' : '#15613F'} />
              <Text style={[styles.roleBtnText, role === 'orang_tua' && styles.roleBtnTextActive]}>
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

            <TextInput
              placeholder="Please put your password"
              secureTextEntry={formLogin.password.secure}
              style={{
                flex: 1,
                marginLeft: responsiveWidth(2),
              }}
              onChangeText={val => {
                setFormLogin({
                  ...formLogin,
                  password: {
                    secure: formLogin.password.secure,
                    value: val,
                  },
                });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setFormLogin({
                  ...formLogin,
                  password: {
                    secure: !formLogin.password.secure,
                    value: formLogin.password.value,
                  },
                });
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                {formLogin.password.secure ? (
                  <Icon name="eye" size={25} color="gray" />
                ) : (
                  <Icon name="eye-off" size={25} color="gray" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: responsiveWidth(1),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Checkbox
              status={check ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheck(!check);
              }}
            />

            <Text
              style={{
                alignSelf: 'center',
              }}>
              Ingat Saya
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('forgotPassword')}
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                color: 'gray',
              }}>
              Lupa Password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={submit}
          style={{
            backgroundColor: '#15613F',
            paddingVertical: responsiveWidth(3),
            borderRadius: responsiveWidth(3),
            marginVertical: responsiveWidth(3),
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
            }}>
            Login
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: responsiveWidth(2),
          }}>
          <Text>Belum punya akun?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('register')}>
            <Text
              style={{
                color: '#15613F',
                fontWeight: '700',
              }}>
              Daftar Sekarang
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Mohon tunggu...</Text>
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
    height: responsiveHeight(28),
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveWidth(3),
  },
  titleText: {
    color: '#15613F',
    fontWeight: '700',
    fontSize: responsiveFontSize(3.2),
  },
  logo: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
  },
  roleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F1FD',
    borderRadius: responsiveWidth(3),
    marginBottom: responsiveWidth(4),
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
    fontSize: responsiveFontSize(1.8),
    marginLeft: 4,
  },
  roleBtnTextActive: {
    color: '#fff',
  },
  fieldWrapper: {
    marginBottom: responsiveWidth(3),
  },
  label: {
    fontSize: responsiveFontSize(1.7),
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
    paddingVertical: responsiveWidth(2.5),
  },
  input: {
    flex: 1,
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveWidth(2),
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#333',
    fontSize: responsiveFontSize(1.7),
  },
  forgotText: {
    color: 'gray',
    fontSize: responsiveFontSize(1.7),
  },
  submitBtn: {
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(3),
    borderRadius: responsiveWidth(3),
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(3),
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: responsiveFontSize(2),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: responsiveWidth(4),
  },
  registerHint: {
    color: '#555',
  },
  registerLink: {
    color: '#15613F',
    fontWeight: '700',
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
  },
});

export default Login;