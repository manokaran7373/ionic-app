  import React, { createContext, useContext, useEffect, useState } from 'react';
  import { Preferences } from '@capacitor/preferences';
  import { useIonRouter } from '@ionic/react';
  import axios, { AxiosInstance } from 'axios';
  import { API_BASE_URL } from './config/constants';


  interface AuthContextType {
    isAuthenticated: boolean;
    login: (tokens: { access: string; refresh: string }) => Promise<void>;
    logout: () => Promise<void>;
    axiosInstance: AxiosInstance;
  }

  // Create Context with correct type
  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  // Create Axios instance
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(async (config) => {
    const { value: token } = await Preferences.get({ key: 'accessToken' });
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, Promise.reject);

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { value: refreshToken } = await Preferences.get({ key: 'refreshToken' });
          const response = await axios.post(`${API_BASE_URL}/api/refresh-token/`, {
            refresh_token: refreshToken,
          });

          const { access } = response.data.data.tokens;
          await Preferences.set({ key: 'accessToken', value: access });
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await Preferences.remove({ key: 'accessToken' });
          await Preferences.remove({ key: 'refreshToken' });
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useIonRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
      const checkAuth = async () => {
        const { value: token } = await Preferences.get({ key: 'accessToken' });
        setIsAuthenticated(!!token);
        if (!token) router.push('/login', 'root');
      };
      checkAuth();
    }, []);

    const login = async (tokens: { access: string; refresh: string }) => {
      await Preferences.set({ key: 'accessToken', value: tokens.access });
      await Preferences.set({ key: 'refreshToken', value: tokens.refresh });
      setIsAuthenticated(true);
    };

    const logout = async () => {
      await Preferences.remove({ key: 'accessToken' });
      await Preferences.remove({ key: 'refreshToken' });
      setIsAuthenticated(false);
    };

    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, axiosInstance }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
