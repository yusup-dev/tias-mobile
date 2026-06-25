import axios from '../../config/axios-tias';
import {useTokenStore} from '../../store/auth';

export async function getLeaderboard(params: any = {}): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('users/papan-peringkat', {
    params,
    headers: {
      token: token,
    },
  });
  return response.data;
}

export async function getMyAchievements(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('achievments/by-mhsLoginId', {
    headers: {
      token: token,
    },
  });
  return response.data;
}

export async function getAllAchievements(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('achievments', {
    headers: {
      token: token,
    },
  });
  return response.data;
}

export async function getActivity(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('absensi/get-absensi-mhs', {
    headers: {
      token: token,
    },
  });
  return response.data;
}

