/**
 * @file ThemeContext.jsx
 * @description Manages the application's light/dark theme state.
 * Syncs the theme preference with localStorage and applies the corresponding CSS class to the HTML root.
 */

import { createContext, useState, useEffect } from 'react';

/**
 * @typedef {Object} ThemeContextData
 * @property {string} theme - The current theme ('light' or 'dark')
 * @property {function(): void} toggleTheme - Function to toggle between light and dark modes
 */

export const ThemeContext = createContext({});

/**
 * ThemeProvider component that wraps the app and provides the ThemeContext.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to receive the context
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Fetch saved preference or fallback to system preference
    const storedTheme = localStorage.getItem('@FinanceGo:theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('@FinanceGo:theme', theme);
  }, [theme]);

  /**
   * Toggles the current theme.
   */
  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
