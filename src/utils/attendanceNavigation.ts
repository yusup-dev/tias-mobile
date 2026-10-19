// Dipakai formCode.tsx & index.tsx (dua jalur yg sama persis: input token manual vs
// scan QR, keduanya lanjut ke get_pembelajaran lalu navigasi ke layar presensi) --
// disatukan di sini supaya param & pemilihan layar (FR vs checkin biasa) konsisten.

export type AttendanceItem = {
  id?: number | string;
  matakuliah?: {nama_matakuliah?: string};
  matkul?: {name?: string};
  dosen?: {nama?: string};
  nik_dosen?: string;
  kelas?: number | string;
  use_face_recognition?: boolean;
};

export type AttendanceNavParams = {
  subjectId: string;
  token: string;
  meetingId: string;
  subject: string;
  lecturer: string;
  className: string;
  authToken: string | null;
};

export function buildAttendanceParams(
  item: AttendanceItem,
  token: string,
  subjectId: string,
  authToken: string | null,
): AttendanceNavParams {
  return {
    subjectId,
    token,
    meetingId: item?.id?.toString() || '',
    subject: item?.matakuliah?.nama_matakuliah || item?.matkul?.name || '-',
    lecturer: item?.dosen?.nama || item?.nik_dosen || '-',
    className: item?.kelas?.toString() || '-',
    authToken,
  };
}

// Dosen pilih FR on/off saat generate presensi (lihat form Generate QRCODE di
// fe-ucl) -- default OFF. FR on tetap lewat layar kamera (absensi.face, TIDAK
// berubah); FR off cukup konfirmasi + lokasi GPS (absensi.checkin, layar baru).
export function resolveAttendanceScreen(item: AttendanceItem): 'absensi.face' | 'absensi.checkin' {
  return item?.use_face_recognition ? 'absensi.face' : 'absensi.checkin';
}
