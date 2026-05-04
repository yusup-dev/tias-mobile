import { useMutation } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export const useSubmitExam = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosCbt.post('/api/student/submit-exam', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30_000,
      });
      return res.data;
    },
  });
};
