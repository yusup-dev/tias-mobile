import axiosTias from '../../config/axios-tias';
import axiosOrangTua from '../../config/axios-orang-tua';
import { useTokenStore } from '../../store/auth';

/**
 * Tagihan SIAKAD (tahap 1 SPP & tahap 2 KRS), riwayat pembayaran, transkrip, capaian OBE (CPL/CPMK)
 * dan kotak notifikasi. Mahasiswa membaca datanya sendiri; orang tua hanya anaknya (npm dipilih di
 * layar bila punya >1 anak). Akun orang tua login lewat backend `axios-orang-tua`, jadi permintaan
 * mengikuti backend yang menerbitkan tokennya.
 */
const client = () => {
  const { token, user } = useTokenStore.getState();
  return { http: user?.role === 'Parent' ? axiosOrangTua : axiosTias, headers: { token }, user };
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function get(path: string, npm?: string, extra: Record<string, any> = {}) {
  const { http, headers, user } = client();
  const params: Record<string, any> = { ...extra };
  if (user?.role === 'Parent' && npm) params.npm = npm;
  const res = await http.get(path, { headers, params });
  const body = res.data;
  if (res.status !== 200 || !body || (body.status && body.status !== 200)) {
    throw new ApiError(body?.message || 'Gagal memuat data.', res.status);
  }
  return body.data;
}

export type Anak = { npm: string; nama: string };

export const getAnak = async (): Promise<Anak[]> => {
  const { user } = client();
  if (user?.role !== 'Parent') return [];
  return (await get('tagihan/anak')) as Anak[];
};

export const getTahapan = (npm?: string) => get('tagihan/tahapan', npm);
export const getHistori = (npm?: string, periodeId?: string) => get('tagihan/histori', npm, periodeId ? { periodeId } : {});
export const getDetailTagihan = (kode: string, npm?: string) => get(`tagihan/detail/${encodeURIComponent(kode)}`, npm);
export const getTranskrip = (npm?: string) => get('tagihan/transkrip', npm);
export const getObe = (npm?: string) => get('tagihan/obe', npm);

// ---- notifikasi (inbox + token perangkat push)
export const getNotifikasi = async (page = 1) => {
  const { http, headers } = client();
  const res = await http.get('notifications', { headers, params: { page, limit: 30 } });
  if (res.status !== 200) throw new ApiError(res.data?.message || 'Gagal memuat notifikasi.', res.status);
  return res.data as { total: number; page: number; data: any[] };
};
export const getUnreadCount = async (): Promise<number> => {
  const { http, headers } = client();
  const res = await http.get('notifications/unread-count', { headers });
  return res.status === 200 ? res.data?.data?.unread ?? 0 : 0;
};
export const markRead = async (id?: number) => {
  const { http, headers } = client();
  await http.post('notifications/read', id ? { id } : {}, { headers });
};
export const registerDeviceToken = async (token: string, platform: string, appVersion?: string) => {
  const { http, headers } = client();
  await http.post('notifications/device-token', { token, platform, app_version: appVersion }, { headers });
};
export const removeDeviceToken = async (token: string, authToken: string, role?: string) => {
  const http = role === 'Parent' ? axiosOrangTua : axiosTias;
  await http.delete('notifications/device-token', { headers: { token: authToken }, data: { token } });
};
