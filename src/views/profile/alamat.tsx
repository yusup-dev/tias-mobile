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
import {useTokenStore} from '../../store/auth';

const AlamatScreen = (props: any) => {
  const {user} = useTokenStore();

  const alamatFields = [
    {label: 'Alamat Lengkap', value: user?.alamat || '-', icon: 'home-map-marker'},
    {label: 'RT / RW', value: user?.rt_rw || (user?.rt && user?.rw ? `${user.rt} / ${user.rw}` : '-'), icon: 'home-group'},
    {label: 'Kelurahan / Desa', value: user?.kelurahan || user?.desa || '-', icon: 'map-marker-radius'},
    {label: 'Kecamatan', value: user?.kecamatan || '-', icon: 'map-marker'},
    {label: 'Kota / Kabupaten', value: user?.kota || user?.kabupaten || '-', icon: 'city'},
    {label: 'Provinsi', value: user?.provinsi || '-', icon: 'map'},
    {label: 'Kode Pos', value: user?.kode_pos || '-', icon: 'mailbox'},
    {label: 'No. Telepon', value: user?.no_telp || user?.phone || '-', icon: 'phone'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alamat</Text>
        <View style={{width: 28}} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Icon name="information-outline" size={18} color="#15613F" />
        <Text style={styles.infoText}>
          Data alamat sesuai dengan yang terdaftar di sistem akademik.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Map Illustration */}
        <View style={styles.mapIllustration}>
          <Icon name="map-marker-radius" size={50} color="#15613F" />
          <Text style={styles.mapTitle}>Alamat Domisili</Text>
          <Text style={styles.mapSubtitle}>Data tempat tinggal yang terdaftar</Text>
        </View>

        {/* Data Fields */}
        <View style={styles.cardGroup}>
          {alamatFields.map((field, index) => (
            <View
              key={field.label}
              style={[
                styles.fieldRow,
                index !== alamatFields.length - 1 && styles.fieldBorder,
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

        <View style={{height: 30}} />
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
  mapIllustration: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingVertical: responsiveWidth(6),
    marginBottom: responsiveWidth(5),
  },
  mapTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
  },
  mapSubtitle: {
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    marginTop: 4,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
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

export default AlamatScreen;
