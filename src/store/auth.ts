import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type UserType = {
  email?: string;
  full_name?: string;
  role_id?: number;
};

type Store = {
  token: string;
  user: any;
  auth: boolean;
  rememberMe: boolean;
  cbt_token: string | null;
  cbt_user_id: number | null;
  cbt_token_expires_at: number | null; // epoch ms
};

type Action = {
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setAuthentication: (auth: boolean) => void;
  setRememberMe: (rememberMe: boolean) => void;
  setCbtToken: (token: string, cbt_user_id: number, expiresAt?: number) => void;
  clearCbtToken: () => void;
  logout: () => void;
};

export const useTokenStore = create<Store & Action>()(
  persist(
    set => ({
      token: '',
      user: {},
      auth: false,
      rememberMe: false,
      cbt_token: null,
      cbt_user_id: null,
      cbt_token_expires_at: null,
      // KUNCI: setiap set JWT TIAS baru (login), buang token CBT lama agar tidak nyangkut
      setToken: token =>
        set(() => ({
          token,
          cbt_token: null,
          cbt_user_id: null,
          cbt_token_expires_at: null,
        })),
      setUser: user => set(() => ({user})),
      setAuthentication: auth => set(() => ({auth})),
      setRememberMe: rememberMe => set(() => ({rememberMe})),
      setCbtToken: (cbt_token, cbt_user_id, expiresAt) =>
        set({
          cbt_token,
          cbt_user_id,
          cbt_token_expires_at: expiresAt ?? Date.now() + 8 * 60 * 60 * 1000,
        }),
      clearCbtToken: () =>
        set({ cbt_token: null, cbt_user_id: null, cbt_token_expires_at: null }),
      logout: () =>
        set({
          token: '',
          user: {},
          auth: false,
          cbt_token: null,
          cbt_user_id: null,
          cbt_token_expires_at: null,
        }),
    }),
    {
      name: 'auth',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any) => {
        return {
          token: persistedState?.token ?? '',
          user: persistedState?.user ?? {},
          rememberMe: persistedState?.rememberMe ?? false,
          cbt_token: persistedState?.cbt_token ?? null,
          cbt_user_id: persistedState?.cbt_user_id ?? null,
          cbt_token_expires_at: persistedState?.cbt_token_expires_at ?? null,
          auth: false,
        };
      },
      partialize: state => ({
        token: state.token,
        user: state.user,
        rememberMe: state.rememberMe,
        cbt_token: state.cbt_token,
        cbt_user_id: state.cbt_user_id,
        cbt_token_expires_at: state.cbt_token_expires_at,
      }),
    },
  ),
);

/**
 * Validitas token CBT (bukan sekadar keberadaan).
 * Buffer 5 menit: token yang sebentar lagi mati dianggap tidak valid
 * agar SSO ulang dipicu lebih awal. Token tanpa expiry (rehydrate user lama
 * yang belum punya field ini) otomatis dianggap tidak valid.
 */
export const isCbtTokenValid = (): boolean => {
  const { cbt_token, cbt_token_expires_at } = useTokenStore.getState();
  if (!cbt_token || !cbt_token_expires_at) return false;
  return Date.now() < cbt_token_expires_at - 5 * 60 * 1000;
};