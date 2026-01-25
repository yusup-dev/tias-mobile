import axios from '../../config/axios-tias';

// import { useTokenStore } from '@/store/auth'

export type LoginResponse = {
  message?: string;
  data?: object;
  errors: any;
};

export type LoginRequest = {
  email: string;
  password: string;
};
export async function login(data: any): Promise<any> {
  try {
    console.log({data});
    const response = await axios.post('auth/login', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log('ERROR:', error.message);
    console.log('DETAIL:', error.response?.data || error);
    console.log({error});
  }
}
