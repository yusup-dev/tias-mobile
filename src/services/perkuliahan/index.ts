// help/skpi-perkuliahan

import axios from '../../config/axios-tias';
import {useTokenStore} from '../../store/auth';
export async function perkuliahan(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('help/skpi-perkuliahan', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}
