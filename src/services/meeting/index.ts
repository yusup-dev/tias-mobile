import axiosTi from '../../config/axios-ti';

export interface MeetingItem {
  id: string | number;
  nm_kegiatan: string;
  nm_pengundang: string;
  tipe_kegiatan?: string;
  ruangan?: string;
  waktu?: string;
  tanggal?: string;
  pertemuan?: string | number;
  token?: string;
  code?: string;
  status_hadir?: boolean;
  deskripsi?: string;
}

// Rapat yang mengundang pengguna (server hanya mengembalikan rapat buatan sendiri / undangan untuk NPM/NIP
// pengguna) + status kehadiran dari absensi-meeting milik sendiri. Endpoint: router `/fts` di server UCL.
export async function getMeetingInvites(): Promise<{data: MeetingItem[]}> {
  const [meet, abs] = await Promise.all([
    axiosTi.get('meeting', {params: {orderField: 'tanggal', orderValue: 'desc'}}),
    axiosTi.get('absensi-meeting'),
  ]);
  if (meet.status >= 400) {
    throw new Error(meet.data?.message || 'Daftar rapat tidak dapat dimuat.');
  }
  const hadir = new Set<string>(
    ((abs.status < 400 && abs.data?.data) || [])
      .filter((r: any) => Number(r.status_absen) === 1)
      .map((r: any) => String(r.id_meeting)),
  );
  const list: MeetingItem[] = (meet.data?.data || []).map((m: any) => ({
    ...m,
    status_hadir: hadir.has(String(m.id)),
  }));
  return {data: list};
}

// Presensi rapat: identitas (NPM/NIP) diambil server dari akun login; klien hanya mengirim token QR rapat
// dan koordinat.
export async function submitMeetingPresensi(params: {
  token: string;
  coordinate?: string;
}): Promise<any> {
  const res = await axiosTi.post('absensi-meeting/scan-qr', {
    token: params.token,
    coordinate: params.coordinate,
  });
  if (res.status >= 400) {
    throw new Error(res.data?.message || 'Presensi rapat gagal.');
  }
  return res.data;
}
