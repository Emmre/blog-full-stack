import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { IAuthState, AuthContextType } from './type';
import { loadAuthStateFromCookies, saveAuthStateToCookies } from '@/src/utils/cookie';
import { useRouter } from 'next/router';

const defaultAuthState: IAuthState = {
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<IAuthState>(loadAuthStateFromCookies());

  useEffect(() => {
    setAuthState(loadAuthStateFromCookies());
  }, []);

  useEffect(() => {
    if (router.pathname === '/login') {
      saveAuthStateToCookies(authState);
    }
  }, [authState]);

  const setUserCredentials = (userCredentials?: IAuthState | null) => {
    if (userCredentials === null) {
      setAuthState(defaultAuthState);
    } else if (userCredentials) {
      setAuthState(userCredentials);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        setUserCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
