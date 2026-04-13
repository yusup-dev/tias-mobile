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
};

type Action = {
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setAuthentication: (auth: boolean) => void;
  setRememberMe: (rememberMe: boolean) => void;
};

export const useTokenStore = create<Store & Action>()(
  persist(
    set => ({
      token: '',
      user: {},
      auth: false,
      rememberMe: false,
      setToken: token => set(() => ({token})),
      setUser: user => set(() => ({user})),
      setAuthentication: auth => set(() => ({auth})),
      setRememberMe: rememberMe => set(() => ({rememberMe})),
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
          auth: false,
        };
      },
      partialize: state => ({
        token: state.token,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);