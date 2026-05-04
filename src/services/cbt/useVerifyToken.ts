import { useMutation } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export interface Question {
  id: number;
  tipe: 'TIPE_1' | 'TIPE_2' | 'TIPE_3' | 'TIPE_4';
  pertanyaan: string;
  bobot: number;
  options?: string[];
}

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: async (tokenUjian: string) => {
      const res = await axiosCbt.post('/api/student/verify-token', {
        token: tokenUjian,
      });
      return res.data;
    },
  });
};
