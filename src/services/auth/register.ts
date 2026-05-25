import axios from '../../config/axios-tias';
import parentAxios from '../../config/axios-parent';

// ── REGISTER MAHASISWA ────────────────────────────────────────────────────────

export type RegisterMahasiswaRequest = {
  npm_nidn: string;
  email: string;
  password: string;
  password2: string;
};

// ── REGISTER ORANG TUA ────────────────────────────────────────────────────────

export type RegisterOrangTuaRequest = {
  nama_lengkap: string;
  email: string;
  npm: string;
  no_hp: string;
  password: string;
  password2: string;
};

export async function registerMahasiswa(
  data: RegisterMahasiswaRequest,
): Promise<any> {
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

export async function registerOrangTua(
  data: RegisterOrangTuaRequest,
): Promise<any> {
  try {
    const response = await parentAxios.post('parents/register', data, {
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
