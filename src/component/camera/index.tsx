import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface Props {
  onScanSuccess: (token: string) => void;
  fullScreen?: boolean; // jika true, kamera mengisi flex:1 dari parent
}

const CameraScanBarcode = ({ onScanSuccess, fullScreen = true }: Props) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const isScanning = useRef(false);

  useEffect(() => {
    if (!isFocused) {
      isScanning.current = false;
    }
  }, [isFocused]);

  const handleCodeScanned = useCallback((codes: any[]) => {
    if (isScanning.current) return;
    if (codes.length > 0 && codes[0].value) {
      isScanning.current = true;
      onScanSuccess(codes[0].value);
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
        <ActivityIndicator size="large" color="#15613F" />
        <Text style={styles.loadingText}>Menyiapkan Kamera...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Kamera belakang tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      {/* Kamera mengisi seluruh area */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      {/* Overlay gelap di luar area scan */}
      <View style={styles.overlayTop} />
      <View style={styles.overlayBottom} />
      <View style={styles.overlaySideLeft} />
      <View style={styles.overlaySideRight} />

      {/* Scan box di tengah */}
      <View style={styles.scanBox}>
        {/* Corner guides */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {/* Scan line animasi */}
        <View style={styles.scanLine} />
      </View>

      {/* Label bawah */}
      <View style={styles.labelContainer}>
        <Text style={styles.instruction}>Posisikan QR Code di dalam kotak</Text>
      </View>
    </View>
  );
};

const SCAN_BOX = width * 0.68;
const SCAN_BOX_TOP = (height * 0.55 - SCAN_BOX) / 2; // posisi vertikal scan box

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    position: 'relative',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    fontWeight: '500',
  },

  // Overlay gelap di sisi-sisi luar scan box
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCAN_BOX_TOP,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayBottom: {
    position: 'absolute',
    top: SCAN_BOX_TOP + SCAN_BOX,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlaySideLeft: {
    position: 'absolute',
    top: SCAN_BOX_TOP,
    left: 0,
    width: (width - SCAN_BOX) / 2,
    height: SCAN_BOX,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlaySideRight: {
    position: 'absolute',
    top: SCAN_BOX_TOP,
    right: 0,
    width: (width - SCAN_BOX) / 2,
    height: SCAN_BOX,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  // Kotak scan area
  scanBox: {
    position: 'absolute',
    top: SCAN_BOX_TOP,
    left: (width - SCAN_BOX) / 2,
    width: SCAN_BOX,
    height: SCAN_BOX,
  },

  // Corner guides
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#4ADE80',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 6,
  },

  // Scan line
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#4ADE80',
    opacity: 0.8,
    borderRadius: 1,
  },

  // Label
  labelContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instruction: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default CameraScanBarcode;