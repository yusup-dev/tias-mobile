import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FaceCaptureCamera from '../component/faceCapture/FaceCaptureCamera';
import { loginWithFace } from '../services/auth/index';
import { useTokenStore } from '../store/auth';

const FaceLoginVerificationScreen = (props: any) => {
  const { rememberMe } = props.route?.params || {};

  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setAuthentication, setToken, setUser, setRememberMe: storeSetRememberMe } =
    useTokenStore();

  const handleConfirmPhoto = async (photoUri: string) => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const result = await loginWithFace(photoUri);
      const token = result?.data?.token;

      if (token) {
        setUser({ ...result?.data, role: result?.data?.role || 'Mahasiswa' });
        setToken(token);
        storeSetRememberMe(Boolean(rememberMe));
        setAuthentication(true);
      } else {
        setErrorMessage(result?.message || 'Verifikasi wajah gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      const data = err?.response?.data;
      const msg = data?.message || err?.message || 'Gagal memverifikasi wajah.';
      setErrorMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <FaceCaptureCamera
        onConfirm={handleConfirmPhoto}
        onCancel={() => props.navigation.goBack()}
        autoCapture
        isProcessing={isVerifying}
      />

      {/* Info Card Header */}
      <SafeAreaView style={styles.headerInfoOverlay}>
        <View style={styles.headerCard}>
          <Icon name="face-recognition" size={24} color="#15613F" />
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Login dengan Wajah</Text>
            <Text style={styles.headerSub}>Arahkan wajah Anda ke kamera</Text>
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

      {/* Back to password login */}
      <View style={styles.bottomBypassContainer}>
        <TouchableOpacity style={styles.bypassBtn} onPress={() => props.navigation.goBack()}>
          <Text style={styles.bypassBtnText}>Kembali ke Login Password</Text>
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
