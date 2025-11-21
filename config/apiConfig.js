/**
 * Backend API Configuration
 * This file contains API endpoint configurations and constants
 */

export const API_CONFIG = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
  
  // API Routes
  ROUTES: {
    AUTH: '/api/auth',
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    GET_CURRENT_USER: '/api/auth/me',
  },
  
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Cookie Configuration
  COOKIE: {
    TOKEN_NAME: 'token',
    USER_NAME: 'user',
    MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict',
  },
  
  // CORS Configuration
  CORS: {
    ORIGIN: process.env.FRONTEND_URL || 'http://localhost:5173',
    CREDENTIALS: true,
  },
  
  // Data Storage
  DATA: {
    USERS_FILE: './data/users.json',
  },
};

export default API_CONFIG;

