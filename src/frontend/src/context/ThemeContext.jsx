import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({});

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

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
