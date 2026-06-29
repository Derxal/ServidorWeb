import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Users() {
  const { auth } = useAuth()
  const navigate  = useNavigate()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (auth?.role !== 'ADMIN') { navigate('/dashboard'); return }
    fetchUsers()
  }, [])

  function fetchUsers() {
    setLoading(true)
    api.get('/api/users')
      .then(r => setUsers(r.data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false))
  }

  async function changeRole(id, role) {
    await api.put(`/api/users/${id}/role`, { role })
    fetchUsers()
  }

  async function toggleActive(id) {
    await api.put(`/api/users/${id}/active`)
    fetchUsers()
  }

  async function revokeSessions(id) {
    if (!window.confirm('¿Revocar todas las sesiones activas de este usuario?')) return
    await api.delete(`/api/users/${id}/sessions`)
    fetchUsers()
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (error)   return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Usuarios</h5>
        <span className="text-muted small">{users.length} registros</span>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email / Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Sesiones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="text-muted">{u.id}</td>
                  <td className="fw-semibold">{u.name} {u.lastName}</td>
                  <td className="text-muted small">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.active ? 'bg-success' : 'bg-secondary'}`}>
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{u.activeSessions}</td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {/* Cambio de rol */}
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>

                      {/* Activar / Desactivar */}
                      <button
                        className={`btn btn-sm ${u.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        onClick={() => toggleActive(u.id)}
                        title={u.active ? 'Desactivar' : 'Activar'}
                      >
                        <i className={`bi ${u.active ? 'bi-person-slash' : 'bi-person-check'}`}></i>
                      </button>

                      {/* Revocar sesiones */}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => revokeSessions(u.id)}
                        disabled={u.activeSessions === 0}
                        title="Revocar sesiones"
                      >
                        <i className="bi bi-key-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
