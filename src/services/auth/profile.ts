// profile/getDataPribadi

import axios from '../../config/axios-tias';
import parentAxios from '../../config/axios-parent';
import { useTokenStore } from '../../store/auth';
export async function profile(): Promise<any> {
  const token = useTokenStore.getState().token;
  const user = useTokenStore.getState().user;

  // Jika login sebagai Orang Tua, ambil data mahasiswa berdasarkan NPM
  if (user?.role === 'Parent' && user?.npm) {
    const response = await parentAxios.get(`profile/getDataPribadiByNpm/${user.npm}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: token,
      },
    });
    return response.data;
  }

  // Jika Mahasiswa (default)
  const response = await axios.get('profile/getDataPribadi', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}

// ── PROFILE ORANG TUA ────────────────────────────────────────────────────────

export async function getProfileParent(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await parentAxios.get('/parents/get-profile', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token: token,
    },
  });
  return response.data;
}

export async function editProfileParent(data: { nama_lengkap: string; no_hp: string }): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await parentAxios.put('/parents/edit-profile', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token: token,
    },
  });
  return response.data;
}
