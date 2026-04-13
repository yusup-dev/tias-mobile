import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTokenStore} from '../../store/auth';

const PengaturanAkunScreen = (props: any) => {
  const {user, setUser, setAuthentication, setToken, setRememberMe} = useTokenStore();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const handleSaveEmail = () => {
    if (!newEmail.includes('@')) {
      Alert.alert('Error', 'Masukkan email yang valid.');
      return;
    }
    // TODO: Panggil API update email
    Alert.alert('Berhasil', 'Email berhasil diperbarui.');
    setIsEditingEmail(false);
  };

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      Alert.alert('Error', 'Mohon lengkapi semua field password.');
      return;
    }
    if (passwordForm.newPass.length < 6) {
      Alert.alert('Error', 'Password baru minimal 6 karakter.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      Alert.alert('Error', 'Konfirmasi password tidak cocok.');
      return;
    }
    // TODO: Panggil API change password
    Alert.alert('Berhasil', 'Password berhasil diubah. Silakan login ulang.');
    setIsChangingPassword(false);
    setPasswordForm({current: '', newPass: '', confirm: ''});
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hapus Akun',
      'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.',
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            // TODO: Panggil API delete account
            Alert.alert('Akun Dihapus', 'Akun Anda telah berhasil dihapus.');
            setUser({});
            setToken('');
            setRememberMe(false);
            setAuthentication(false);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Akun</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Account Info */}
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        <View style={styles.cardGroup}>
          {/* Email */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldIconBox}>
              <Icon name="email" size={20} color="#15613F" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Email</Text>
              {isEditingEmail ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={handleSaveEmail} style={styles.saveBtn}>
                    <Icon name="check" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsEditingEmail(false)} style={styles.cancelEditBtn}>
                    <Icon name="close" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.valueRow}>
                  <Text style={styles.fieldValue}>{user?.email || '-'}</Text>
                  <TouchableOpacity onPress={() => setIsEditingEmail(true)}>
                    <Icon name="pencil" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.fieldDivider} />

          {/* NPM */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldIconBox}>
              <Icon name="card-account-details" size={20} color="#15613F" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>NPM / NIP</Text>
              <Text style={styles.fieldValue}>{user?.npm || user?.nip || '-'}</Text>
            </View>
          </View>

          <View style={styles.fieldDivider} />

          {/* Role */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldIconBox}>
              <Icon name="school" size={20} color="#15613F" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Peran</Text>
              <Text style={styles.fieldValue}>{user?.role || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Security */}
        <Text style={styles.sectionTitle}>Keamanan</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setIsChangingPassword(!isChangingPassword)}>
            <View style={[styles.fieldIconBox, {backgroundColor: '#FEF3C7'}]}>
              <Icon name="lock-reset" size={20} color="#F59E0B" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.menuLabel}>Ubah Password</Text>
              <Text style={styles.menuDesc}>Ganti password akun Anda</Text>
            </View>
            <Icon name={isChangingPassword ? 'chevron-up' : 'chevron-right'} size={22} color="#C1C1C4" />
          </TouchableOpacity>

          {isChangingPassword && (
            <View style={styles.passwordForm}>
              {/* Current Password */}
              <View style={styles.passInputRow}>
                <TextInput
                  style={styles.passInput}
                  placeholder="Password saat ini"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.current}
                  value={passwordForm.current}
                  onChangeText={val => setPasswordForm({...passwordForm, current: val})}
                />
                <TouchableOpacity onPress={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}>
                  <Icon name={showPasswords.current ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* New Password */}
              <View style={styles.passInputRow}>
                <TextInput
                  style={styles.passInput}
                  placeholder="Password baru (min. 6 karakter)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.newPass}
                  value={passwordForm.newPass}
                  onChangeText={val => setPasswordForm({...passwordForm, newPass: val})}
                />
                <TouchableOpacity onPress={() => setShowPasswords({...showPasswords, newPass: !showPasswords.newPass})}>
                  <Icon name={showPasswords.newPass ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.passInputRow}>
                <TextInput
                  style={styles.passInput}
                  placeholder="Konfirmasi password baru"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.confirm}
                  value={passwordForm.confirm}
                  onChangeText={val => setPasswordForm({...passwordForm, confirm: val})}
                />
                <TouchableOpacity onPress={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}>
                  <Icon name={showPasswords.confirm ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.changePassBtn} onPress={handleChangePassword}>
                <Text style={styles.changePassText}>Simpan Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, {color: '#EF4444'}]}>Zona Bahaya</Text>
        <View style={[styles.cardGroup, {borderWidth: 1, borderColor: '#FEE2E2'}]}>
          <TouchableOpacity style={styles.menuRow} onPress={handleDeleteAccount}>
            <View style={[styles.fieldIconBox, {backgroundColor: '#FEE2E2'}]}>
              <Icon name="delete-forever" size={20} color="#EF4444" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.menuLabel, {color: '#EF4444'}]}>Hapus Akun</Text>
              <Text style={styles.menuDesc}>Tindakan ini tidak dapat dibatalkan</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#FCA5A5" />
          </TouchableOpacity>
        </View>

        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F3F4F6'},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4), paddingTop: responsiveWidth(6), paddingBottom: responsiveWidth(4),
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backBtn: {padding: 4},
  headerTitle: {fontSize: responsiveFontSize(2.2), fontWeight: 'bold', color: '#1F2937'},
  scrollContent: {paddingHorizontal: responsiveWidth(5), paddingTop: responsiveWidth(2)},
  sectionTitle: {
    fontSize: responsiveFontSize(1.7), fontWeight: 'bold', color: '#4B5563',
    marginBottom: responsiveWidth(2), marginTop: responsiveWidth(5), marginLeft: responsiveWidth(1),
  },
  cardGroup: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: responsiveWidth(3.5), paddingHorizontal: responsiveWidth(4),
  },
  fieldDivider: {height: 1, backgroundColor: '#F3F4F6', marginLeft: responsiveWidth(16)},
  fieldIconBox: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(3),
  },
  fieldContent: {flex: 1},
  fieldLabel: {fontSize: responsiveFontSize(1.3), color: '#9CA3AF', fontWeight: '500', marginBottom: 2},
  fieldValue: {fontSize: responsiveFontSize(1.7), color: '#1F2937', fontWeight: '600'},
  valueRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  editRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  editInput: {
    flex: 1, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: responsiveFontSize(1.5), color: '#1F2937',
  },
  saveBtn: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#15613F',
    justifyContent: 'center', alignItems: 'center',
  },
  cancelEditBtn: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2',
    justifyContent: 'center', alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: responsiveWidth(3.5), paddingHorizontal: responsiveWidth(4),
  },
  menuLabel: {fontSize: responsiveFontSize(1.7), color: '#1F2937', fontWeight: '600'},
  menuDesc: {fontSize: responsiveFontSize(1.3), color: '#9CA3AF', marginTop: 2},
  // Password Form
  passwordForm: {
    paddingHorizontal: responsiveWidth(4), paddingBottom: responsiveWidth(4),
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  passInputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, marginTop: 10,
  },
  passInput: {flex: 1, paddingVertical: 12, fontSize: responsiveFontSize(1.5), color: '#1F2937'},
  changePassBtn: {
    backgroundColor: '#15613F', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginTop: 16,
  },
  changePassText: {color: '#FFFFFF', fontSize: responsiveFontSize(1.6), fontWeight: 'bold'},
});

export default PengaturanAkunScreen;
