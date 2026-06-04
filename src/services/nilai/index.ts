import axios from '../../config/axios-tias';
import siakadAxios from '../../config/axios-siakad';
import { useTokenStore } from '../../store/auth';

export interface MataKuliahNilai {
  no: number;
  kode: string;
  namaMataKuliah: string;
  sks: number;
  nilaiMutu: number;
  bobot: number;
  nilai: string;
}

export interface NilaiPeriode {
  periode: string;
  mata_kuliah: MataKuliahNilai[];
  total_sks: number;
  total_bobot: number;
  ips: number;
}

export interface NilaiResponse {
  status: boolean;
  message: string;
  data: NilaiPeriode[];
  current_periode?: string;
}

export async function getNilai(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('help/skpi-nilai', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}

export async function getPeriodeAkademik(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await siakadAxios.get('akademik/periode-akademik', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getHasilStudiSiakad(periodeId: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const user = useTokenStore.getState().user;

  if (user?.role === 'Parent' && user?.npm) {
    const response = await siakadAxios.get(`orang-tua/hasil-studi?npm=${user.npm}&periodeId=${periodeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } else {
    const response = await siakadAxios.get(`hasil-studi?periodeId=${periodeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export async function getIpkParent(npm: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await siakadAxios.get(`orang-tua/hasil-studi/ipk?npm=${npm}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
