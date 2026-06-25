import axiosOrangTua from '../../config/axios-orang-tua';
import { useTokenStore } from '../../store/auth';

export async function getSkripsiOrangTua(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;

  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await axiosOrangTua.get(`/parents/skripsi/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });

  return response.data;
}

export async function getAllDosen(): Promise<any> {
  const token = useTokenStore.getState().token;

  const response = await axiosOrangTua.get('/parents/all-dosen', {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });

  return response.data;
}
