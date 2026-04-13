import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

const AttendanceFaceScreen = (props: any) => {
  const token = props?.route?.params?.token ?? '';
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);

  // Setup Kamera
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  
  // State untuk UI deteksi wajah
  const [hasFace, setHasFace] = useState(false);

  // Setup Face Detector
  const { detectFaces } = useFaceDetector({
    performanceMode: 'fast',
    contourMode: 'none',
    landmarkMode: 'none', // Matikan landmark jika hanya butuh deteksi wajah umum agar lebih ringan
  });

  // Fungsi yang dipanggil dari Frame Processor ke UI Thread (React)
  const onFaceDetected = Worklets.createRunOnJS((faceCount: number) => {
    if (faceCount > 0 && !hasFace) {
      setHasFace(true);
      // TODO: Disini nanti kita taruh logika setTimeout untuk AUTO-CAPTURE
      // console.log("Wajah terdeteksi! Siap menjepret...");
    } else if (faceCount === 0 && hasFace) {
      setHasFace(false);
    }
  });

  // Frame Processor: Berjalan 60fps untuk memindai frame kamera
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const faces = detectFaces(frame);
    onFaceDetected(faces.length);
  }, [detectFaces, onFaceDetected]);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) return <ActivityIndicator size="large" color="#15613F" style={styles.centerContainer} />;
  if (device == null) return <Text style={styles.errorText}>Kamera depan tidak ditemukan</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor} // <--- Pasang Frame Processor di sini
        pixelFormat="yuv" // Format standar untuk analisis frame yang cepat
      />

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Kotak panduan: Hijau jika ada wajah, Merah jika kosong */}
        <View style={[styles.faceFrame, { borderColor: hasFace ? '#00FF00' : '#FF3B30' }]} />
        
        <Text style={[styles.instructionText, { backgroundColor: hasFace ? 'rgba(0,255,0,0.8)' : 'rgba(255,59,48,0.8)' }]}>
          {hasFace ? 'Wajah Terdeteksi. Tahan posisi...' : 'Arahkan wajah Anda ke dalam kotak'}
        </Text>
      </View>

      <View style={styles.tokenContainer}>
        <Text style={styles.tokenText}>Token: {token}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 350,
    borderWidth: 4,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
  },
  tokenContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 8,
  },
  tokenText: { color: 'black', fontWeight: 'bold' },
});

export default AttendanceFaceScreen;