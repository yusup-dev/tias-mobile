import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { submitMeetingPresensi, MeetingItem } from '../../services/meeting/index';
import { useTokenStore } from '../../store/auth';
import moment from 'moment';

const DetailMeetingScreen = (props: any) => {
  const meeting: MeetingItem = props.route?.params?.meeting || {};
  const user = useTokenStore(state => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAttended, setIsAttended] = useState(meeting.status_hadir || false);

  const handlePresensi = async () => {
    setIsSubmitting(true);
    try {
      // Koordinat default kampus UIKA Bogor
      const koordinat = '-6.559770721152015, 106.79353328405361';
      const npm = user?.npm || user?.nidn || user?.id || 'DOSEN';
      const nama = user?.nama_lengkap || user?.name || 'Peserta Rapat';

      await submitMeetingPresensi({
        token: meeting.token || 'MEETING-TOKEN',
        npm: String(npm),
        koordinat: koordinat,
        status: 1,
        nama_lengkap: nama,
      });

      setIsAttended(true);
      Alert.alert(
        'Presensi Berhasil',
        'Kehadiran Anda pada rapat ini telah berhasil tercatat dalam sistem absensi TIAS.',
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('Error', 'Gagal memproses absensi rapat. Silakan coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Undangan Rapat</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeTipe}>
              <Text style={styles.badgeTipeText}>{meeting.tipe_kegiatan || 'Rapat Dosen'}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: isAttended ? '#ECFDF5' : '#FEF3C7' }]}>
              <Icon
                name={isAttended ? 'check-circle' : 'clock-alert-outline'}
                size={14}
                color={isAttended ? '#10B981' : '#D97706'}
              />
              <Text style={[styles.statusBadgeText, { color: isAttended ? '#10B981' : '#D97706' }]}>
                {isAttended ? 'Hadir' : 'Belum Presensi'}
              </Text>
            </View>
          </View>

          <Text style={styles.judulText}>{meeting.nm_kegiatan}</Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Icon name="account-tie" size={22} color="#15613F" />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Pengundang / Penyelenggara</Text>
              <Text style={styles.metaValue}>{meeting.nm_pengundang}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Icon name="map-marker-radius" size={22} color="#EF4444" />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Ruangan / Lokasi</Text>
              <Text style={styles.metaValue}>{meeting.ruangan || 'Ruang Pertemuan FTS'}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Icon name="calendar-clock" size={22} color="#3B82F6" />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Jadwal Waktu</Text>
              <Text style={styles.metaValue}>
                {meeting.tanggal ? moment(meeting.tanggal).format('dddd, DD MMMM YYYY') : '-'}
              </Text>
              <Text style={styles.metaSubValue}>{meeting.waktu || '09:00 WIB - Selesai'}</Text>
            </View>
          </View>

          {meeting.token && (
            <View style={styles.metaRow}>
              <Icon name="qrcode" size={22} color="#8B5CF6" />
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Kode Token Rapat</Text>
                <Text style={styles.metaCode}>{meeting.token}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Agenda / Deskripsi Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Agenda & Catatan Rapat</Text>
          <Text style={styles.deskripsiText}>
            {meeting.deskripsi ||
              'Rapat koordinasi berkala untuk membahas pelaksanaan Tri Dharma Perguruan Tinggi, kurikulum, serta pelayanan akademik di lingkungan Universitas Ibn Khaldun Bogor.'}
          </Text>
        </View>

        {/* Presensi Button */}
        <View style={styles.actionContainer}>
          {isAttended ? (
            <View style={styles.attendedBox}>
              <Icon name="check-decagram" size={28} color="#10B981" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.attendedTitle}>Presensi Terverifikasi</Text>
                <Text style={styles.attendedDesc}>Anda telah tercatat hadir pada rapat ini.</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.btnPresensi, isSubmitting && { opacity: 0.7 }]}
              onPress={handlePresensi}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="account-check" size={22} color="#FFF" />
                  <Text style={styles.btnPresensiText}>Presensi Hadir Sekarang</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: responsiveHeight(4),
    paddingBottom: 20,
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTipe: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTipeText: {
    fontSize: responsiveFontSize(1.25),
    fontWeight: 'bold',
    color: '#15613F',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: 'bold',
    marginLeft: 4,
  },
  judulText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  metaCol: {
    marginLeft: 12,
    flex: 1,
  },
  metaLabel: {
    fontSize: responsiveFontSize(1.2),
    color: '#9CA3AF',
  },
  metaValue: {
    fontSize: responsiveFontSize(1.45),
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 1,
  },
  metaSubValue: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    marginTop: 1,
  },
  metaCode: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    color: '#8B5CF6',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  deskripsiText: {
    fontSize: responsiveFontSize(1.4),
    color: '#4B5563',
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: 6,
  },
  btnPresensi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15613F',
    borderRadius: 16,
    paddingVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnPresensiText: {
    color: '#FFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    marginLeft: 8,
  },
  attendedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
  },
  attendedTitle: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    color: '#065F46',
  },
  attendedDesc: {
    fontSize: responsiveFontSize(1.25),
    color: '#047857',
    marginTop: 2,
  },
});

export default DetailMeetingScreen;
