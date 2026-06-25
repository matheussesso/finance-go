/**
 * @file App.jsx
 * @description Main application routing component.
 * Configures the React Router and wraps the application with global providers (Theme, Auth).
 */

import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

/**
 * Component to protect private routes.
 * If the user is not authenticated, redirects to the login page.
 * Equivalent to Laravel's 'auth' middleware on routes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Components to render if authenticated
 * @returns {React.ReactElement} The protected component or a Navigate component
 */
function PrivateRoute({ children }) {
  const { t } = useTranslation();
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#22272e] flex items-center justify-center text-gray-800 dark:text-white transition-colors duration-300">{t('dashboard.loading')}</div>;
  }

  return signed ? children : <Navigate to="/login" />;
}

/**
 * Main routing component that defines the application's URL paths.
 * 
 * @returns {React.ReactElement} The configured routes
 */
function RoutesApp() {
  const { signed } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={signed ? <Navigate to="/" /> : <Login />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

/**
 * Root application component.
 * Wraps the routing system with context providers.
 * 
 * @returns {React.ReactElement} The wrapped application
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <RoutesApp />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
