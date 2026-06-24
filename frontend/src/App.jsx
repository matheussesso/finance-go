import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

// Componente para proteger a rota do Dashboard
function PrivateRoute({ children }) {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0B] flex items-center justify-center text-gray-800 dark:text-white transition-colors duration-300">Carregando...</div>;
  }

  return signed ? children : <Navigate to="/login" />;
}

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
