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
};

type Action = {
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setAuthentication: (auth: boolean) => void;
  setRememberMe: (rememberMe: boolean) => void;
  setCbtToken: (token: string, cbt_user_id: number) => void;
  clearCbtToken: () => void;
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
      setToken: token => set(() => ({token})),
      setUser: user => set(() => ({user})),
      setAuthentication: auth => set(() => ({auth})),
      setRememberMe: rememberMe => set(() => ({rememberMe})),
      setCbtToken: (cbt_token, cbt_user_id) => set({ cbt_token, cbt_user_id }),
      clearCbtToken: () => set({ cbt_token: null, cbt_user_id: null }),
    }),
    {
      name: 'auth',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any) => {
        return {
          token: persistedState?.token ?? '',
          user: persistedState?.user ?? {},
          rememberMe: persistedState?.rememberMe ?? false,
          cbt_token: persistedState?.cbt_token ?? null,
          cbt_user_id: persistedState?.cbt_user_id ?? null,
          auth: false,
        };
      },
      partialize: state => ({
        token: state.token,
        user: state.user,
        rememberMe: state.rememberMe,
        cbt_token: state.cbt_token,
        cbt_user_id: state.cbt_user_id,
      }),
    },
  ),
);