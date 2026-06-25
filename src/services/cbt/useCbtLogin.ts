import { useMutation } from '@tanstack/react-query';
import { useTokenStore } from '../../store/auth';
import axiosTias from '../../config/axios-tias';

export const useCbtLogin = () => {
  const { token, setCbtToken } = useTokenStore();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosTias.post(
        'cbt/auth',
        {},
        { headers: { token: token } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success && data?.data?.cbt_token) {
        const expiresAt = data?.data?.expires_at
          ? new Date(data.data.expires_at).getTime()
          : Date.now() + 8 * 60 * 60 * 1000;
        setCbtToken(data.data.cbt_token, data.data.cbt_user_id, expiresAt);
      }
    },
  });
};
