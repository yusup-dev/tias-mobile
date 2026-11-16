import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera } from 'react-native-vision-camera';
import { faceRecognitionService, FaceServiceError } from '../services/faceRecognitionService';
import { useSecureLocation } from './useSecureLocation';
import { absensi } from '../services/absen/index';
import { useTokenStore } from '../store/auth';
export type AttendanceStep =
  | 'checking_enrollment'
  | 'not_enrolled'
  | 'ready'
  | 'capturing'
  | 'verifying'
  | 'getting_location'
  | 'submitting'
  | 'success'
  | 'error';

export type AttendanceFaceParams = {
  subjectId: string;
  token: string;
  meetingId: string;
  authToken: string;
};

export const useAttendanceFace = (params: AttendanceFaceParams) => {
  const [step, setStep] = useState<AttendanceStep>('checking_enrollment');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ similarity: number } | null>(null);
  
  const cameraRef = useRef<Camera>(null);
  const { getPosition } = useSecureLocation();

  const checkEnrollment = useCallback(async () => {
    try {
      setStep('checking_enrollment');
      const enrolled = await faceRecognitionService.isEnrolled();
      if (enrolled) {
        setStep('ready');
      } else {
        setStep('not_enrolled');
      }
    } catch (error) {
      // Server wajah tidak terjangkau: tetap ke 'ready' — verifikasi akan ditolak (fail-closed) bila masih bermasalah.
      console.warn('Cek status wajah gagal, lanjut ke ready:', error);
      setStep('ready');
    }
  }, [params.subjectId]);

  useEffect(() => {
    checkEnrollment();
  }, [checkEnrollment]);

  const startVerification = async () => {
    if (step !== 'ready' && step !== 'error') return;
    
    setErrorMessage(null);
    let faceTicketRef = '';
    try {
      // 1. Ambil 2 foto berurutan (frame berbeda; server menolak foto identik / kurang dari minimum)
      setStep('capturing');
      if (!cameraRef.current) throw new Error('Kamera tidak siap.');

      const first = await cameraRef.current.takePhoto({ flash: 'off' });
      await new Promise(resolve => setTimeout(resolve, 700));
      const second = await cameraRef.current.takePhoto({ flash: 'off' });

      // 2. Verifikasi di server UCL -> tiket FT1 (terikat akun ini + pertemuan ini, sekali pakai)
      setStep('verifying');
      const { verified, similarity, ticket } = await faceRecognitionService.verify(
        [`file://${first.path}`, `file://${second.path}`],
        { ref: params.meetingId, purpose: 'presensi' },
      );

      if (!verified || !ticket) {
        throw new Error('Verifikasi wajah gagal. Pastikan ini adalah wajah Anda.');
      }

      setVerifyResult({ similarity });
      faceTicketRef = ticket;

      // 3. Get Secure Location (after face match to optimize)
      setStep('getting_location');
      const location = await getPosition();

      // 4. Submit Attendance
      setStep('submitting');
      
      const user = useTokenStore.getState().user;
      if (!user || !user.npm) {
        throw new Error('Data user (NPM) tidak ditemukan. Silakan login kembali.');
      }

      const response = await absensi({
        token: params.token,
        coordinate: `${location.latitude},${location.longitude}`,
        npm: user.npm,
        status_absen: '1', // Default hadir (server tetap menentukan statusnya sendiri)
        face_ticket: faceTicketRef,
      });

      // Tangkap pesan error dari respons Laravel
      if (response.message && response.message !== 'success' && response.message !== 'Anda sudah melakukan absen') {
        throw new Error(response.message);
      }

      setStep('success');
    } catch (error: any) {
      setStep('error');
      if (error instanceof FaceServiceError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(error.message || 'Terjadi kesalahan saat memproses absensi.');
      }
      console.error('Attendance Flow Error:', error);
    }
  };

  const retry = () => {
    setErrorMessage(null);
    setStep('ready');
  };

  return {
    step,
    errorMessage,
    verifyResult,
    cameraRef,
    startVerification,
    retry,
  };
};
