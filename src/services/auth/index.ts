import axios from '../../config/axios-tias';
import axiosOrangTua from '../../config/axios-orang-tua';

export type LoginResponse = {
  message?: string;
  data?: object;
  errors: any;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/** Login mahasiswa dengan email + password */
export async function login(data: LoginRequest): Promise<any> {
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

/** Login orang tua dengan email + password */
export async function loginOrangTua(data: LoginRequest): Promise<any> {
  try {
    const response = await axiosOrangTua.post('parents/login', data, {
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
