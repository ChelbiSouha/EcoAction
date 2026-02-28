import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Use the local network IP address to support physical devices
  return 'http://192.168.1.194:3000';
};

export const API_URL = getBaseUrl();

export const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
  retry: 1,
};
