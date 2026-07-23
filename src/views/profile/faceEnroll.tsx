import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation } from '@tanstack/react-query';
import { faceRecognitionService } from '../../services/faceRecognitionService';
import { useTokenStore } from '../../store/auth';
import FaceCaptureCamera from '../../component/faceCapture/FaceCaptureCamera';

const FaceEnrollScreen = (props: any) => {
  const { user } = useTokenStore();

  const { mutate, isLoading } = useMutation({
    mutationFn: (photoUri: string) =>
      faceRecognitionService.enroll(user?.npm || '', photoUri),
    onSuccess: () => {
      Alert.alert('Berhasil', 'Wajah berhasil didaftarkan.', [
        { text: 'OK', onPress: () => props.navigation.goBack() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Gagal', error?.message || 'Gagal mendaftarkan wajah.');
    },
  });

  if (!user?.npm) {
    return (
      <View style={styles.guardContainer}>
        <Icon name="alert-circle-outline" size={50} color="#EF4444" />
        <Text style={styles.guardTitle}>NPM Tidak Ditemukan</Text>
        <Text style={styles.guardDesc}>
          Data NPM Anda tidak ditemukan. Silakan login kembali.
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
    <FaceCaptureCamera
      onConfirm={(uri) => mutate(uri)}
      onCancel={() => props.navigation.goBack()}
    />
  );
};

const styles = StyleSheet.create({
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
