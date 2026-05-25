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
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useMutation } from '@tanstack/react-query';
import { registerMahasiswa, registerOrangTua } from '../services/auth/register';
import { DialogComponent } from '../component/dialog';
import { LogoUika } from '../../assets/svg';

type Role = 'mahasiswa' | 'orang_tua';

type Props = {
  navigation?: any;
};

const Register = ({ navigation }: Props) => {
  const [role, setRole] = useState<Role>('mahasiswa');

  // ── Mahasiswa fields ──────────────────────────────────────────────────────
  const [npm, setNpm] = useState('');
  const [emailMhs, setEmailMhs] = useState('');
  const [passwordMhs, setPasswordMhs] = useState({ value: '', secure: true });
  const [confirmPasswordMhs, setConfirmPasswordMhs] = useState({ value: '', secure: true });

  // ── Orang Tua fields ──────────────────────────────────────────────────────
  const [namaOt, setNamaOt] = useState('');
  const [emailOt, setEmailOt] = useState('');
  const [npmOt, setNpmOt] = useState('');
  const [noHpOt, setNoHpOt] = useState('');
  const [passwordOt, setPasswordOt] = useState({ value: '', secure: true });
  const [confirmPasswordOt, setConfirmPasswordOt] = useState({ value: '', secure: true });

  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    desc: { buttonCancel: 'Tutup', buttonDone: '', title: '' },
  });

  const showDialog = (title: string, message: string) => {
    setModalQuery({
      visible: true,
      title,
      desc: { buttonCancel: 'Tutup', buttonDone: '', title: message },
    });
  };

  const { mutate: mutateMhs, isLoading: loadingMhs } = useMutation({
    mutationFn: registerMahasiswa,
    onError: (err: any) => {
      const data = err?.response?.data;
      const msg = (data?.responseMessage && data?.responseMessage !== 'error' && data?.responseMessage !== 'Error')
        ? data.responseMessage
        : (typeof data?.data === 'string' ? data.data : (data?.message || err?.message || 'Registrasi gagal. Silakan coba lagi.'));
      showDialog('Gagal', msg);
    },
    onSuccess: (res: any) => {
      const isOk = res?.isSuccess || res?.message?.toLowerCase().includes('success') || res?.responseMessage?.toLowerCase().includes('success');
      if (isOk) {
        showDialog('Berhasil', res?.responseMessage || 'Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.');
      } else {
        const errorMsg = (res?.responseMessage && res?.responseMessage !== 'error' && res?.responseMessage !== 'Error')
          ? res.responseMessage
          : (typeof res?.data === 'string' ? res.data : (res?.message || 'Registrasi gagal. Silakan coba lagi.'));
        showDialog('Gagal', errorMsg);
      }
    },
  });

  const { mutate: mutateOt, isLoading: loadingOt } = useMutation({
    mutationFn: registerOrangTua,
    onError: (err: any) => {
      const data = err?.response?.data;
      const msg = (data?.responseMessage && data?.responseMessage !== 'error' && data?.responseMessage !== 'Error')
        ? data.responseMessage
        : (typeof data?.data === 'string' ? data.data : (data?.message || err?.message || 'Registrasi gagal. Silakan coba lagi.'));
      showDialog('Gagal', msg);
    },
    onSuccess: (res: any) => {
      const isOk = res?.isSuccess || res?.message?.toLowerCase().includes('success') || res?.responseMessage?.toLowerCase().includes('success');
      if (isOk) {
        showDialog('Berhasil', res?.responseMessage || 'Akun orang tua berhasil dibuat. Silakan cek email Anda untuk verifikasi.');
      } else {
        const errorMsg = (res?.responseMessage && res?.responseMessage !== 'error' && res?.responseMessage !== 'Error')
          ? res.responseMessage
          : (typeof res?.data === 'string' ? res.data : (res?.message || 'Registrasi gagal. Silakan coba lagi.'));
        showDialog('Gagal', errorMsg);
      }
    },
  });

  const isLoading = loadingMhs || loadingOt;

  const validate = () => {
    if (role === 'mahasiswa') {
      if (!npm.trim() || !emailMhs.trim() || !passwordMhs.value) {
        showDialog('Perhatian', 'Semua field wajib diisi.');
        return false;
      }
      if (passwordMhs.value !== confirmPasswordMhs.value) {
        showDialog('Perhatian', 'Konfirmasi password tidak cocok.');
        return false;
      }
      if (passwordMhs.value.length < 6) {
        showDialog('Perhatian', 'Password minimal 6 karakter.');
        return false;
      }
    } else {
      if (!namaOt.trim() || !emailOt.trim() || !npmOt.trim() || !noHpOt.trim() || !passwordOt.value) {
        showDialog('Perhatian', 'Semua field wajib diisi.');
        return false;
      }
      if (passwordOt.value !== confirmPasswordOt.value) {
        showDialog('Perhatian', 'Konfirmasi password tidak cocok.');
        return false;
      }
      if (passwordOt.value.length < 6) {
        showDialog('Perhatian', 'Password minimal 6 karakter.');
        return false;
      }
      if (noHpOt.trim().length < 10) {
        showDialog('Perhatian', 'Nomor HP minimal 10 digit.');
        return false;
      }
    }
    return true;
  };

  const submit = () => {
    if (!validate()) return;
    if (role === 'mahasiswa') {
      mutateMhs({
        npm_nidn: npm.trim(),
        email: emailMhs.trim(),
        password: passwordMhs.value,
        password2: confirmPasswordMhs.value,
      });
    } else {
      mutateOt({
        nama_lengkap: namaOt.trim(),
        email: emailOt.trim(),
        npm: npmOt.trim(),
        no_hp: noHpOt.trim(),
        password: passwordOt.value,
        password2: confirmPasswordOt.value,
      });
    }
  };

  // ── Reusable field renderers ───────────────────────────────────────────────

  const renderTextField = (
    label: string,
    iconName: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    keyboardType: any = 'default',
    maxLength?: number,
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIcon}>
          <Icon name={iconName} size={22} color="gray" />
        </View>
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
    </View>
  );

  const renderPasswordField = (
    label: string,
    state: { value: string; secure: boolean },
    onChange: (v: { value: string; secure: boolean }) => void,
    placeholder: string,
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIcon}>
          <Icon name="lock" size={22} color="gray" />
        </View>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={state.secure}
          style={styles.input}
          value={state.value}
          onChangeText={val => onChange({ ...state, value: val })}
        />
        <TouchableOpacity onPress={() => onChange({ ...state, secure: !state.secure })}>
          <View style={styles.inputIcon}>
            <Icon name={state.secure ? 'eye' : 'eye-off'} size={22} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/login/ikhwan.png')}
          resizeMode="contain"
          style={styles.headerImage}
        />
        {/* Title & Logo overlaid at bottom of header */}
        <View style={styles.headerBottom}>
          <Text style={styles.titleText}>Register</Text>
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
        <ScrollView showsVerticalScrollIndicator={false}>

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

          {/* ── Form Mahasiswa ── */}
          {role === 'mahasiswa' && (
            <>
              {renderTextField('NPM/NIDN', 'card-account-details', npm, setNpm, 'Masukkan NPM/NIDN', 'numeric')}
              {renderTextField('Email', 'email', emailMhs, setEmailMhs, 'Masukkan email', 'email-address')}
              {renderPasswordField('Password', passwordMhs, setPasswordMhs, 'Masukkan password')}
              {renderPasswordField('Konfirmasi Password', confirmPasswordMhs, setConfirmPasswordMhs, 'Ulangi password')}
            </>
          )}

          {/* ── Form Orang Tua ── */}
          {role === 'orang_tua' && (
            <>
              {/* Warning Box */}
              <View style={styles.warningBox}>
                <View style={styles.warningHeader}>
                  <Icon name="alert-decagram" size={20} color="#DC2626" />
                  <Text style={styles.warningTitle}>PERINGATAN KERAS</Text>
                </View>
                <Text style={styles.warningText}>
                  Mahasiswa dilarang keras mendaftar sebagai orang tua/wali. Penyalahgunaan akun atau pemalsuan data akan dikenakan sanksi tegas oleh pihak kampus.
                </Text>
              </View>

              {renderTextField('Nama Lengkap', 'account', namaOt, setNamaOt, 'Masukkan nama lengkap')}
              {renderTextField('Email', 'email', emailOt, setEmailOt, 'Masukkan email', 'email-address')}
              {renderTextField('NPM Mahasiswa', 'card-account-details', npmOt, setNpmOt, 'NPM anak/mahasiswa', 'numeric')}
              {renderTextField('No. HP', 'phone', noHpOt, setNoHpOt, 'Masukkan nomor HP', 'phone-pad', 15)}
              {renderPasswordField('Password', passwordOt, setPasswordOt, 'Masukkan password')}
              {renderPasswordField('Konfirmasi Password', confirmPasswordOt, setConfirmPasswordOt, 'Ulangi password')}
            </>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={submit}
            disabled={isLoading}
            style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}>
            <Text style={styles.submitText}>Register</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <Text style={styles.loginLink}>Masuk Sekarang</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: responsiveHeight(2),
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  headerImage: {
    height: responsiveHeight(28),
    width: responsiveWidth(65),
  },
  headerBottom: {
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
  submitBtn: {
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(3),
    borderRadius: responsiveWidth(3),
    marginTop: responsiveWidth(4),
    marginBottom: responsiveWidth(3),
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: responsiveFontSize(2),
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: responsiveWidth(4),
  },
  loginHint: {
    color: '#555',
  },
  loginLink: {
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
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: responsiveWidth(4),
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningTitle: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
    marginLeft: 6,
  },
  warningText: {
    color: '#991B1B',
    fontSize: responsiveFontSize(1.4),
    lineHeight: 20,
    textAlign: 'justify',
  },
});

export default Register;