import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FormUsuario.css';

function EditarUsuario({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchUsuario();
  }, [id]);

  const fetchUsuario = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/usuarios/${id}`);
      setFormData({
        nombre: response.data.nombre,
        email: response.data.email,
        telefono: response.data.telefono || ''
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      alert('Error al cargar usuario');
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`http://localhost:5001/api/usuarios/${id}`, formData);
      alert('Usuario actualizado exitosamente');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      setError(err.response?.data?.error || 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  if (loadingData) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="form-page-container">
      <header className="form-header">
        <div>
          <h1>TechCorp Solutions</h1>
          <p>Gestión de Usuarios</p>
        </div>
        <div className="user-info">
          <span>Bienvenido, {user.nombre}</span>
          <button onClick={handleLogoutClick} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="form-content">
        <div className="form-card">
          <div className="form-card-header">
            <h2>Editar Usuario</h2>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn-back"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleSubmit} className="usuario-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="3001234567"
              />
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarUsuario;