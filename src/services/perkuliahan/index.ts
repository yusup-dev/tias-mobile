// help/skpi-perkuliahan

import axios from '../../config/axios-tias';
import siakadAxios from '../../config/axios-siakad';
import axiosParent from '../../config/axios-parent';
import { useTokenStore } from '../../store/auth';

export async function perkuliahan(): Promise<any> {
  const token = useTokenStore.getState().token;
  const user = useTokenStore.getState().user;

  if (user?.role === 'Parent' && user?.npm) {
    const response = await siakadAxios.get(`orang-tua/jadwal-akademik/minggu?npm=${user.npm}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  const response = await axios.get('help/skpi-perkuliahan', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}

export async function absensiDetail(npm: string, kodeMatkul: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axiosParent.get(`parents/absensi-matkul/${npm}/${kodeMatkul}`, {
    headers: {
      token: token,
    },
  });
  return response.data;
}
