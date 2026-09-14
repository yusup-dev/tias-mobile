import axios from '../../config/axios-tias';
import { useTokenStore } from '../../store/auth';

/**
 * Data Tri Dharma milik akun yang sedang login (Mahasiswa/Dosen), lewat endpoint
 * self-scoped (`protected`, difilter oleh req.user.user_id di backend) — beda dari
 * endpoint /parents/* yang cuma bisa diakses token Orang Tua.
 */
function authHeaders() {
  const token = useTokenStore.getState().token;
  return { headers: { token } };
}

export async function getKualifikasiPendidikanSaya(): Promise<any> {
  const response = await axios.get('kualifikasi/getDataPend', authHeaders());
  return response.data;
}

export async function getKualifikasiRiwayatPekerjaanSaya(): Promise<any> {
  const response = await axios.get('kualifikasi/getDataRiwayatPekerjaan', authHeaders());
  return response.data;
}

export async function getKompetensiSertifikatSaya(): Promise<any> {
  const response = await axios.get('kompetensi/getCertificate', authHeaders());
  return response.data;
}

export async function getKompetensiTesSaya(): Promise<any> {
  const response = await axios.get('kompetensi/getTes', authHeaders());
  return response.data;
}

export async function getPenelitianSaya(): Promise<any> {
  const response = await axios.get('penelitian/getDatapenelitian', authHeaders());
  return response.data;
}

export async function getPengabdianSaya(): Promise<any> {
  const response = await axios.get('pengabdian/getDataPengabdian', authHeaders());
  return response.data;
}

export async function getPembicaraSaya(): Promise<any> {
  const response = await axios.get('pengabdian/pembicara/getDataPembicara', authHeaders());
  return response.data;
}

export async function getPenunjangPenghargaanSaya(): Promise<any> {
  const response = await axios.get('penunjang/getPenghargaan', authHeaders());
  return response.data;
}

export async function getPenunjangProfesiSaya(): Promise<any> {
  const response = await axios.get('penunjang/getProfesi', authHeaders());
  return response.data;
}
