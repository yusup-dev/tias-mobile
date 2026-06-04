import parentAxios from '../../config/axios-parent';
import { useTokenStore } from '../../store/auth';

export async function getPenunjangParent(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;

  if (!npm) {
    throw new Error('NPM tidak ditemukan');
  }

  const response = await parentAxios.get(`/parents/penunjang/${npm}`, {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });

  return response.data;
}
