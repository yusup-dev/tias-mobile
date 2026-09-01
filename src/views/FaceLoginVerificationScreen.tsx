import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FaceCaptureCamera from '../component/faceCapture/FaceCaptureCamera';
import { faceRecognitionService } from '../services/faceRecognitionService';
import { useTokenStore } from '../store/auth';

const FaceLoginVerificationScreen = (props: any) => {
  const { pendingUserData, token, rememberMe } = props.route?.params || {};
  const subjectId =
    pendingUserData?.npm ||
    pendingUserData?.nidn ||
    pendingUserData?.nip ||
    pendingUserData?.email ||
    pendingUserData?.id ||
    'USER';

  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setAuthentication, setToken, setUser, setRememberMe: storeSetRememberMe } =
    useTokenStore();

  const handleCompleteLogin = () => {
    setUser(pendingUserData);
    setToken(token);
    storeSetRememberMe(Boolean(rememberMe));
    setAuthentication(true);
  };

  const handleConfirmPhoto = async (photoUri: string) => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      console.log('[FACE-LOGIN] Verifying subject:', subjectId, 'uri:', photoUri);
      const result = await faceRecognitionService.verify(subjectId, photoUri);

      if (result.verified) {
        Alert.alert(
          'Verifikasi Berhasil',
          `Selamat datang, ${pendingUserData?.nama_lengkap || pendingUserData?.name || 'Pengguna'}!`,
          [
            {
              text: 'Lanjutkan',
              onPress: () => {
                handleCompleteLogin();
              },
            },
          ]
        );
      } else {
        setErrorMessage('Wajah tidak cocok. Pastikan wajah Anda terlihat jelas dan pencahayaan cukup.');
      }
    } catch (err: any) {
      console.log('[FACE-LOGIN] Error verification:', err);
      const msg = err?.message || 'Gagal memverifikasi wajah.';
      
      // Jika wajah belum di-enroll di server atau service error, beri opsi lanjutkan
      if (err?.code === 'NOT_ENROLLED' || err?.code === 'SERVICE_UNAVAILABLE') {
        Alert.alert(
          'Informasi Biometrik',
          msg + '\n\nApakah Anda ingin melanjutkan login?',
          [
            {
              text: 'Batal',
              style: 'cancel',
            },
            {
              text: 'Lanjut Masuk',
              onPress: () => {
                handleCompleteLogin();
              },
            },
          ]
        );
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBypass = () => {
    Alert.alert(
      'Lewati Verifikasi Wajah',
      'Apakah Anda yakin ingin masuk tanpa verifikasi biometrik wajah?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Masuk',
          onPress: () => {
            handleCompleteLogin();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FaceCaptureCamera
        onConfirm={handleConfirmPhoto}
        onCancel={() => props.navigation.goBack()}
      />

      {/* Info Card Header */}
      <SafeAreaView style={styles.headerInfoOverlay}>
        <View style={styles.headerCard}>
          <Icon name="face-recognition" size={24} color="#15613F" />
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Verifikasi Wajah Login</Text>
            <Text style={styles.headerSub}>
              {pendingUserData?.nama_lengkap || pendingUserData?.email} ({subjectId})
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Error Message Toast */}
      {errorMessage && (
        <View style={styles.errorToast}>
          <Icon name="alert-circle" size={20} color="#EF4444" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Bypass Action Button at Bottom */}
      <View style={styles.bottomBypassContainer}>
        <TouchableOpacity style={styles.bypassBtn} onPress={handleBypass}>
          <Text style={styles.bypassBtnText}>Lewati Verifikasi Wajah</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      {isVerifying && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#15613F" />
            <Text style={styles.loadingTitle}>Memverifikasi Wajah...</Text>
            <Text style={styles.loadingDesc}>Mencocokkan biometrik wajah dengan data server UIKA</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerInfoOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: '100%',
  },
  headerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSub: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    marginTop: 2,
  },
  errorToast: {
    position: 'absolute',
    top: 130,
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    zIndex: 10,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: responsiveFontSize(1.35),
    color: '#991B1B',
    fontWeight: '500',
  },
  bottomBypassContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bypassBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  bypassBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: responsiveWidth(80),
  },
  loadingTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 14,
  },
  loadingDesc: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

export default FaceLoginVerificationScreen;
