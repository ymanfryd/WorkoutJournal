import {storage} from '@/storage/mmkv';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

type AuthState = {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isSignedIn: false,
      signIn: () => set({isSignedIn: true}),
      signOut: () => set({isSignedIn: false}),
    }),
    {name: 'auth', storage: createJSONStorage(() => mmkvStorage)},
  ),
);

export const useIsSignedIn = () => useAuthStore(s => s.isSignedIn);
export const useIsSignedOut = () => useAuthStore(s => !s.isSignedIn);
