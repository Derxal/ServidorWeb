import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = auth?.role === 'ADMIN'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="d-flex">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <i className="bi bi-shield-lock-fill"></i>
          <span>TiendaAcme</span>
        </div>
        <hr className="sidebar-hr" />

        <span className="sidebar-section">General</span>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </NavLink>
          </li>
        </ul>

        <span className="sidebar-section">Gestión</span>
        <ul className="nav flex-column mb-2">
          {isAdmin && (
            <li className="nav-item">
              <NavLink to="/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <i className="bi bi-people me-2"></i>Usuarios
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <i className="bi bi-box-seam me-2"></i>Productos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sales" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <i className="bi bi-cart me-2"></i>Ventas
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto">
          <hr className="sidebar-hr" />
          <button onClick={handleLogout} className="nav-link btn btn-link text-start w-100 border-0 px-3"
            style={{ color: '#a8b2d8' }}>
            <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="main-content flex-grow-1">
        <div className="topbar">
          <span className="fw-semibold">{auth?.name}</span>
          <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
            {auth?.role}
          </span>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
