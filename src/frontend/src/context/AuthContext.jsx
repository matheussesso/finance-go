import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When the page loads, check if the user was already logged in (saved in LocalStorage)
    const storedUser = localStorage.getItem('@FinanceGo:user');
    const storedToken = localStorage.getItem('@FinanceGo:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  async function signIn(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;

    localStorage.setItem('@FinanceGo:user', JSON.stringify(user));
    localStorage.setItem('@FinanceGo:token', token);

    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('@FinanceGo:user');
    localStorage.removeItem('@FinanceGo:token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
