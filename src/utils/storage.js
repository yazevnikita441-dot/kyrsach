export const STORAGE_KEYS = {
  users: 'course_compare_users',
  currentUser: 'course_compare_current_user',
  products: 'course_compare_products',
  seededUsers: 'course_compare_seeded_users',
};

export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function createId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
