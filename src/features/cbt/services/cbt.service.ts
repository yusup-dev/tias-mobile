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

export async function scoreCbtAnswer(
  payload: CbtAnswerScoreRequest,
): Promise<CbtAnswerScoreResponse> {
  const response = await axios.post('cbt/answer-score', payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}