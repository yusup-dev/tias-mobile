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
};

// 1. Fungsi untuk Submit Absen (Sudah Benar)
export async function absensi(data: AbsenRequest): Promise<AbsenResponse> {
  const authToken = useTokenStore.getState().token;
  // Langsung tembak ke fts-absen Laravel
  const response = await axiosTi.post('absensi/scan-qr', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: authToken,
    },
  });
  return response.data;
}

// 2. Fungsi untuk Mengambil Info Matkul dari Token
// Proxy ke PHP server (172.16.18.162) yang menyimpan data QR
export async function get_pembelajaran(data: {
  token: string;
}): Promise<AbsenResponse> {
  const authToken = useTokenStore.getState().token;
  // Langsung tembak ke fts-absen (axiosTi) tanpa lewat proxy
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
