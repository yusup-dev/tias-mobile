// profile/getDataPribadi

import axios from '../../config/axios-tias';
import {useTokenStore} from '../../store/auth';
export async function profile(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('profile/getDataPribadi', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}
