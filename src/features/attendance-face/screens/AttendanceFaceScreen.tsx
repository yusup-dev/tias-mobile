import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import { useMutation } from '@tanstack/react-query';
import { faceVerify, faceEnroll } from '../services/attendanceFace.service';
import { useTokenStore } from '../../../store/auth';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

const AttendanceFaceScreen = (props: any) => {
  const { 
    token = '', 
    matkul = 'Mata Kuliah', 
    dosen = 'Dosen', 
    pertemuan = '?', 
    kelas = '-' 
  } = props?.route?.params ?? {};
  
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const { user } = useTokenStore();

  const [hasFace, setHasFace] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  // Ref agar camera TIDAK ditutup saat takePhoto() sedang jalan
  const isCapturingRef = useRef(false);
  
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  
  const { detectFaces } = useFaceDetector({
    performanceMode: 'fast',
    contourMode: 'none',
    landmarkMode: 'none',
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: ([npm, imageUri]: [string, string]) => faceVerify(npm, imageUri),
    onSuccess: (data) => {
      if (data.verified) {
        Alert.alert('Berhasil', `Wajah terverifikasi. Absensi untuk ${matkul} berhasil dicatat.`, [
          { text: 'Selesai', onPress: () => props.navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('Gagal Verifikasi', data.message || 'Wajah tidak cocok, silakan coba lagi.', [
          { text: 'Coba Lagi', onPress: () => {
            setIsCapturing(false);
            setCaptureProgress(0);
          }}
        ]);
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.message || 'Terjadi kesalahan sistem.');
      setIsCapturing(false);
      setCaptureProgress(0);
    }
  });

  const getLatLon = () => {
    return new Promise<{lat: number; long: number}>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, long: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  // ⚠️ DEV ONLY: Enroll wajah ke server tanpa perlu flow normal
  const handleEnroll = async () => {
    if (!cameraRef.current || isEnrolling) return;
    setIsEnrolling(true);
    try {
      console.log('[DEV] Mengambil foto untuk enroll...');
      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      const imageUri = `file://${photo.path}`;
      console.log('[DEV] Foto enroll berhasil:', imageUri);
      await faceEnroll(user?.npm || '', imageUri);
      Alert.alert(
        '✅ Enroll Berhasil',
        `Wajah npm ${user?.npm} berhasil didaftarkan. Sekarang coba verifikasi.`,
      );
    } catch (e: any) {
      console.error('[DEV] Enroll error:', e?.message || e);
      Alert.alert('❌ Enroll Gagal', e?.message || 'Terjadi kesalahan saat enroll.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCapture = async () => {
    // Gunakan ref sebagai guard agar tidak double-capture
    if (isCapturingRef.current || !cameraRef.current) return;
    isCapturingRef.current = true;
    setIsCapturing(true);

    try {
      // 1. Ambil Lokasi
      const loc = await getLatLon().catch(() => ({ lat: 0, long: 0 }));
      console.log('[FACE] Lokasi:', loc);

      // 2. Ambil Foto - kamera HARUS masih aktif di sini (isActive tidak bergantung isCapturing)
      console.log('[FACE] Mengambil foto...');
      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      console.log('[FACE] Foto berhasil:', photo.path);

      // 3. Kirim path file ke backend
      const imageBase64 = `file://${photo.path}`;

      // 4. Kirim ke Backend — format baru: (npm, imageUri)
      mutate([user?.npm || '', imageBase64]);

    } catch (e: any) {
      console.error('[FACE] Capture error:', e?.message || e);
      isCapturingRef.current = false;
      setIsCapturing(false);
      setCaptureProgress(0);
    }
  };

  const onFaceDetected = Worklets.createRunOnJS((faceCount: number) => {
    if (faceCount > 0) {
      if (!hasFace) setHasFace(true);
      
      if (!isCapturing && !isLoading) {
        setCaptureProgress(prev => {
          if (prev >= 100) {
            handleCapture();
            return 100;
          }
          return prev + 5; 
        });
      }
    } else {
      if (hasFace) setHasFace(false);
      if (!isCapturing) setCaptureProgress(0);
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const faces = detectFaces(frame);
    onFaceDetected(faces.length);
  }, [detectFaces, onFaceDetected]);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#15613F" />
      <Text style={{marginTop: 10}}>Meminta izin kamera...</Text>
    </View>
  );

  if (device == null) return <Text style={styles.errorText}>Kamera depan tidak ditemukan</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}  // Tetap aktif saat capture agar takePhoto() bisa jalan
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
        photo={true}
      />

      {/* Meeting Info Card (Top) */}
      <View style={styles.infoCard}>
        <Text style={styles.infoMatkul}>{matkul}</Text>
        <Text style={styles.infoDosen}>{dosen}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>P{pertemuan}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Kelas {kelas}</Text>
          </View>
        </View>
      </View>

      {/* Area Deteksi Wajah (Overlay) */}
      <View style={styles.overlay}>
        <View style={[
          styles.faceFrame, 
          { borderColor: hasFace ? '#4ADE80' : '#F87171' }
        ]}>
          {hasFace && !isCapturing && (
             <View style={[styles.progressLine, { width: `${captureProgress}%` }]} />
          )}
        </View>
        
        <View style={styles.instructionBox}>
          {isLoading || isCapturing ? (
            <>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.instructionText}>Sedang memverifikasi wajah...</Text>
            </>
          ) : (
            <>
              <Icon 
                name={hasFace ? "face-recognition" : "face-man-profile"} 
                size={30} 
                color="#FFF" 
              />
              <Text style={styles.instructionText}>
                {hasFace ? 'Wajah Terdeteksi. Tahan sebentar...' : 'Arahkan wajah Anda ke dalam kotak'}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Header Custom */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi Wajah</Text>
        <View style={{width: 28}} />
      </View>

      <View style={styles.footer}>
        <View style={styles.tokenBadge}>
          <Text style={styles.tokenLabel}>TOKEN AKTIF</Text>
          <Text style={styles.tokenValue}>{token}</Text>
        </View>

        {/* ⚠️ DEV ONLY: Tombol enroll wajah */}
        {__DEV__ && (
          <TouchableOpacity
            onPress={handleEnroll}
            disabled={isEnrolling}
            style={{
              marginTop: 12,
              backgroundColor: isEnrolling ? '#9CA3AF' : '#F59E0B',
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#D97706',
            }}>
            <Text style={{ color: '#1C1917', fontWeight: 'bold', fontSize: 13 }}>
              {isEnrolling ? '⏳ Mendaftarkan Wajah...' : '📸 DEV: Enroll Wajah Saya'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 50 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: responsiveHeight(6),
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: { padding: 5 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: responsiveWidth(70),
    height: responsiveWidth(90),
    borderWidth: 3,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  progressLine: {
    height: 6,
    backgroundColor: '#4ADE80',
  },
  instructionBox: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  instructionText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tokenBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  tokenLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold' },
  tokenValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  infoCard: {
    position: 'absolute',
    top: responsiveHeight(15),
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 15,
    zIndex: 10,
    elevation: 5,
  },
  infoMatkul: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoDosen: {
    fontSize: responsiveFontSize(1.6),
    color: '#4B5563',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  infoBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoBadgeText: {
    fontSize: responsiveFontSize(1.4),
    color: '#15613F',
    fontWeight: 'bold',
  },
});

export default AttendanceFaceScreen;
