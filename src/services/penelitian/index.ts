import parentAxios from '../../config/axios-parent';
import { useTokenStore } from '../../store/auth';

export async function getSkripsiParent(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;
  
  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await parentAxios.get(`/parents/skripsi/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });
  
  return response.data;
}

export async function getAllDosen(): Promise<any> {
  const token = useTokenStore.getState().token;

  const response = await parentAxios.get('/parents/all-dosen', {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });
  
  return response.data;
}
