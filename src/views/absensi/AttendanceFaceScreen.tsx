import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAttendanceFace} from '../../hooks/useAttendanceFace';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('window');

const AttendanceFaceScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const params = route.params;

  const {
    step,
    errorMessage,
    cameraRef,
    startVerification,
    retry,
  } = useAttendanceFace({
    subjectId: params.subjectId,
    token: params.token,
    meetingId: params.meetingId,
    authToken: params.authToken,
  });

  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  useEffect(() => {
    if (step === 'success') {
      Alert.alert(
        '✅ Absensi Berhasil!',
        `Kehadiran Anda untuk mata kuliah "${params.subject}" telah berhasil dicatat.`,
        [
          {
            text: 'Selesai',
            onPress: () =>
              navigation.reset({index: 0, routes: [{name: 'Home'}]}),
          },
        ],
      );
    }
  }, [step, navigation]);

  const renderStatusLabel = () => {
    switch (step) {
      case 'checking_enrollment':
        return 'Mengecek pendaftaran wajah...';
      case 'ready':
        return 'Siap — Tekan tombol untuk scan';
      case 'capturing':
        return 'Mengambil foto wajah...';
      case 'verifying':
        return 'Memverifikasi wajah Anda...';
      case 'getting_location':
        return 'Mengambil lokasi GPS...';
      case 'submitting':
        return 'Mengirim data absensi...';
      case 'success':
        return '✅ Absensi Berhasil!';
      case 'error':
        return '❌ Terjadi Kesalahan';
      default:
        return '';
    }
  };

  const isLoading = [
    'checking_enrollment',
    'capturing',
    'verifying',
    'getting_location',
    'submitting',
  ].includes(step);

  const statusColor = () => {
    if (step === 'error') return '#EF4444';
    if (step === 'success') return '#15613F';
    if (step === 'ready') return '#15613F';
    return '#6A5BE2';
  };

  // --- Guard: Izin kamera ---
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.guardContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={styles.guardIconCircle}>
          <Icon name="camera-off" size={50} color="#EF4444" />
        </View>
        <Text style={styles.guardTitle}>Izin Kamera Dibutuhkan</Text>
        <Text style={styles.guardDesc}>
          Aplikasi membutuhkan izin kamera untuk melakukan verifikasi wajah.
          Harap berikan izin di pengaturan perangkat Anda.
        </Text>
        <TouchableOpacity
          style={styles.guardBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.guardBtnText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Guard: Kamera tidak ada ---
  if (device == null) {
    return (
      <SafeAreaView style={styles.guardContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={styles.guardIconCircle}>
          <Icon name="alert-circle-outline" size={50} color="#EF4444" />
        </View>
        <Text style={styles.guardTitle}>Kamera Tidak Ditemukan</Text>
        <Text style={styles.guardDesc}>
          Perangkat Anda tidak memiliki kamera depan yang tersedia.
        </Text>
        <TouchableOpacity
          style={styles.guardBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.guardBtnText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Guard: Wajah belum terdaftar ---
  if (step === 'not_enrolled') {
    return (
      <SafeAreaView style={styles.guardContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={[styles.guardIconCircle, {backgroundColor: '#FFF9E6'}]}>
          <Icon name="account-alert-outline" size={50} color="#F59E0B" />
        </View>
        <Text style={styles.guardTitle}>Wajah Belum Terdaftar</Text>
        <Text style={styles.guardDesc}>
          Data wajah Anda belum terdaftar di sistem TIAS. Silakan hubungi admin
          di Biro Administrasi Akademik untuk melakukan pendaftaran wajah.
        </Text>
        <TouchableOpacity
          style={styles.guardBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.guardBtnText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Camera Full Screen */}
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        photoQualityBalance="speed"
      />

      {/* Dark Overlay gradient top */}
      <View style={styles.gradientOverlayTop} />

      {/* Dark Overlay gradient bottom */}
      <View style={styles.gradientOverlayBottom} />

      {/* Header */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verifikasi Wajah</Text>
          <View style={{width: 38}} />
        </View>

        {/* Info Card Subject */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <Icon name="book-open-variant" size={16} color="#4ADE80" />
            <Text style={styles.infoCardSubject} numberOfLines={1}>
              {params.subject || 'Mata Kuliah'}
            </Text>
          </View>
          <View style={styles.infoCardRow}>
            <Icon name="account-tie" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.infoCardLecturer} numberOfLines={1}>
              {params.lecturer || 'Dosen'}
            </Text>
            <View style={styles.infoCardBadge}>
              <Text style={styles.infoCardBadgeText}>
                Kelas {params.className || '-'}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Face Guide Oval */}
      <View style={styles.ovalContainer}>
        <View
          style={[
            styles.ovalGuide,
            {
              borderColor:
                step === 'ready'
                  ? 'rgba(255,255,255,0.6)'
                  : step === 'error'
                  ? '#EF4444'
                  : '#4ADE80',
            },
          ]}
        />
        {isLoading && (
          <View style={styles.ovalLoadingOverlay}>
            <ActivityIndicator size="large" color="#4ADE80" />
          </View>
        )}
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, {backgroundColor: statusColor() + '22', borderColor: statusColor()}]}>
          {isLoading && <ActivityIndicator size="small" color={statusColor()} style={{marginRight: 8}} />}
          {!isLoading && (
            <Icon
              name={
                step === 'error'
                  ? 'alert-circle'
                  : step === 'success'
                  ? 'check-circle'
                  : 'face-recognition'
              }
              size={16}
              color={statusColor()}
              style={{marginRight: 8}}
            />
          )}
          <Text style={[styles.statusText, {color: statusColor()}]}>
            {renderStatusLabel()}
          </Text>
        </View>

        {/* Token Badge */}
        <View style={styles.tokenBadge}>
          <Icon name="key-variant" size={12} color="#4ADE80" />
          <Text style={styles.tokenText}>{params.token || '-'}</Text>
        </View>

        {/* Action Buttons */}
        {step === 'error' ? (
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={18} color="#FFFFFF" />
              <Text style={styles.secondaryBtnText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={retry}>
              <Icon name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.scanBtn,
              isLoading && styles.scanBtnDisabled,
              step === 'success' && styles.scanBtnSuccess,
            ]}
            onPress={startVerification}
            disabled={isLoading || step === 'success'}
            activeOpacity={0.85}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icon
                name={step === 'success' ? 'check-bold' : 'face-recognition'}
                size={26}
                color="#FFFFFF"
              />
            )}
            <Text style={styles.scanBtnText}>
              {isLoading
                ? 'Memproses...'
                : step === 'success'
                ? 'Absensi Tercatat!'
                : 'Scan Wajah Saya'}
            </Text>
          </TouchableOpacity>
        )}

        {step === 'error' && errorMessage && (
          <View style={styles.errorBox}>
            <Icon name="alert-circle-outline" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Text style={styles.privacyNote}>
          <Icon name="shield-lock-outline" size={12} color="#9CA3AF" />{' '}
          Data wajah hanya digunakan untuk verifikasi kehadiran
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Gradient Overlays
  gradientOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  gradientOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  // Safe Area & Header
  safeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(4),
    paddingBottom: responsiveWidth(2),
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Info Card
  infoCard: {
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveWidth(2),
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 14,
    paddingVertical: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(4),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 6,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoCardSubject: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    flex: 1,
  },
  infoCardLecturer: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: responsiveFontSize(1.6),
    flex: 1,
  },
  infoCardBadge: {
    backgroundColor: 'rgba(74,222,128,0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.4)',
  },
  infoCardBadgeText: {
    color: '#4ADE80',
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
  },

  // Oval Face Guide
  ovalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ovalGuide: {
    width: width * 0.65,
    height: width * 0.82,
    borderWidth: 2.5,
    borderRadius: width * 0.36,
    borderStyle: 'dashed',
  },
  ovalLoadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveWidth(8),
    paddingTop: responsiveWidth(4),
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '700',
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.8,
  },
  tokenText: {
    color: '#4ADE80',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Scan Button
  scanBtn: {
    flexDirection: 'row',
    backgroundColor: '#15613F',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    elevation: 6,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  scanBtnDisabled: {
    backgroundColor: '#374151',
    shadowOpacity: 0,
    elevation: 0,
  },
  scanBtnSuccess: {
    backgroundColor: '#065F46',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Error & Row Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#15613F',
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  errorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    lineHeight: 20,
  },
  privacyNote: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.45)',
    fontSize: responsiveFontSize(1.3),
  },

  // Guard Screens
  guardContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(10),
    gap: 16,
  },
  guardIconCircle: {
    width: responsiveWidth(26),
    height: responsiveWidth(26),
    borderRadius: responsiveWidth(13),
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  guardTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  guardDesc: {
    fontSize: responsiveFontSize(1.7),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  guardBtn: {
    marginTop: 16,
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: responsiveWidth(3.5),
    paddingHorizontal: responsiveWidth(8),
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  guardBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
});

export default AttendanceFaceScreen;
