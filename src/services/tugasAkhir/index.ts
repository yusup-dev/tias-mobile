import axios from '../../config/axios-tias';
import { useTokenStore } from '../../store/auth';

export interface PengajuanPembimbingItem {
  id: number;
  mhs_id: string;
  judul_skripsi: string;
  lokasi_kegiatan: string;
  semester: string;
  status: string;
  nama_lengkap: string;
  npm: string;
  sk_pembimbing_1: string | null;
  sk_pembimbing_2: string | null;
  sk_pembimbing_3: string | null;
  kepala_lab: string | null;
  sk_status_pem_1: boolean | null;
  sk_status_pem_2: boolean | null;
  sk_status_pem_3: boolean | null;
  status_kepala_lab: boolean | null;
  peran: string;
}

export interface PengajuanPembimbingDetail extends PengajuanPembimbingItem {
  statusDosen: number;
  isKepalaLab: boolean;
}

export type PembimbingApproveField =
  | 'sk_status_pem_1'
  | 'sk_status_pem_2'
  | 'sk_status_pem_3'
  | 'status_kepala_lab';

export async function getPengajuanPembimbingUntukDosen(): Promise<any> {
  const token = useTokenStore.getState().token;

  const response = await axios.get('tugas-akhir/get-for-dosen', {
    params: { status: 'pengajuan-sk' },
    headers: {
      token: token,
    },
  });

  if (response.status >= 400) {
    throw new Error(response.data?.message || 'Gagal memuat data ajuan pembimbing.');
  }

  return response.data;
}

export async function getDetailPengajuanPembimbingUntukDosen(id: number | string): Promise<any> {
  const token = useTokenStore.getState().token;

  const response = await axios.get(`tugas-akhir/detail-for-dosen/${id}`, {
    headers: {
      token: token,
    },
  });

  if (response.status >= 400) {
    throw new Error(response.data?.message || 'Gagal memuat detail ajuan pembimbing.');
  }

  return response.data;
}

export async function approvePengajuanPembimbing(
  id: number | string,
  field: PembimbingApproveField,
): Promise<any> {
  const token = useTokenStore.getState().token;

  const response = await axios.put(
    `tugas-akhir/approve/${id}`,
    {
      [field]: true,
      db: 'ta_pengajuan_sk',
    },
    {
      headers: {
        token: token,
      },
    },
  );

  // axios-tias pakai validateStatus < 500, jadi 4xx tidak otomatis throw — cek manual di sini
  // supaya kegagalan approve (mis. "Data not found") tidak dianggap sukses oleh pemanggil.
  if (response.status >= 400) {
    throw new Error(response.data?.message || 'Gagal menyetujui ajuan.');
  }

  return response.data;
}
