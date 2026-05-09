'use client';

import { useEffect, useState } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type AuthState = 'loading' | 'unauthenticated' | 'authenticated';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<AuthState>('loading');

  useEffect(() => {
    if (!auth) {
      setState('unauthenticated');
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setState(u ? 'authenticated' : 'unauthenticated');
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  return { user, state, signIn, signOut };
}
