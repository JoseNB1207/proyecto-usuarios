import React, { useState, useEffect } from 'react';
import axios from 'axios';


function UserCRUD({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '123456'
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener todos los usuarios
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

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Abrir modal para crear usuario
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '123456'
    });
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono || ''
    });
    setShowModal(true);
  };

  // Guardar usuario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Actualizar usuario existente
        await axios.put(
          `http://localhost:5001/api/usuarios/${editingUser.id}`,
          formData
        );
        alert('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await axios.post(
          'http://localhost:5001/api/usuarios',
          formData
        );
        alert('Usuario creado exitosamente');
      }
      
      setShowModal(false);
      fetchUsers(); // Recargar lista
      
    } catch (err) {
      console.error('Error al guardar:', err);
      alert(err.response?.data?.error || 'Error al guardar usuario');
    }
  };

  // Eliminar usuario
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      try {
        await axios.delete(`http://localhost:5001/api/usuarios/${id}`);
        alert('Usuario eliminado exitosamente');
        fetchUsers(); // Recargar lista
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar usuario');
      }
    }
  };

  // Cerrar sesión
  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="crud-container">
      {/* Header */}
      <header className="crud-header">
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

      {/* Contenido principal */}
      <div className="crud-content">
        <div className="crud-actions">
          <h2>Lista de Usuarios ({users.length})</h2>
          <button onClick={handleCreate} className="btn-primary">
            + Nuevo Usuario
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {/* Tabla de usuarios */}
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
                        onClick={() => handleEdit(usuario)}
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

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="btn-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="3001234567"
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Contraseña por defecto: 123456"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserCRUD;