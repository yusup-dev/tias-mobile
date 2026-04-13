import axios from '../../../config/axios-tias';
import {FaceVerifyRequest, FaceVerifyResponse} from '../types';

export async function faceVerify(
  payload: FaceVerifyRequest,
): Promise<FaceVerifyResponse> {
  const response = await axios.post('attendance/face-verify', payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function faceVerifyMock(
  payload: FaceVerifyRequest,
): Promise<FaceVerifyResponse> {
  await new Promise(resolve => setTimeout(resolve, 900));

  const hasToken = payload.tokenAbsensi.trim().length >= 6;
  const hasLocation =
    Number.isFinite(payload.lat) && Number.isFinite(payload.long);
  const verified = hasToken && hasLocation;

  return {
    verified,
    confidence: verified ? 0.91 : 0.22,
    message: verified
      ? 'Simulasi berhasil: wajah cocok.'
      : 'Simulasi gagal: token/lokasi belum valid.',
  };
}
