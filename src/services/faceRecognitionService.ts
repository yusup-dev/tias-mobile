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
  timeout: 15000,
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

  async verify(subjectId: string, imageUri: string, threshold: number = 0.75): Promise<{ verified: boolean; similarity: number }> {
    try {
      const formData = new FormData();
      formData.append('subject_id', subjectId);
      formData.append('threshold', threshold.toString());
      formData.append('image', {
        uri: imageUri,
        name: 'verify.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/v1/faces/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { verified, similarity } = response.data;

      if (!verified) {
        throw new FaceServiceError('MATCH_FAILED', 'Wajah tidak cocok. Silakan coba lagi.');
      }

      return { verified, similarity };
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

      await api.post('/v1/faces/enroll', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

      if (!axiosError.response) {
        return new FaceServiceError('SERVICE_UNAVAILABLE', 'Layanan verifikasi wajah tidak tersedia. Periksa koneksi internet Anda.');
      }

      switch (status) {
        case 404:
          return new FaceServiceError('NOT_ENROLLED', 'Wajah Anda belum terdaftar di sistem. Hubungi admin.');
        case 400:
          if (data?.message?.includes('no face')) {
            return new FaceServiceError('FACE_NOT_DETECTED', 'Wajah tidak terdeteksi pada foto. Pastikan pencahayaan cukup.');
          }
          return new FaceServiceError('UNKNOWN', data?.message || 'Terjadi kesalahan pada permintaan.');
        case 422:
          return new FaceServiceError('VALIDATION_ERROR', 'Data yang dikirim tidak valid.');
        default:
          return new FaceServiceError('UNKNOWN', 'Terjadi kesalahan sistem yang tidak diketahui.');
      }
    }

    return new FaceServiceError('UNKNOWN', 'Terjadi kesalahan tak terduga.');
  },
};
