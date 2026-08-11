import axios from 'axios';

export type AttendancePayload = {
  token: string;
  meetingId: string;
  latitude: number;
  longitude: number;
  locationAccuracy: number;
  locationSource: 'gps' | 'network';
  faceVerified: boolean;
  faceSimilarity: number;
};

const UCL_API_URL = 'https://ucl.uika-bogor.ac.id/staging';

export const attendanceService = {
  async submit(payload: AttendancePayload, authToken: string): Promise<any> {
    try {
      const response = await axios.post(`${UCL_API_URL}/api/attendance/submit`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Gagal mengirim data absensi ke server.');
      }
      throw new Error('Terjadi kesalahan saat menghubungi server absensi.');
    }
  },
};
