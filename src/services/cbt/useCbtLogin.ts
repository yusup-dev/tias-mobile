import { useMutation } from '@tanstack/react-query';
import { useTokenStore } from '../../store/auth';
import axiosTias from '../../config/axios-tias';

export const useCbtLogin = () => {
  const { token, setCbtToken } = useTokenStore();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosTias.post(
        'api/cbt/auth',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success && data?.data?.cbt_token) {
        setCbtToken(data.data.cbt_token, data.data.cbt_user_id);
      }
    },
  });
};
