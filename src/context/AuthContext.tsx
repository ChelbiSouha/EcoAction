import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email?: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => { },
  register: async () => { },
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@ecoaction/user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      // Pass credentials to AuthService
      const user = await AuthService.login(email, password);
      if (user) {
        setUser(user);
        router.replace('/(tabs)/missions');
      }
    } catch (error: any) {
      console.error('Sign in failed', error);
      alert(error.message || 'Login failed. Check your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const user = await AuthService.register(name, email, password);
      if (user) {
        setUser(user);
        router.replace('/(tabs)/missions');
      }
    } catch (error: any) {
      console.error('Registration failed', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      await AsyncStorage.removeItem('@ecoaction/user');
      router.replace('/sign-in');
    } catch (error) {
      console.error('Sign out failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
