import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const { width } = Dimensions.get('window');

type FaceCaptureCameraProps = {
  onConfirm: (photoUri: string) => void;
  onCancel: () => void;
  /** Deteksi wajah otomatis lalu langsung ambil & kirim foto tanpa perlu tap tombol
   *  (dipakai untuk Login dengan Wajah). Default false: alur manual seperti Daftar Wajah. */
  autoCapture?: boolean;
  /** Saat true (mis. sedang menunggu hasil verifikasi dari server), deteksi otomatis
   *  dijeda supaya tidak kirim foto dobel. Cuma dipakai kalau autoCapture aktif. */
  isProcessing?: boolean;
};

const FaceCaptureCamera = ({
  onConfirm,
  onCancel,
  autoCapture = false,
  isProcessing = false,
}: FaceCaptureCameraProps) => {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const autoCaptureLockRef = useRef(false);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  // Selesai satu siklus verifikasi (sukses ataupun gagal) di layar pemanggil -> buka
  // kunci lagi supaya deteksi wajah otomatis bisa mencoba ulang tanpa perlu tap apa pun.
  useEffect(() => {
    if (autoCapture && !isProcessing) {
      autoCaptureLockRef.current = false;
      setCaptureProgress(0);
    }
  }, [autoCapture, isProcessing]);

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePhoto();
      setPhotoUri(`file://${photo.path}`);
    } finally {
      setCapturing(false);
    }
  };

  const handleAutoCapture = async () => {
    if (!cameraRef.current || autoCaptureLockRef.current) return;
    autoCaptureLockRef.current = true;
    try {
      const photo = await cameraRef.current.takePhoto();
      onConfirm(`file://${photo.path}`);
    } catch (e) {
      autoCaptureLockRef.current = false;
      setCaptureProgress(0);
    }
  };

  const { detectFaces } = useFaceDetector({
    performanceMode: 'fast',
    contourMode: 'none',
    landmarkMode: 'none',
  });

  const onFaceDetected = Worklets.createRunOnJS((faceCount: number) => {
    if (faceCount > 0) {
      if (!hasFace) setHasFace(true);
      if (!autoCaptureLockRef.current) {
        setCaptureProgress(prev => {
          if (prev >= 100) {
            handleAutoCapture();
            return 100;
          }
          return prev + 8;
        });
      }
    } else {
      if (hasFace) setHasFace(false);
      if (!autoCaptureLockRef.current) setCaptureProgress(0);
    }
  });

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (!autoCapture) return;
      const faces = detectFaces(frame);
      onFaceDetected(faces.length);
    },
    [autoCapture, detectFaces, onFaceDetected],
  );

  // --- Guard: Izin kamera ---
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.guardContainer}>
        <View style={styles.guardIconCircle}>
          <Icon name="camera-off" size={50} color="#EF4444" />
        </View>
        <Text style={styles.guardTitle}>Izin Kamera Dibutuhkan</Text>
        <Text style={styles.guardDesc}>
          Aplikasi membutuhkan izin kamera untuk mengambil foto wajah Anda.
        </Text>
        <TouchableOpacity style={styles.guardBtn} onPress={onCancel}>
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
        <View style={styles.guardIconCircle}>
          <Icon name="alert-circle-outline" size={50} color="#EF4444" />
        </View>
        <Text style={styles.guardTitle}>Kamera Tidak Ditemukan</Text>
        <Text style={styles.guardDesc}>
          Perangkat Anda tidak memiliki kamera depan yang tersedia.
        </Text>
        <TouchableOpacity style={styles.guardBtn} onPress={onCancel}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.guardBtnText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Preview hasil jepretan ---
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.previewOverlay} />
        <SafeAreaView style={styles.previewActions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPhotoUri(null)}>
            <Icon name="camera-retake" size={20} color="#FFFFFF" />
            <Text style={styles.secondaryBtnText}>Ambil Ulang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => onConfirm(photoUri)}>
            <Icon name="check-bold" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Gunakan Foto Ini</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // --- Kamera aktif ---
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        photoQualityBalance="speed"
        frameProcessor={autoCapture ? frameProcessor : undefined}
        pixelFormat={autoCapture ? 'yuv' : undefined}
      />

      <View style={styles.gradientOverlayTop} />
      <View style={styles.gradientOverlayBottom} />

      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
            <Icon name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {autoCapture ? 'Verifikasi Wajah' : 'Ambil Foto Wajah'}
          </Text>
          <View style={{ width: 38 }} />
        </View>
      </SafeAreaView>

      <View style={styles.ovalContainer}>
        <View
          style={[
            styles.ovalGuide,
            autoCapture && { borderStyle: 'solid', borderColor: hasFace ? '#4ADE80' : 'rgba(255,255,255,0.6)' },
          ]}>
          {autoCapture && hasFace && (
            <View style={[styles.autoProgressFill, { height: `${captureProgress}%` }]} />
          )}
        </View>
      </View>

      <View style={styles.bottomPanel}>
        {autoCapture ? (
          <>
            <Text style={styles.hintText}>
              {isProcessing
                ? 'Memverifikasi wajah...'
                : hasFace
                ? 'Tahan sebentar, jangan bergerak...'
                : 'Arahkan wajah Anda ke dalam bingkai'}
            </Text>
            {isProcessing && <View style={{ height: 4 }} />}
          </>
        ) : (
          <>
            <Text style={styles.hintText}>
              Posisikan wajah Anda di dalam bingkai, lalu ambil foto
            </Text>
            <TouchableOpacity
              style={[styles.captureBtn, capturing && styles.captureBtnDisabled]}
              onPress={takePhoto}
              disabled={capturing}
              activeOpacity={0.85}>
              <Icon name="camera" size={26} color="#FFFFFF" />
              <Text style={styles.captureBtnText}>
                {capturing ? 'Memproses...' : 'Ambil Foto'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradientOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  gradientOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
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
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
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
    borderColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  autoProgressFill: {
    width: '100%',
    backgroundColor: 'rgba(74, 222, 128, 0.35)',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveWidth(8),
    paddingTop: responsiveWidth(4),
    gap: 14,
  },
  hintText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: responsiveFontSize(1.6),
  },
  captureBtn: {
    flexDirection: 'row',
    backgroundColor: '#15613F',
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 6,
  },
  captureBtnDisabled: {
    backgroundColor: '#374151',
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveWidth(8),
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#15613F',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
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
  },
  guardBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
});

export default FaceCaptureCamera;
