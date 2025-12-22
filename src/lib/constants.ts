export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TEMP_TOKEN: 'tempToken',
  USER: 'user',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  TEAMS: '/teams',
  USERS: '/users',
  CHANGE_PASSWORD: '/change-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

