import axiosOrangTua from '../../config/axios-orang-tua';
import { useTokenStore } from '../../store/auth';

export async function getSuratPengunduranDiri(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axiosOrangTua.get(`/parents/surat-pengunduran-diri/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token: token,
    },
  });
  return response.data;
}

export async function approveSuratPengunduranDiri(id: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axiosOrangTua.put(`/parents/surat-pengunduran-diri/${id}/approve`, {}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token: token,
    },
  });
  return response.data;
}
