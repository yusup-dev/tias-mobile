import axios from '../../config/axios-tias';
import axiosOrangTua from '../../config/axios-orang-tua';
import axiosEportal from '../../config/axios-eportal';

export type LoginResponse = {
  message?: string;
  data?: object;
  errors: any;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Login mahasiswa/dosen dengan email + password.
 *
 * Dua langkah supaya akun di mobile ini selalu sama dengan akun di E-Portal
 * (SSO), tapi tetap dapat token yang dikenali api-tias:
 * 1. Autentikasi ke E-Portal (`auth/login`) — sumber kredensial tunggal.
 * 2. Tukar `uika_sso_token` hasil langkah 1 ke tias-backend lewat
 *    `GET /sso/callback` (sudah dipakai jalur SSO web UCL yang ada) untuk
 *    dapat token TIAS asli. `role_id`/`appModule_id` di sini hanya placeholder
 *    wajib-diisi — endpoint itu belum memvalidasi/menggunakan nilainya.
 */
export async function login(data: LoginRequest): Promise<any> {
  const eportalResponse = await axiosEportal.post('auth/login', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const ssoToken = eportalResponse.data?.data?.uika_sso_token;

  if (!ssoToken) {
    // Gagal di E-Portal (kredensial salah, belum verifikasi, dll) — biarkan
    // response aslinya mengalir supaya pesan error di UI tetap relevan.
    return eportalResponse.data;
  }

  const tiasResponse = await axios.get('sso/callback', {
    params: {
      token: ssoToken,
      role_id: 1,
      appModule_id: 1,
    },
  });

  return tiasResponse.data;
}

/**
 * Login dengan verifikasi wajah (tanpa password, tanpa NPM/NIP) — identitas ditentukan
 * sepenuhnya dari kecocokan wajah (1:N recognize) di backend, jadi berlaku untuk semua
 * role yang sudah mendaftarkan wajahnya (Mahasiswa maupun Dosen).
 */
export async function loginWithFace(photoUri: string): Promise<any> {
  try {
    const formData = new FormData();
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
