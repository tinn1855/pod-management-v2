export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TEMP_TOKEN: 'tempToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  TEAMS: '/teams',
  USERS: '/users',
  BOARDS: '/boards',
  CHANGE_PASSWORD: '/change-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_TOTAL_TO_SHOW_SELECTOR: 10,
  API_MAX_LIMIT: 100,
  LIMIT_OPTIONS: [10, 20, 50, 100] as const,
  PAGES_AROUND: 2,
} as const;

// Filter constants
export const FILTER_VALUES = {
  ALL: 'all',
  NO_TEAM: 'no-team',
} as const;

// Debounce constants
export const DEBOUNCE = {
  SEARCH_DELAY: 500,
} as const;

// User status constants
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
} as const;
