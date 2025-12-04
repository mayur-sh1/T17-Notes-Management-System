import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL, STORAGE_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ error: string }>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = '/login';
        }

        const message = error.response?.data?.error || error.message || 'An error occurred';
        toast.error(message);
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.api;
  }

  // Auth
  async register(email: string, username: string, password: string) {
    const response = await this.api.post('/auth/register', {
      email,
      username,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getMe() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Notes
  async getNotes(params?: any) {
    const response = await this.api.get('/notes', { params });
    return response.data;
  }

  async getNoteById(id: string) {
    const response = await this.api.get(`/notes/${id}`);
    return response.data;
  }

  async createNote(data: { title: string; content: string; isRichText?: boolean; tagIds?: string[] }) {
    const response = await this.api.post('/notes', data);
    return response.data;
  }

  async updateNote(id: string, data: { title?: string; content?: string; tagIds?: string[] }) {
    const response = await this.api.put(`/notes/${id}`, data);
    return response.data;
  }

  async deleteNote(id: string) {
    const response = await this.api.delete(`/notes/${id}`);
    return response.data;
  }

  async getVersionHistory(id: string, limit?: number) {
    const response = await this.api.get(`/notes/${id}/versions`, {
      params: { limit },
    });
    return response.data;
  }

  // Tags
  async getTags() {
    const response = await this.api.get('/tags');
    return response.data;
  }

  async createTag(name: string, color?: string) {
    const response = await this.api.post('/tags', { name, color });
    return response.data;
  }

  async getTagByName(name: string) {
    const response = await this.api.get(`/tags/${name}`);
    return response.data;
  }

  // Sharing
  async shareNote(data: { noteId: string; userId?: string; groupId?: string; permission: string }) {
    const response = await this.api.post('/sharing/share', data);
    return response.data;
  }

  async getSharedNotes() {
    const response = await this.api.get('/sharing/shared-with-me');
    return response.data;
  }

  async updateSharePermission(id: string, permission: string) {
    const response = await this.api.put(`/sharing/${id}/permission`, { permission });
    return response.data;
  }

  async unshareNote(id: string) {
    const response = await this.api.delete(`/sharing/${id}`);
    return response.data;
  }

  // Groups
  async getGroups() {
    const response = await this.api.get('/groups');
    return response.data;
  }

  async getGroupById(id: string) {
    const response = await this.api.get(`/groups/${id}`);
    return response.data;
  }

  async createGroup(name: string, description?: string) {
    const response = await this.api.post('/groups', { name, description });
    return response.data;
  }

  async updateGroup(id: string, data: { name?: string; description?: string }) {
    const response = await this.api.put(`/groups/${id}`, data);
    return response.data;
  }

  async addMember(groupId: string, userId: string, role?: string) {
    const response = await this.api.post(`/groups/${groupId}/members`, { userId, role });
    return response.data;
  }

  async removeMember(groupId: string, userId: string) {
    const response = await this.api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  }

  // Notifications
  async getNotifications(limit?: number) {
    const response = await this.api.get('/notifications', {
      params: { limit },
    });
    return response.data;
  }

  async getUnreadCount() {
    const response = await this.api.get('/notifications/unread-count');
    return response.data;
  }

  async markAsRead(id: string) {
    const response = await this.api.put(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await this.api.put('/notifications/read-all');
    return response.data;
  }

  async deleteNotification(id: string) {
    const response = await this.api.delete(`/notifications/${id}`);
    return response.data;
  }

  // Admin
  async getAllUsers(page?: number, limit?: number) {
    const response = await this.api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  }

  async updateUserRole(userId: string, role: string) {
    const response = await this.api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  async getSystemStats() {
    const response = await this.api.get('/admin/stats');
    return response.data;
  }

  async getAllGroups(page?: number, limit?: number) {
    const response = await this.api.get('/admin/groups', {
      params: { page, limit },
    });
    return response.data;
  }

  async getUsageReports(startDate?: string, endDate?: string) {
    const response = await this.api.get('/admin/reports', {
      params: { startDate, endDate },
    });
    return response.data;
  }
}

export default new ApiService();

