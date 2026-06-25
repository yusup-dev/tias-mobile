import { useQuery } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export interface ExamTerm {
  id: number;
  isi_syarat: string;
  urutan: number;
}

export interface ExamTermsResponse {
  success: boolean;
  data: {
    exam_id: number;
    terms: ExamTerm[];
    is_custom: boolean;
  };
}

export const useExamTerms = (examId: number | null) => {
  return useQuery<ExamTermsResponse>({
    queryKey: ['exam-terms', examId],
    queryFn: async () => {
      const res = await axiosCbt.get(`/api/student/exam-terms/${examId}`);
      return res.data;
    },
    enabled: !!examId,
    staleTime: 60_000,
    retry: 1,
    // Jika API gagal, jangan crash — hook mengembalikan data default via fallback di UI
  });
};
