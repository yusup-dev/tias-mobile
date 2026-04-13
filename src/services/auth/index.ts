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
    const response = await axios.post('auth/login', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
