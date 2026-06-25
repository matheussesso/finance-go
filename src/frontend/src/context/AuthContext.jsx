/**
 * @file AuthContext.jsx
 * @description Provides authentication state and methods to the entire React application.
 * Equivalent to Laravel's Session/Auth facade, handling the logged-in user state.
 */

import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 */

/**
 * @typedef {Object} AuthContextData
 * @property {boolean} signed - Indicates if the user is currently authenticated
 * @property {User|null} user - The authenticated user's data
 * @property {boolean} loading - Indicates if the authentication state is being restored
 * @property {function(string, string): Promise<void>} signIn - Authenticates a user with email and password
 * @property {function(): void} signOut - Clears user session and logs out
 */

export const AuthContext = createContext({});

/**
 * AuthProvider component that wraps the app and provides the AuthContext.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to receive the context
 */
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

  /**
   * Signs in the user.
   * Equivalent to Laravel's Auth::attempt().
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  async function signIn(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;

    localStorage.setItem('@FinanceGo:user', JSON.stringify(user));
    localStorage.setItem('@FinanceGo:token', token);

    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(user);
  }

  /**
   * Signs out the user and clears local storage.
   * Equivalent to Laravel's Auth::logout().
   */
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
