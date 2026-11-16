import axios from '../config/axios-tias';
import { useTokenStore } from '../store/auth';

/**
 * Face recognition UCL Mobile — SEMUA lewat server UCL (`/face/*`). Aplikasi tidak lagi memegang
 * URL/kunci face API; subject_id diturunkan server dari akun login (tidak bisa didaftarkan untuk
 * NPM/NIP orang lain). Verifikasi berhasil menghasilkan tiket FT1 yang dikirim saat scan presensi.
 */

export type FaceServiceErrorCode =
  | 'SERVICE_UNAVAILABLE'
  | 'NOT_ENROLLED'
  | 'ALREADY_ENROLLED'
  | 'PENDING_APPROVAL'
  | 'LOCKED'
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

export type FaceStatus = {
  enrolled: boolean;
  status: 'none' | 'pending' | 'active' | 'revoked';
  enroll_count?: number;
  last_verified_at?: string | null;
  require_approval?: boolean;
  min_frames?: number;
  enroll_min_images?: number;
};

// Identitas untuk pengecekan UI saja (server menurunkan subject_id sendiri).
export function getFaceSubjectId(user: any): string {
  return user?.npm || user?.nip || user?.nidn || (user?.user_id ? String(user.user_id) : '') || '';
}

const CODE_MAP: Record<string, FaceServiceErrorCode> = {
  NO_FACE: 'FACE_NOT_DETECTED',
  MISMATCH: 'MATCH_FAILED',
  POSE_MISMATCH: 'MATCH_FAILED',
  NOT_ENROLLED: 'NOT_ENROLLED',
  ALREADY_ENROLLED: 'ALREADY_ENROLLED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  LOCKED: 'LOCKED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TOO_FEW_IMAGES: 'VALIDATION_ERROR',
  DUPLICATE_FRAMES: 'VALIDATION_ERROR',
  BAD_IMAGE: 'VALIDATION_ERROR',
};

const authHeaders = () => ({ token: useTokenStore.getState().token });

function toError(res: any): FaceServiceError {
  const d = res?.data || {};
  return new FaceServiceError(CODE_MAP[d.code] || 'UNKNOWN', d.responseMessage || d.message || 'Terjadi kesalahan pada verifikasi wajah.');
}

function networkError(error: any): FaceServiceError {
  if (error instanceof FaceServiceError) return error;
  if (error?.code === 'ECONNABORTED') {
    return new FaceServiceError('SERVICE_UNAVAILABLE', 'Upload foto terlalu lama (koneksi lambat). Coba lagi di jaringan yang lebih stabil.');
  }
  return new FaceServiceError('SERVICE_UNAVAILABLE', 'Server tidak dapat dihubungi. Periksa koneksi internet Anda.');
}

function buildForm(imageUris: string[], fields: Record<string, string> = {}) {
  const form = new FormData();
  imageUris.forEach((uri, i) => {
    form.append('image', { uri, name: `frame${i}.jpg`, type: 'image/jpeg' } as any);
  });
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  return form;
}

export const faceRecognitionService = {
  async status(): Promise<FaceStatus> {
    try {
      const res = await axios.get('face/status', { headers: authHeaders() });
      if (res.status >= 400) throw toError(res);
      return res.data.data as FaceStatus;
    } catch (error) {
      throw networkError(error);
    }
  },

  async isEnrolled(): Promise<boolean> {
    return (await this.status()).enrolled;
  },

  /** Daftarkan wajah dari >=2 foto pose berbeda (foto pertama = referensi). */
  async enroll(imageUris: string[]): Promise<FaceStatus> {
    try {
      const res = await axios.post('face/enroll', buildForm(imageUris), {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
        timeout: 40000,
      });
      if (res.status >= 400) throw toError(res);
      return res.data.data as FaceStatus;
    } catch (error) {
      throw networkError(error);
    }
  },

  /**
   * Verifikasi wajah (>=2 frame berbeda). `ref` = id pertemuan presensi; hasilnya tiket `ticket`
   * yang dikirim sebagai `face_ticket` pada scan presensi.
   */
  async verify(imageUris: string[], opts: { ref?: string; purpose?: string } = {}): Promise<{ verified: boolean; similarity: number; ticket: string }> {
    try {
      const fields: Record<string, string> = { purpose: opts.purpose || 'presensi' };
      if (opts.ref) fields.ref = String(opts.ref);
      const res = await axios.post('face/verify', buildForm(imageUris, fields), {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
        timeout: 40000,
      });
      if (res.status >= 400) throw toError(res);
      const d = res.data.data;
      return { verified: !!d.verified, similarity: Number(d.score) || 0, ticket: d.ticket };
    } catch (error) {
      throw networkError(error);
    }
  },
};
