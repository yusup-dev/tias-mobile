// help/skpi-perkuliahan

import axios from '../../config/axios-tias';
import axiosOrangTua from '../../config/axios-orang-tua';
import { useTokenStore } from '../../store/auth';

/**
 * Jadwal perkuliahan — SUMBER SAMA dengan modul Pembelajaran di web UCL (kelas aktif, jadwal
 * mingguan SIAKAD, agenda pertemuan terjadwal). Dosen & mahasiswa: GET lms/jadwal-saya;
 * orang tua: GET parents/jadwal-kuliah (hanya anaknya sendiri; npm opsional bila punya >1 anak).
 * Bentuk respons: { schedule:{Senin:[{kode,mataKuliah,kelas,sks,dosen,jamMulai,jamSelesai,ruangan}]},
 *                   matkul[], agenda[], totalSks, totalMatkul }.
 */
export async function perkuliahan(npm?: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const user = useTokenStore.getState().user;

  if (user?.role === 'Parent') {
    const response = await axiosOrangTua.get('parents/jadwal-kuliah', {
      params: npm || user?.npm ? { npm: npm || user?.npm } : undefined,
      headers: { token },
    });
    return response.data;
  }

  const response = await axios.get('lms/jadwal-saya', { headers: { token } });
  return response.data;
}

export async function absensiDetail(npm: string, kodeMatkul: string): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axiosOrangTua.get(`parents/absensi-matkul/${npm}/${kodeMatkul}`, {
    headers: {
      token: token,
    },
  });
  return response.data;
}
