import { api } from './apiClient.js';

export async function register({ username, email, password }) {
  const res = await api.post('/auth/register', { username, email, password });
  // { message }
  return res.data;
}

export async function login({ usernameOrEmail, password }) {
  const res = await api.post('/auth/login', { usernameOrEmail, password });
  // { token }
  return res.data;
}

