import { useQuery } from '@tanstack/react-query';
// Saya melihat Kapten punya folder config di luar. Kita import axios-nya dari sana:
import api from '../../config/axios-cbt'; 

export const useHistory = () => {
  return useQuery({
    queryKey: ['cbtHistory'],
    queryFn: async () => {
      // Pastikan endpoint ini sesuai dengan route backend Kapten
      const response = await api.get('/cbt/student/history'); 
      return response.data;
    },
  });
};