import { apiClient } from '../api/client';
import { User, AuthPayload } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@ecoaction/user';

export const AuthService = {
  login: async (email?: string, password?: string): Promise<User> => {
    try {
      // In a real app with json-server, we can filter by email
      const url = email ? `/users?email=${encodeURIComponent(email)}` : '/users';
      const response = await apiClient.get<User[]>(url);

      // For simulation, if we have users, we check the first match
      // If no credentials provided, we fall back to the first user (for demo purposes)
      const user = response.data[0];

      if (!user) {
        throw new Error('Invalid email or password');
      }

      await AuthService.saveUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password?: string): Promise<User> => {
    try {
      // Check if user already exists
      const existing = await apiClient.get<User[]>(`/users?email=${encodeURIComponent(email)}`);
      if (existing.data.length > 0) {
        throw new Error('User with this email already exists');
      }

      const newUser: Partial<User> = {
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: 'New EcoAction member!',
        totalMissionsCompleted: 0,
        activeMissionsCount: 0,
      };

      const response = await apiClient.post<User>('/users', newUser);
      const user = response.data;

      await AuthService.saveUser(user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Save user error:', error);
    }
  },
};
