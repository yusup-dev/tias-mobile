import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editProfileParent } from '../../services/auth/profile';
import { useTokenStore } from '../../store/auth';

const EditParentProfileScreen = ({ navigation }: any) => {
  const { user, setUser } = useTokenStore();
  const queryClient = useQueryClient();

  const [namaLengkap, setNamaLengkap] = useState('');
  const [noHp, setNoHp] = useState('');

  useEffect(() => {
    if (user) {
      setNamaLengkap(user.nama_lengkap || '');
      setNoHp(user.no_hp || '');
    }
  }, [user]);

  const { mutate, isLoading } = useMutation({
    mutationFn: editProfileParent,
    onSuccess: () => {
      setUser({ ...user, nama_lengkap: namaLengkap, no_hp: noHp });
      queryClient.invalidateQueries(['parentProfile']);
      Alert.alert('Berhasil', 'Profil berhasil diperbarui.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert(
        'Gagal',
        err?.response?.data?.message || err?.message || 'Gagal memperbarui profil.',
      );
    },
  });

  const handleSave = () => {
    if (!noHp.trim()) {
      Alert.alert('Perhatian', 'Nomor handphone wajib diisi.');
      return;
    }
    mutate({
      nama_lengkap: namaLengkap,
      no_hp: noHp.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Profil</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Form Card */}
        <View style={styles.formCard}>

          {/* Field Nama (Read Only) */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={[styles.inputRow, styles.inputRowDisabled]}>
              <View style={styles.iconWrapper}>
                <Icon name="account" size={22} color="#9CA3AF" />
              </View>
              <TextInput
                style={[styles.input, { color: '#9CA3AF' }]}
                value={namaLengkap}
                editable={false}
              />
              <Icon name="lock-outline" size={18} color="#D1D5DB" />
            </View>
            <Text style={styles.helperText}>Nama lengkap tidak dapat diubah.</Text>
          </View>

          {/* Field No HP */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Nomor Handphone</Text>
            <View style={styles.inputRow}>
              <View style={styles.iconWrapper}>
                <Icon name="phone" size={22} color="#15613F" />
              </View>
              <TextInput
                style={styles.input}
                value={noHp}
                onChangeText={setNoHp}
                placeholder="Masukkan nomor handphone"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* NPM (Read Only) */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>NPM Mahasiswa</Text>
            <View style={[styles.inputRow, styles.inputRowDisabled]}>
              <View style={styles.iconWrapper}>
                <Icon name="card-account-details-outline" size={22} color="#9CA3AF" />
              </View>
              <TextInput
                style={[styles.input, { color: '#9CA3AF' }]}
                value={user?.npm || ''}
                editable={false}
              />
              <Icon name="lock-outline" size={18} color="#D1D5DB" />
            </View>
            <Text style={styles.helperText}>NPM terikat dengan data mahasiswa.</Text>
          </View>

          {/* Email (Read Only) */}
          <View style={[styles.fieldWrapper, { marginBottom: 0 }]}>
            <Text style={styles.label}>Email Terdaftar</Text>
            <View style={[styles.inputRow, styles.inputRowDisabled]}>
              <View style={styles.iconWrapper}>
                <Icon name="email" size={22} color="#9CA3AF" />
              </View>
              <TextInput
                style={[styles.input, { color: '#9CA3AF' }]}
                value={user?.email || ''}
                editable={false}
              />
              <Icon name="lock-outline" size={18} color="#D1D5DB" />
            </View>
            <Text style={styles.helperText}>Email tidak dapat diubah.</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, isLoading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="content-save-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: responsiveWidth(10) }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(6),
    paddingBottom: responsiveWidth(4),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveWidth(6),
    borderRadius: 16,
    padding: responsiveWidth(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: responsiveWidth(6),
  },
  fieldWrapper: {
    marginBottom: responsiveWidth(5),
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    color: '#4B5563',
    marginBottom: responsiveWidth(2),
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: responsiveWidth(3.5),
    height: 52,
  },
  inputRowDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  iconWrapper: {
    marginRight: responsiveWidth(2),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: '#1F2937',
    fontWeight: '500',
  },
  helperText: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
    marginTop: responsiveWidth(1.5),
    fontStyle: 'italic',
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#15613F',
    height: 56,
    marginHorizontal: responsiveWidth(5),
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#15613F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default EditParentProfileScreen;
