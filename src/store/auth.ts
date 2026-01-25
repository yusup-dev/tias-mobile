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
};
type Action = {
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setAuthentication: (auth: boolean) => void;
};
export const useTokenStore = create<Store & Action>()(
  persist(
    set => ({
      token: '',
      user: {},
      auth: false,
      setToken: token => set(state => ({token: token})),
      setUser: user => set(state => ({user: user})),
      setAuthentication: auth => set(state => ({auth: auth})),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
