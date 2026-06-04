import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useTokenStore} from '../../store/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ValidateComponent = ({
  props,
  onPress,
  dataMatkul,
}: {
  props?: any;
  onPress: () => any;
  dataMatkul: {
    matkul: string;
    pertemuan: string;
    dosen: string;
    kelas: string;
    token: string;
    meetingId?: string;
  };
}) => {
  const {user} = useTokenStore();

  const handleLanjutFace = () => {
    props?.navigation?.push('absensi.face', {
      subjectId: user?.npm || '',
      token: dataMatkul.token,
      meetingId: dataMatkul.meetingId || '',
      subject: dataMatkul.matkul,
      lecturer: dataMatkul.dosen,
      className: dataMatkul.kelas,
      authToken: useTokenStore.getState().token,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F4C2A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPress} style={styles.backBtn}>
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Absensi</Text>
        <View style={{width: 38}} />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroIconWrapper}>
          <Icon name="calendar-check" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.heroPertemuan}>
          Pertemuan ke-{dataMatkul.pertemuan}
        </Text>
        <View style={styles.tokenBadge}>
          <Icon name="key-variant" size={12} color="#4ADE80" />
          <Text style={styles.tokenBadgeText}>Token: {dataMatkul.token}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../../assets/absensi/user-default.png')}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <Icon name="account-check" size={12} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.profileName}>{user?.nama_lengkap || 'Nama Mahasiswa'}</Text>
          <Text style={styles.profileNpm}>{user?.npm || '-'}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Detail Perkuliahan</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <Icon name="book-open-variant" size={18} color="#15613F" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Mata Kuliah</Text>
              <Text style={styles.infoValue}>{dataMatkul.matkul || '-'}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <Icon name="account-tie" size={18} color="#15613F" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Dosen Pengampu</Text>
              <Text style={styles.infoValue}>{dataMatkul.dosen || '-'}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoItem, {flex: 1}]}>
              <View style={styles.infoIconBox}>
                <Icon name="google-classroom" size={18} color="#15613F" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Kelas</Text>
                <Text style={styles.infoValue}>{dataMatkul.kelas || '-'}</Text>
              </View>
            </View>

            <View style={[styles.infoItem, {flex: 1}]}>
              <View style={styles.infoIconBox}>
                <Icon name="repeat" size={18} color="#15613F" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Pertemuan</Text>
                <Text style={styles.infoValue}>Ke-{dataMatkul.pertemuan}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notice */}
        <View style={styles.noticeBox}>
          <Icon name="face-recognition" size={20} color="#6A5BE2" />
          <Text style={styles.noticeText}>
            Langkah selanjutnya: verifikasi wajah Anda untuk menyelesaikan proses absensi
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleLanjutFace}
          style={styles.primaryBtn}
          activeOpacity={0.85}>
          <Icon name="face-recognition" size={22} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Lanjut Verifikasi Wajah</Text>
          <Icon name="arrow-right" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPress}
          style={styles.secondaryBtn}
          activeOpacity={0.7}>
          <Icon name="close-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.secondaryBtnText}>Batal</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  header: {
    backgroundColor: '#0F4C2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
  },
  heroSection: {
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(7),
    paddingHorizontal: responsiveWidth(5),
    alignItems: 'center',
    gap: 8,
  },
  heroIconWrapper: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    borderRadius: responsiveWidth(11),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroPertemuan: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  tokenBadgeText: {
    color: '#4ADE80',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '700',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(5),
    paddingBottom: responsiveWidth(8),
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(5),
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    gap: 6,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    borderWidth: 3,
    borderColor: '#15613F',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#15613F',
    borderRadius: 10,
    padding: 3,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  profileNpm: {
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(5),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    gap: 12,
  },
  infoCardTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#15613F',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.4),
    color: '#9CA3AF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#1A1A1A',
    fontWeight: '600',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    paddingVertical: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(4),
    borderLeftWidth: 4,
    borderLeftColor: '#6A5BE2',
  },
  noticeText: {
    flex: 1,
    fontSize: responsiveFontSize(1.5),
    color: '#4338CA',
    fontWeight: '500',
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(4),
    borderRadius: 16,
    gap: 10,
    elevation: 5,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(3.5),
    borderRadius: 16,
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  secondaryBtnText: {
    color: '#EF4444',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
  },
});

export default ValidateComponent;
