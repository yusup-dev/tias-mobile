import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { faceRecognitionService, getFaceSubjectId } from '../../services/faceRecognitionService';
import { useTokenStore } from '../../store/auth';
import FaceCaptureCamera from '../../component/faceCapture/FaceCaptureCamera';

const POSES = [
  { label: 'Hadap lurus ke kamera', hint: 'Pose 1 dari 3' },
  { label: 'Putar wajah sedikit ke kiri', hint: 'Pose 2 dari 3' },
  { label: 'Putar wajah sedikit ke kanan', hint: 'Pose 3 dari 3' },
];

const FaceEnrollScreen = (props: any) => {
  const { user } = useTokenStore();
  const subjectId = getFaceSubjectId(user);
  const [photos, setPhotos] = useState<string[]>([]);

  const { data: faceStatus, isLoading: loadingStatus } = useQuery({
    queryKey: ['face-status'],
    queryFn: () => faceRecognitionService.status(),
    enabled: !!subjectId,
    retry: false,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (uris: string[]) => faceRecognitionService.enroll(uris),
    onSuccess: (st) => {
      Alert.alert(
        'Berhasil',
        st?.status === 'pending'
          ? 'Wajah terdaftar dan menunggu persetujuan admin.'
          : 'Wajah berhasil didaftarkan.',
        [{ text: 'OK', onPress: () => props.navigation.goBack() }],
      );
    },
    onError: (error: any) => {
      setPhotos([]);
      Alert.alert('Gagal', error?.message || 'Gagal mendaftarkan wajah.');
    },
  });

  // Semua pose terkumpul -> kirim ke server UCL (server yang menentukan identitas & memverifikasi).
  useEffect(() => {
    if (photos.length === POSES.length && !isLoading) mutate(photos);
  }, [photos]);

  if (!subjectId) {
    return (
      <View style={styles.guardContainer}>
        <Icon name="alert-circle-outline" size={50} color="#EF4444" />
        <Text style={styles.guardTitle}>Identitas Tidak Ditemukan</Text>
        <Text style={styles.guardDesc}>
          Data NPM/NIP Anda tidak ditemukan. Silakan login kembali.
        </Text>
        <TouchableOpacity style={styles.guardBtn} onPress={() => props.navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.guardBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loadingStatus) {
    return (
      <View style={styles.guardContainer}>
        <Icon name="face-recognition" size={50} color="#15613F" />
        <Text style={styles.guardTitle}>Memeriksa Status Wajah...</Text>
      </View>
    );
  }

  if (faceStatus && faceStatus.status !== 'none' && faceStatus.status !== 'revoked') {
    return (
      <View style={styles.guardContainer}>
        <Icon name="check-decagram" size={50} color="#15613F" />
        <Text style={styles.guardTitle}>
          {faceStatus.status === 'pending' ? 'Menunggu Persetujuan' : 'Wajah Sudah Terdaftar'}
        </Text>
        <Text style={styles.guardDesc}>
          {faceStatus.status === 'pending'
            ? 'Pendaftaran wajah Anda menunggu persetujuan admin.'
            : 'Untuk mendaftar ulang, minta admin mereset pendaftaran wajah Anda.'}
        </Text>
        <TouchableOpacity style={styles.guardBtn} onPress={() => props.navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.guardBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.guardContainer}>
        <Icon name="face-recognition" size={50} color="#15613F" />
        <Text style={styles.guardTitle}>Mendaftarkan Wajah...</Text>
        <Text style={styles.guardDesc}>Mohon tunggu sebentar.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FaceCaptureCamera
        key={photos.length}
        onConfirm={(uri) => setPhotos((prev) => [...prev, uri])}
        onCancel={() => props.navigation.goBack()}
      />
      <View style={styles.poseBanner} pointerEvents="none">
        <Text style={styles.poseHint}>{POSES[Math.min(photos.length, POSES.length - 1)].hint}</Text>
        <Text style={styles.poseLabel}>{POSES[Math.min(photos.length, POSES.length - 1)].label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  poseBanner: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  poseHint: { color: '#A7F3D0', fontSize: responsiveFontSize(1.5), fontWeight: '600' },
  poseLabel: { color: '#FFFFFF', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: 2 },
  guardContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(10),
    gap: 16,
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

export default FaceEnrollScreen;
