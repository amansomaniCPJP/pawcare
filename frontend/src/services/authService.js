// ============================================================
// AUTH SERVICE — Mock implementation
// In production: replace with real JWT/OAuth flows.
// DEMO CREDENTIALS:
//   User:  sarah@example.com / password123
//   Admin: admin@pawhaven.com / admin123
// ============================================================
import { MOCK_USERS, delay } from './mock/data.js';

const STORAGE_KEY = 'pawhaven_user';

let _currentUser = null;

// Restore session from storage on module load
const stored = localStorage.getItem(STORAGE_KEY);
if (stored) {
  try { _currentUser = JSON.parse(stored); } catch {}
}

export const authService = {
  getCurrentUser() {
    return _currentUser;
  },

  isAuthenticated() {
    return _currentUser !== null;
  },

  async login(email, password) {
    await delay(800);
    // Demo credentials check
    const validCredentials = {
      'sarah@example.com': 'password123',
      'marcus@example.com': 'password123',
      'emma@example.com': 'password123',
      'james@example.com': 'password123',
      'admin@pawhaven.com': 'admin123',
    };

    if (!validCredentials[email] || validCredentials[email] !== password) {
      throw new Error('Invalid email or password. Use sarah@example.com / password123 for demo.');
    }

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    _currentUser = { ...user, token: `mock-jwt-${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_currentUser));
    return _currentUser;
  },

  async register(name, email, password) {
    await delay(900);
    if (MOCK_USERS.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
    };
    _currentUser = { ...newUser, token: `mock-jwt-${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_currentUser));
    return _currentUser;
  },

  async logout() {
    await delay(200);
    _currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
  },

  async sendPasswordReset(email) {
    await delay(700);
    // Always succeed to avoid leaking whether an account exists
    return { message: 'If an account exists for this email, a reset link has been sent.' };
  },

  async resetPassword(token, newPassword) {
    await delay(700);
    return { message: 'Password reset successfully.' };
  },
};
