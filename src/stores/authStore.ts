import {create} from 'zustand';

type AuthState = {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isSignedIn: false,
  signIn: () => set({isSignedIn: true}),
  signOut: () => set({isSignedIn: false}),
}));

export const useIsSignedIn = () => useAuthStore(s => s.isSignedIn);
export const useIsSignedOut = () => useAuthStore(s => !s.isSignedIn);
