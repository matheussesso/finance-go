import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

// Componente para proteger a rota do Dashboard
function PrivateRoute({ children }) {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white">Carregando...</div>;
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
    <AuthProvider>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
