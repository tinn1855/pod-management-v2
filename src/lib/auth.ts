import { STORAGE_KEYS } from './constants';
import type { User } from '@/types/auth.types';

// Helper to get storage based on rememberMe preference
function getStorage(rememberMe: boolean = true): Storage {
  return rememberMe ? localStorage : sessionStorage;
}

// Helper to get from either storage (check localStorage first, then sessionStorage)
function getFromStorage(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

// Helper to remove from both storages
function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

export const authUtils = {
  getAccessToken: (): string | null => {
    return getFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return getFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getTempToken: (): string | null => {
    return getFromStorage(STORAGE_KEYS.TEMP_TOKEN);
  },

  getUser: (): User | null => {
    const userStr = getFromStorage(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: User,
    rememberMe: boolean = true
  ): void => {
    const storage = getStorage(rememberMe);
    
    // Clear from both storages first
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    
    // Set in appropriate storage
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  setTempToken: (tempToken: string, user: User, rememberMe: boolean = true): void => {
    const storage = getStorage(rememberMe);
    
    // Clear from both storages first
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    
    // Store tempToken separately
    storage.setItem(STORAGE_KEYS.TEMP_TOKEN, tempToken);
    // Use tempToken as accessToken temporarily
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tempToken);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearAuth: (): void => {
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getAccessToken();
  },
};

