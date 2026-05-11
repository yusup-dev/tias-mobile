import { useQuery } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export interface Exam {
  id: number;
  nama_ujian: string;
  mata_kuliah: {
    nama_mk: string;
};
  durasi: number;
  start_time: string;
  end_time: string;
}

export const useExamList = () => {
  return useQuery<Exam[]>({
    queryKey: ['cbt-exam-list'],
    queryFn: async () => {
      const res = await axiosCbt.get('/api/student/exams');
      return res.data?.data ?? [];
    },
    staleTime: 30_000,
    retry: 2,
  });
};
