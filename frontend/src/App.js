import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './register';
import Dashboard from './Dashboard';
import CrearUsuario from './CrearUsuario';
import EditarUsuario from './EditarUsuario';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario guardado al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Manejar login exitoso
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Manejar logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Componente para proteger rutas privadas
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div className="loading">Cargando...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  // Componente para rutas públicas (redirige si ya está logueado)
  const PublicRoute = ({ children }) => {
    if (loading) {
      return <div className="loading">Cargando...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login onLoginSuccess={handleLoginSuccess} />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register onRegisterSuccess={handleLoginSuccess} />
              </PublicRoute>
            } 
          />

          {/* Rutas privadas (requieren autenticación) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard user={currentUser} onLogout={handleLogout} />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/usuarios/crear" 
            element={
              <PrivateRoute>
                <CrearUsuario user={currentUser} onLogout={handleLogout} />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/usuarios/editar/:id" 
            element={
              <PrivateRoute>
                <EditarUsuario user={currentUser} onLogout={handleLogout} />
              </PrivateRoute>
            } 
          />

          {/* Ruta para URLs no encontradas */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;