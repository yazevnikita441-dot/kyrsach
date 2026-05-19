import { createContext, useContext, useMemo, useState } from 'react';
import { createId, normalizeEmail, readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, []));
  const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.currentUser, null));

  function register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const exists = users.some((user) => user.email === normalizedEmail);

    if (exists) {
      return { ok: false, message: 'Пользователь с таким e-mail уже существует' };
    }

    const user = {
      id: createId('user'),
      name: name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password,
    };

    const nextUsers = [...users, user];
    setUsers(nextUsers);
    writeStorage(STORAGE_KEYS.users, nextUsers);

    const sessionUser = { id: user.id, name: user.name, email: user.email };
    setCurrentUser(sessionUser);
    writeStorage(STORAGE_KEYS.currentUser, sessionUser);

    return { ok: true };
  }

  function login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((item) => item.email === normalizedEmail && item.password === password);

    if (!user) {
      return { ok: false, message: 'Неверный e-mail или пароль' };
    }

    const sessionUser = { id: user.id, name: user.name, email: user.email };
    setCurrentUser(sessionUser);
    writeStorage(STORAGE_KEYS.currentUser, sessionUser);
    return { ok: true };
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }

  const value = useMemo(() => ({
    users,
    currentUser,
    isAuthenticated: Boolean(currentUser),
    register,
    login,
    logout,
  }), [users, currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
