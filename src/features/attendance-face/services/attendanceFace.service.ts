import axios from 'axios';
import {FaceVerifyResponse} from '../types';

// Tipe respons asli dari server
type ServerVerifyResponse = {
  subject_id: string;
  score: number;
  threshold: number;
  match: boolean;
};

const FACE_API_URL = 'https://u-talent.uika-bogor.ac.id/face-api';
const FACE_API_KEY = 'face-fts-absen';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
  'X-API-Key': FACE_API_KEY,
};

/**
 * Daftarkan wajah mahasiswa ke sistem (enroll)
 * POST /v1/faces/enroll
 */
export async function faceEnroll(npm: string, imageUri: string): Promise<void> {
  console.log('[FACE-API] >> POST /v1/faces/enroll');
  console.log('[FACE-API] subject_id:', npm);

  const formData = new FormData();
  formData.append('subject_id', npm);
  formData.append('image', {
    uri: imageUri,
    name: 'face_enroll.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await axios.post(
    `${FACE_API_URL}/v1/faces/enroll`,
    formData,
    {headers: HEADERS, timeout: 20000},
  );

  console.log('[FACE-API] << Enroll Response:', response.status, JSON.stringify(response.data).substring(0, 300));

  if (response.status >= 400) {
    throw new Error(response.data?.message || `Enroll gagal: status ${response.status}`);
  }
}

/**
 * Verifikasi wajah mahasiswa
 * POST /v1/faces/verify
 */
export async function faceVerify(
  npm: string,
  imageUri: string,
  threshold: number = 0.6,
): Promise<FaceVerifyResponse> {
  console.log('[FACE-API] >> POST /v1/faces/verify');
  console.log('[FACE-API] subject_id (npm):', npm);
  console.log('[FACE-API] imageUri:', imageUri);

  const formData = new FormData();
  formData.append('subject_id', npm);
  formData.append('threshold', threshold.toString());
  formData.append('image', {
    uri: imageUri,
    name: 'face_verify.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await axios.post(
    `${FACE_API_URL}/v1/faces/verify`,
    formData,
    {headers: HEADERS, timeout: 20000},
  );

  console.log('[FACE-API] << Verify Response:', response.status, JSON.stringify(response.data).substring(0, 300));

  // Map field server → field yang dipakai komponen
  const serverData: ServerVerifyResponse = response.data;
  return {
    verified: serverData.match,           // match → verified
    confidence: serverData.score,         // score → confidence
    message: serverData.match
      ? 'Wajah cocok! Absensi berhasil dicatat.'
      : `Wajah tidak cocok (skor: ${(serverData.score * 100).toFixed(0)}%).`,
  };
}

// ⚠️ DEV ONLY: Mock untuk testing UI tanpa server
export async function faceVerifyMock(npm: string): Promise<FaceVerifyResponse> {
  await new Promise(resolve => setTimeout(resolve, 900));
  return {
    verified: true,
    confidence: 0.91,
    message: 'Simulasi berhasil: wajah cocok.',
  };
}
