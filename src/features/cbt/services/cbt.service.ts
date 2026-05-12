import axios from '../../../config/axios-tias';
import {
  CbtAnswerScoreRequest,
  CbtAnswerScoreResponse,
  CbtExam,
  CbtQuestion,
} from '../types';

export async function getCbtExams(): Promise<CbtExam[]> {
  const response = await axios.get('cbt/exams', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data?.data ?? [];
}

export async function getCbtQuestions(examId: string): Promise<CbtQuestion[]> {
  const response = await axios.get(`cbt/exams/${examId}/questions`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data?.data ?? [];
}

// 🌟 UBAH FUNGSI INI DI DALAM FILE API KAPTEN (yg ada axios.post)
export async function scoreCbtAnswer(
  payload: FormData | any, // Izinkan FormData masuk
): Promise<any> {
  const isFormData = payload instanceof FormData;

  const response = await axios.post('cbt/student/submit-exam', payload, {
    headers: {
      Accept: 'application/json',
      // Jika FormData, biarkan Axios yang mengatur Content-Type otomatis (termasuk boundary-nya)
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });

  return response.data;
}