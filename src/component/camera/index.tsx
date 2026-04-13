import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

// Mengambil ukuran layar untuk membuat scanner yang proporsional
const { width } = Dimensions.get('window');
const SCAN_BOX_SIZE = width * 0.75; // Ukuran kotak kamera 75% dari lebar layar HP

const CameraScanBarcode = ({ onScanSuccess }: { onScanSuccess: (token: string) => void }) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();

  // Lock agar scan tidak dipanggil berulang kali
  const isScanning = useRef(false);

  // Reset lock ketika layar kehilangan fokus (navigasi ke halaman lain)
  useEffect(() => {
    if (!isFocused) {
      isScanning.current = false;
    }
  }, [isFocused]);

  const handleCodeScanned = useCallback((codes: any[]) => {
    // Jika sudah dalam proses scan, abaikan scan berikutnya
    if (isScanning.current) {
      return;
    }

    if (codes.length > 0 && codes[0].value) {
      isScanning.current = true; // Kunci agar tidak scan lagi
      onScanSuccess(codes[0].value);

      // Buka kunci setelah 3 detik untuk memungkinkan scan ulang jika diperlukan
      setTimeout(() => {
        isScanning.current = false;
      }, 3000);
    }
  }, [onScanSuccess]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: handleCodeScanned,
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6B4CE6" />
        <Text style={styles.loadingText}>Menyiapkan Kamera...</Text>
      </View>
    );
  }

  if (device == null) {
    return <Text style={styles.errorText}>Kamera belakang tidak ditemukan</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Kotak Kamera */}
      <View style={styles.cameraWrapper}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          device={device}
          isActive={isFocused}
          codeScanner={codeScanner}
        />
        
        {/* Sudut Estetika Pembidik (Warna ungu menyesuaikan tema tombolmu) */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      
      {/* Teks Instruksi Opsional */}
      <Text style={styles.instruction}>Posisikan QR Code di dalam area kamera</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent', // Agar menyatu dengan background abu-abu halamanmu
  },
  center: {
    height: SCAN_BOX_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  cameraWrapper: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderRadius: 20, // Bikin ujung kamera jadi melengkung elegan
    overflow: 'hidden',
    backgroundColor: '#E5E5EA', // Warna loading sebelum kamera terbuka
    position: 'relative',
    elevation: 5, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  instruction: {
    marginTop: 15,
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  // Style untuk sudut pembidik
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#6B4CE6', // Warna ungu senada dengan tombol
  },
  topLeft: { top: 15, left: 15, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: 15, right: 15, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 15, left: 15, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 15, right: 15, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
});

export default CameraScanBarcode;