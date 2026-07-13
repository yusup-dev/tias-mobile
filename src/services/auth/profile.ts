// profile/getDataPribadi

import axios from '../../config/axios-tias';
import axiosOrangTua from '../../config/axios-orang-tua';
import { useTokenStore } from '../../store/auth';
export async function profile(): Promise<any> {
  const token = useTokenStore.getState().token;
  const user = useTokenStore.getState().user;

  // Jika login sebagai Orang Tua, ambil data mahasiswa berdasarkan NPM
  if (user?.role === 'Parent' && user?.npm) {
    const response = await axiosOrangTua.get(`profile/getDataPribadiByNpm/${user.npm}`, {
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

export async function updateSignature(base64Image: string): Promise<any> {
  const token = useTokenStore.getState().token;

  // Create form data for file upload
  const formData = new FormData();

  // Convert base64 to file-like object for FormData
  // Note: base64Image is expected to be 'data:image/png;base64,...'
  const uri = base64Image;
  const name = `signature_${Date.now()}.png`;
  const type = 'image/png';

  formData.append('ttd', {
    uri,
    name,
    type,
  } as any);

  const response = await axios.patch('profile/update-ttd', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: token,
    },
  });
  return response.data;
}

// ── PROFILE ORANG TUA ────────────────────────────────────────────────────────

export async function getProfileOrangTua(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axiosOrangTua.get('/parents/get-profile', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token: token,
    },
  });
  return response.data;
}

export async function editProfileOrangTua(data: { nama_lengkap: string; no_hp: string }): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axiosOrangTua.put('/parents/edit-profile', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token: token,
    },
  });
  return response.data;
}
