export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const STORAGE_KEYS = {
  TOKEN: 'notes_auth_token',
  USER: 'notes_user',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOTES: '/notes',
  SHARED: '/shared',
  GROUPS: '/groups',
  TAGS: '/tags',
  ADMIN: '/admin',
} as const;

export const PERMISSIONS = {
  READ: 'READ',
  WRITE: 'WRITE',
  DELETE: 'DELETE',
  ADMIN: 'ADMIN',
} as const;

