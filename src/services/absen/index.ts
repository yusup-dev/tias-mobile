// import {useTokenStore} from '../../store/auth';
// import axios from '../../config/axios-tias';
// import axiosTi from '../../config/axios-ti';

// export type AbsenResponse = {
//   message?: string;
//   data?: object;
//   errors: any;
// };

// export type AbsenRequest = {
//   token: string;
//   coordinate: string;
//   status_absen: number;
//   npm: string;
// };

// export async function absensi(data: AbsenRequest): Promise<AbsenResponse> {
//   const response = await axios.post('absensi/scan-qr', data, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
//   console.log(response);
//   console.log("jhyhyh");
//   return response.data;
// }
// export async function get_pembelajaran(data: {
//   token: string;
// }): Promise<AbsenResponse> {
//   const response = await axios.get('absensi/get-pembelajaran', {
//     params: {
//       'filter[]': 'token',
//       'filterValue[]': data.token,
//     },
//   });
//   return response.data;
// }
// export async function get_history(): Promise<AbsenResponse> {
//   const user = useTokenStore.getState().user;
//   const response = await axiosTi.get('absensi', {
//     params: {
//       'filter[]': 'npm',
//       'filterValue[]': user.npm,
//     },
//   });
//   return response.data;
// }


import {useTokenStore} from '../../store/auth';
import axios from '../../config/axios-tias';
import axiosTi from '../../config/axios-ti';

export type AbsenResponse = {
  message?: string;
  data?: any; // Diubah sedikit agar lebih fleksibel menerima array
  errors?: any;
};

export type AbsenRequest = {
  token: string;
  coordinate: string;
  status_absen: string;
  npm: string;
  // Tiket verifikasi wajah (FT1) dari POST /face/verify — wajib bila pertemuan memakai face recognition.
  face_ticket?: string;
};

// QR presensi DINAMIS (berganti tiap 5 menit): QR memuat kode bertanda tangan "UQ1.*",
// hasil resolve berupa tiket "UT1.*" terikat NPM. Keduanya diproses server UCL (bukan
// server presensi lama) -- token statis pertemuan tidak pernah sampai ke aplikasi.
const isDynamicCredential = (v?: string) =>
  typeof v === 'string' && (v.startsWith('UQ1.') || v.startsWith('UT1.'));

// 1. Fungsi untuk Submit Absen
export async function absensi(data: AbsenRequest): Promise<AbsenResponse> {
  const authToken = useTokenStore.getState().token;

  if (isDynamicCredential(data.token)) {
    const res = await axios.post('absensi/scan-qr', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: authToken,
      },
    });
    if (res.status >= 400) {
      throw new Error(
        res.data?.message ||
          'QR sudah kedaluwarsa atau tidak valid. Scan ulang QR di layar dosen.',
      );
    }
    return res.data;
  }

  // Token statis (QR/kode lama): rute kompatibilitas /fts (dimatikan server secara default)
  const response = await axiosTi.post('absensi/scan-qr', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: authToken,
    },
  });
  return response.data;
}

// 2. Fungsi untuk Mengambil Info Matkul dari Token
export async function get_pembelajaran(data: {
  token: string;
}): Promise<AbsenResponse & {ticket?: string}> {
  const authToken = useTokenStore.getState().token;

  if (isDynamicCredential(data.token)) {
    const res = await axios.post(
      'absensi/qr/resolve',
      {code: data.token},
      {headers: {token: authToken}},
    );
    if (res.status >= 400) {
      throw new Error(
        res.data?.responseMessage ||
          res.data?.message ||
          'QR tidak valid. Scan ulang QR di layar dosen.',
      );
    }
    return res.data; // {message, data:[pertemuan], ticket}
  }

  // Rute kompatibilitas /fts di server UCL
  const response = await axiosTi.get('pembelajaran', {
    params: {
      'filter[]': 'token',
      'filterValue[]': data.token,
    },
    headers: {
      token: authToken,
    },
  });
  return response.data;
}

// 3. Fungsi untuk History Absen (Sudah Benar)
export async function get_history(): Promise<AbsenResponse> {
  const user = useTokenStore.getState().user;
  const response = await axiosTi.get('absensi', {
    params: {
      'filter[]': 'npm',
      'filterValue[]': user.npm,
    },
  });
  return response.data;
}
