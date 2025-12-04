import { STORAGE_KEYS } from '../utils/constants';
import api from './api';
import { User } from '../types';

export class AuthService {
  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static setAuth(user: User, token: string) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  static async register(email: string, username: string, password: string) {
    const response = await api.register(email, username, password);
    if (response.user && response.token) {
      this.setAuth(response.user, response.token);
    }
    return response;
  }

  static async login(email: string, password: string) {
    const response = await api.login(email, password);
    if (response.user && response.token) {
      this.setAuth(response.user, response.token);
    }
    return response;
  }

  static logout() {
    this.clearAuth();
    window.location.href = '/login';
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

