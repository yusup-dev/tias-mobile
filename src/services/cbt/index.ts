import { useTokenStore } from '../../store/auth';

// Ganti dengan Base URL API kamu
const BASE_URL = 'https://u-talent.uika-bogor.ac.id/cbt-api'; 

// 1. Fungsi untuk Verifikasi Token & Ambil Soal (DENGAN MODE DEBUG CCTV)
export const verifyExamToken = async (tokenUjian: string) => {
  const jwtToken = useTokenStore.getState().token; // Mengambil JWT dari zustand store

  // 1. Cek URL yang terbentuk
  const targetUrl = `${BASE_URL}/api/student/verify-token`;
  console.log("=== DEBUG CBT API ===");
  console.log("Mencoba nembak ke URL:", targetUrl);
  console.log("Token Ujian yang diketik:", tokenUjian);
  console.log("JWT Token User:", jwtToken ? "Ada Tokennya" : "KOSONG/BELUM LOGIN!");

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`, // Header wajib
      },
      body: JSON.stringify({ token: tokenUjian }), // Kirim token ujian
    });

    // 2. Cek apakah response berupa JSON yang valid atau error HTML dari server
    const textResult = await response.text(); 
    console.log("Response Text dari Server:", textResult);

    // Parsing string ke JSON
    const result = JSON.parse(textResult);

    if (!response.ok) {
      throw new Error(result.message || `HTTP Error ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error("Fetch Error Detail:", error);
    throw error;
  }
};

// 2. Fungsi untuk Submit Jawaban Ujian
export const submitExamAnswers = async (payload: { examId: string | number, answers: any, files?: any[] }) => {
  const jwtToken = useTokenStore.getState().token;

  // Wajib menggunakan FormData sesuai dokumentasi
  const formData = new FormData();
  formData.append('exam_id', payload.examId.toString());
  formData.append('answers', JSON.stringify(payload.answers)); // JSON stringify answers

  // Jika ada soal TIPE_4 (Upload File)
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach(file => {
      formData.append(`file_${file.questionId}`, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });
  }

  const response = await fetch(`${BASE_URL}/api/student/submit-exam`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      // Jangan set Content-Type manual agar boundary FormData di-generate otomatis
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengirim jawaban ujian');
  }
  return result;
};

// 3. Fungsi untuk Mengambil Riwayat Ujian
export const getExamHistory = async () => {
  const jwtToken = useTokenStore.getState().token;

  const response = await fetch(`${BASE_URL}/api/student/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`, // Header wajib
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengambil riwayat ujian');
  }
  return result;
};