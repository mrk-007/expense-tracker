export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_USER_INFO: '/api/auth/me',
    UPDATE_AVATAR: '/api/auth/avatar',
  },
  TRANSACTIONS: {
    GET_ALL: '/api/transactions',
    ADD: '/api/transactions',
    DELETE: (id) => `/api/transactions/${id}`,
    DOWNLOAD_CSV: '/api/transactions/download-csv',
    SUMMARY: '/api/transactions/summary',
  },
};
