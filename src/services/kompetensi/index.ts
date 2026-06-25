import axiosOrangTua from '../../config/axios-orang-tua';
import { useTokenStore } from '../../store/auth';

export async function getKompetensiOrangTua(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;

  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await axiosOrangTua.get(`/parents/kompetensi/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });

  return response.data;
}
