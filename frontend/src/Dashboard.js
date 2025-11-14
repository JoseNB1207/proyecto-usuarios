import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/usuarios');
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      try {
        await axios.delete(`http://localhost:5001/api/usuarios/${id}`);
        alert('Usuario eliminado exitosamente');
        fetchUsers();
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Kase</h1>
        </div>
        <div className="user-info">
          <span>Bienvenido, {user.nombre}</span>
          <button onClick={handleLogoutClick} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <h2>Lista de Usuarios ({users.length})</h2>
          <button 
            onClick={() => navigate('/usuarios/crear')} 
            className="btn-primary"
          >
            + Nuevo Usuario
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono || 'N/A'}</td>
                  <td>
                    {new Date(usuario.fecha_registro).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
                        className="btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id, usuario.nombre)}
                        className="btn-delete"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;