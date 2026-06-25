import axiosOrangTua from '../../config/axios-orang-tua';
import siakadAxios from '../../config/axios-siakad';
import { useTokenStore } from '../../store/auth';

export async function getPengabdianOrangTua(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;

  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await axiosOrangTua.get(`/parents/pengabdian/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });

  return response.data;
}

export async function getPengabdianOrangTuaSiakad(npm: string): Promise<any> {
  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await siakadAxios.get(`/orang-tua/pengabdian/${npm}`);

  return response.data;
}
