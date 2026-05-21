/**
 * ─── authService ────────────────────────────────────────────────────────────
 * Wraps the backend auth endpoints. AuthContext is the only consumer.
 *
 * Expected backend endpoints:
 *   POST /api/auth/login   body: { id, password }  → { account, token }
 *   POST /api/auth/logout  no body                 → 204
 *   GET  /api/auth/me                              → Account
 *
 * Frontend stores the token via apiClient.setToken(); subsequent calls send it
 * as Authorization: Bearer <token>.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { Account, LoginRequest, LoginResponse } from '../types/authTypes';
import { request, setToken, ApiError, DEMO_MODE } from './apiClient';
import { demoLogin } from './demoData';

export async function login(username: string, password: string): Promise<Account | null> {
  if (DEMO_MODE) {
    const account = demoLogin(username, password);
    if (account) { setToken('demo-token'); return account; }
    return null;
  }
  try {
    const body: LoginRequest = { username, password };
    const res = await request<LoginResponse>('/auth/login', { method: 'POST', body, noAuth: true });
    setToken(res.token);
    return res.account;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return null; // bad credentials
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  if (DEMO_MODE) { setToken(null); return; }
  try {
    await request<void>('/auth/logout', { method: 'POST' });
  } catch {
    // Ignore network failures on logout; we always clear the local token.
  } finally {
    setToken(null);
  }
}

export async function getCurrentUser(): Promise<Account | null> {
  if (DEMO_MODE) return null; // in demo mode the cached account is the source of truth
  try {
    return await request<Account>('/auth/me');
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      setToken(null);
      return null;
    }
    throw err;
  }
}
