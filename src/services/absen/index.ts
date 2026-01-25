import {useTokenStore} from '../../store/auth';
import axios from '../../config/axios-tias';
import axiosTi from '../../config/axios-ti';

export type AbsenResponse = {
  message?: string;
  data?: object;
  errors: any;
};

export type AbsenRequest = {
  token: string;
  coordinate: string;
  status_absen: number;
  npm: string;
};

export async function absensi(data: AbsenRequest): Promise<AbsenResponse> {
  const response = await axios.post('absensi/scan-qr', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}
export async function get_pembelajaran(data: {
  token: string;
}): Promise<AbsenResponse> {
  const response = await axios.get('absensi/get-pembelajaran', {
    params: {
      'filter[]': 'token',
      'filterValue[]': data.token,
    },
  });
  return response.data;
}
export async function get_history(): Promise<AbsenResponse> {
  const user = useTokenStore.getState().user;
  console.log({user: user.npm});
  const response = await axiosTi.get('absensi', {
    params: {
      'filter[]': 'npm',
      'filterValue[]': user.npm,
    },
  });
  return response.data;
}
