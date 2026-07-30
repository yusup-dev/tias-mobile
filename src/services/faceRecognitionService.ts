import axios, { AxiosError } from 'axios';

export type FaceServiceErrorCode =
  | 'SERVICE_UNAVAILABLE'
  | 'NOT_ENROLLED'
  | 'FACE_NOT_DETECTED'
  | 'MATCH_FAILED'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

export class FaceServiceError extends Error {
  code: FaceServiceErrorCode;

  constructor(code: FaceServiceErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'FaceServiceError';
  }
}

const FACE_API_URL = 'https://u-talent.uika-bogor.ac.id/face-api';
const FACE_API_KEY = 'face-fts-absen';

const api = axios.create({
  baseURL: FACE_API_URL,
  headers: {
    'X-API-Key': FACE_API_KEY,
  },
  timeout: 20000,
});

export const faceRecognitionService = {
  async isEnrolled(subjectId: string): Promise<boolean> {
    try {
      await api.get(`/v1/faces/subjects/${subjectId}`);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      // If service is down, we don't throw NOT_ENROLLED, we let the hook handle it
      throw this.handleError(error);
    }
  },

  async verify(subjectId: string, imageUri: string, threshold?: number): Promise<{ verified: boolean; similarity: number }> {
    try {
      const formData = new FormData();
      formData.append('subject_id', subjectId);
      if (threshold !== undefined) {
        formData.append('threshold', threshold.toString());
      }
      formData.append('image', {
        uri: imageUri,
        name: 'verify.jpg',
        type: 'image/jpeg',
      } as any);

      console.log('[FACE-API] >> POST /v1/faces/verify subject_id:', subjectId);

      const response = await api.post('/v1/faces/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[FACE-API] << verify response:', JSON.stringify(response.data).substring(0, 300));

      // Server merespons { subject_id, score, threshold, match } — bukan { verified, similarity }
      const { match, score } = response.data;

      if (!match) {
        throw new FaceServiceError('MATCH_FAILED', 'Wajah tidak cocok. Silakan coba lagi.');
      }

      return { verified: match, similarity: score };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async enroll(subjectId: string, imageUri: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('subject_id', subjectId);
      formData.append('image', {
        uri: imageUri,
        name: 'enroll.jpg',
        type: 'image/jpeg',
      } as any);

      console.log('[FACE-API] >> POST /v1/faces/enroll subject_id:', subjectId);

      const response = await api.post('/v1/faces/enroll', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[FACE-API] << enroll response:', response.status, JSON.stringify(response.data).substring(0, 300));
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error: unknown): FaceServiceError {
    if (error instanceof FaceServiceError) return error;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      console.log('[FACE-API] error code:', axiosError.code, 'status:', status, 'data:', JSON.stringify(data));

      if (!axiosError.response) {
        if (axiosError.code === 'ECONNABORTED') {
          return new FaceServiceError('SERVICE_UNAVAILABLE', 'Upload foto terlalu lama (koneksi lambat). Coba lagi di jaringan yang lebih stabil.');
        }
        return new FaceServiceError('SERVICE_UNAVAILABLE', 'Layanan verifikasi wajah tidak tersedia. Periksa koneksi internet Anda.');
      }

      const serverMessage: string | undefined = data?.message || data?.error || data?.detail;

      switch (status) {
        case 404:
          return new FaceServiceError('NOT_ENROLLED', 'Wajah Anda belum terdaftar di sistem. Hubungi admin.');
        case 400:
          if (serverMessage?.toLowerCase().includes('no face')) {
            return new FaceServiceError('FACE_NOT_DETECTED', 'Wajah tidak terdeteksi pada foto. Pastikan pencahayaan cukup.');
          }
          return new FaceServiceError('UNKNOWN', serverMessage || 'Terjadi kesalahan pada permintaan.');
        case 422:
          return new FaceServiceError('VALIDATION_ERROR', serverMessage || 'Data yang dikirim tidak valid.');
        default:
          return new FaceServiceError('UNKNOWN', serverMessage || 'Terjadi kesalahan sistem yang tidak diketahui.');
      }
    }

    return new FaceServiceError('UNKNOWN', 'Terjadi kesalahan tak terduga.');
  },
};
