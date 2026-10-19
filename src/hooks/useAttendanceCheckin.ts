import {useState} from 'react';
import {useSecureLocation} from './useSecureLocation';
import {absensi} from '../services/absen/index';
import {useTokenStore} from '../store/auth';

// Versi tanpa-kamera dari useAttendanceFace.ts -- dipakai saat dosen generate
// presensi dgn FR off (lihat utils/attendanceNavigation.ts). Langkah sama persis
// spt bagian location+submit di useAttendanceFace, cuma tanpa capture/verify foto.
export type CheckinStep =
  | 'ready'
  | 'getting_location'
  | 'submitting'
  | 'success'
  | 'error';

export type AttendanceCheckinParams = {
  token: string;
};

export const useAttendanceCheckin = (params: AttendanceCheckinParams) => {
  const [step, setStep] = useState<CheckinStep>('ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {getPosition} = useSecureLocation();

  const submitCheckin = async () => {
    if (step !== 'ready' && step !== 'error') return;

    setErrorMessage(null);
    try {
      setStep('getting_location');
      const location = await getPosition();

      setStep('submitting');

      const user = useTokenStore.getState().user;
      if (!user || !user.npm) {
        throw new Error('Data user (NPM) tidak ditemukan. Silakan login kembali.');
      }

      const response = await absensi({
        token: params.token,
        coordinate: `${location.latitude},${location.longitude}`,
        npm: user.npm,
        status_absen: '1', // Default hadir (hardcode) -- konsisten dgn useAttendanceFace.
      });

      if (response.message && response.message !== 'success' && response.message !== 'Anda sudah melakukan absen') {
        throw new Error(response.message);
      }

      setStep('success');
    } catch (error: any) {
      setStep('error');
      setErrorMessage(error.message || 'Terjadi kesalahan saat memproses absensi.');
      console.error('Attendance Checkin Error:', error);
    }
  };

  const retry = () => {
    setErrorMessage(null);
    setStep('ready');
  };

  return {
    step,
    errorMessage,
    submitCheckin,
    retry,
  };
};
