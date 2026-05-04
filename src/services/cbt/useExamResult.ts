import { useQuery } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export const useExamResult = (examId: number | null) => {
  return useQuery({
    queryKey: ['cbt-result', examId],
    queryFn: async () => {
      const res = await axiosCbt.get(`/api/student/result/${examId}`);
      return res.data?.data;
    },
    enabled: !!examId,
    retry: 1,
  });
};
