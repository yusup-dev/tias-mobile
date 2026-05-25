import parentAxios from '../../config/axios-parent';
import siakadAxios from '../../config/axios-siakad';
import { useTokenStore } from '../../store/auth';

export async function getPengabdianParent(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;

  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await parentAxios.get(`/parents/pengabdian/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });

  return response.data;
}

export async function getPengabdianOrangTua(npm: string): Promise<any> {
  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await siakadAxios.get(`/orang-tua/pengabdian/${npm}`);

  return response.data;
}
