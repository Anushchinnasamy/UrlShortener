import axios from 'axios';
import { getToken, clearToken } from './storage.js';

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured && configured.trim()) return configured.trim();

  // When running Vite dev server on localhost, rely on proxy (/auth, /api).
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const port = typeof window !== 'undefined' ? window.location.port : '';
  const isLocalDevProxy =
    (host === 'localhost' || host === '127.0.0.1') && (port === '5173' || port === '4173');

  if (isLocalDevProxy) return '';

  // Fallback for static frontend runs without proxy.
  return 'http://localhost:8080';
}

export const API_BASE_URL = resolveApiBaseUrl();
const IS_DEV = Boolean(import.meta.env.DEV);

if (IS_DEV) {
  // Diagnostics to confirm which mode frontend is using.
  // Empty base means Vite proxy mode.
  console.info('[api] baseURL:', API_BASE_URL || '(vite proxy)');
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const method = String(err?.config?.method || '').toLowerCase();
    const canRetryMethod = method === 'get';
    const status = err?.response?.status;
    const isRetryableStatus = typeof status === 'number' && (status >= 500 || status === 429);
    const isNetworkOrTimeout = err?.code === 'ECONNABORTED' || err?.message === 'Network Error' || !err?.response;

    if (canRetryMethod && isNetworkOrTimeout || (canRetryMethod && isRetryableStatus)) {
      const alreadyRetried = Boolean(err?.config?._retried);
      if (!alreadyRetried && err?.config) {
        err.config._retried = true;
        await new Promise((resolve) => window.setTimeout(resolve, 350));
        return api.request(err.config);
      }
    }

    // If token is invalid/expired, reset and let UI redirect.
    if (err?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(err);
  }
);

export function getApiErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Please ensure backend is running and reachable on port 8080.';
  }

  if (error?.message === 'Network Error' || !error?.response) {
    return 'Network error: could not reach backend API. Check VITE_API_BASE_URL or run backend at http://localhost:8080.';
  }

  const data = error?.response?.data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  if (typeof error?.message === 'string' && error.message.trim()) return error.message;
  return 'Something went wrong';
}

export function getBackendHealthUrl() {
  return API_BASE_URL ? `${API_BASE_URL}/actuator/health` : '/actuator/health';
}

export async function checkBackendHealth() {
  const healthUrl = getBackendHealthUrl();
  const res = await axios.get(healthUrl, { timeout: 5000 });
  return res.data;
}

