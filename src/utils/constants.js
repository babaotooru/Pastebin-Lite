// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Routes
export const ROUTES = {
  HOME: '/',
  CREATED: '/created',
  VIEW_PASTE: '/p/:id',
  EXPIRED: '/expired',
  NOT_FOUND: '/404',
};

// Default values
export const DEFAULT_TTL_SECONDS = 3600; // 1 hour
export const DEFAULT_MAX_VIEWS = null;

