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

/** Login mahasiswa dengan verifikasi wajah (tanpa password), diidentifikasi lewat NPM */
export async function loginWithFace(npm: string, photoUri: string): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('npm', npm);
    formData.append('image', {
      uri: photoUri,
      name: 'login-face.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await axios.post('auth/login-face', formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function register(data: any): Promise<any> {
  try {
    const response = await axios.post('auth/register', data, {
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

export async function forgotPassword(data: { email: string }): Promise<any> {
  try {
    const response = await axios.post('auth/forgotPassword', data, {
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
