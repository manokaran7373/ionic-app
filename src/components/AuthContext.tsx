import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const { value } = await Preferences.get({ key: 'accessToken' });
    if (value) setToken(value);
  };

  const setAccessToken = async (token: string) => {
    await Preferences.set({ key: 'accessToken', value: token });
    setToken(token);
  };

  const logout = async () => {
    await Preferences.remove({ key: 'accessToken' });
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
