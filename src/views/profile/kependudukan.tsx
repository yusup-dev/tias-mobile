import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTokenStore } from '../../store/auth';

const KependudukanScreen = (props: any) => {
  const { user } = useTokenStore();

  // Data kependudukan (ambil dari user store, fallback ke placeholder)
  const dataFields = [
    { label: 'Nama Lengkap', value: user?.nama_lengkap || '-', icon: 'account' },
    { label: 'NPM / NIP', value: user?.npm || user?.nip || '-', icon: 'card-account-details' },
    { label: 'Tempat Lahir', value: user?.tempat_lahir || '-', icon: 'map-marker' },
    { label: 'Tanggal Lahir', value: user?.tanggal_lahir || '-', icon: 'calendar' },
    { label: 'Jenis Kelamin', value: user?.jenis_kelamin || '-', icon: 'gender-male-female' },
    { label: 'Agama', value: user?.agama || '-', icon: 'hands-pray' },
    { label: 'NIK', value: user?.nik || '-', icon: 'card-account-details-outline' },
    { label: 'No. KK', value: user?.no_kk || '-', icon: 'home-group' },
    { label: 'Golongan Darah', value: user?.golongan_darah || '-', icon: 'water' },
    { label: 'Status Pernikahan', value: user?.status_pernikahan || '-', icon: 'ring' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Kependudukan</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Icon name="information-outline" size={18} color="#15613F" />
        <Text style={styles.infoText}>
          Data ini diambil dari sistem akademik. Hubungi admin untuk perubahan data.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Icon name="account" size={40} color="#FFF" />
          </View>
          <Text style={styles.avatarName}>{user?.nama_lengkap || 'Pengguna'}</Text>
          <Text style={styles.avatarSubtitle}>{user?.role || 'Mahasiswa'}</Text>
        </View>

        {/* Data Fields */}
        <View style={styles.cardGroup}>
          {dataFields.map((field, index) => (
            <View
              key={field.label}
              style={[
                styles.fieldRow,
                index !== dataFields.length - 1 && styles.fieldBorder,
              ]}>
              <View style={styles.fieldIconBox}>
                <Icon name={field.icon} size={20} color="#15613F" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Text style={styles.fieldValue}>{field.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveWidth(4),
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: responsiveFontSize(1.4),
    color: '#15613F',
    lineHeight: 18,
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(4),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: responsiveWidth(5),
  },
  avatar: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    backgroundColor: '#15613F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  avatarSubtitle: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginTop: 2,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveWidth(3.5),
    paddingHorizontal: responsiveWidth(4),
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(3),
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#1F2937',
    fontWeight: '600',
  },
});

export default KependudukanScreen;
