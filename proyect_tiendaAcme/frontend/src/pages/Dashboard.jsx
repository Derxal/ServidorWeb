import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function StatCard({ icon, label, value, color }) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className="card stat-card shadow-sm h-100">
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`stat-icon bg-${color}-subtle text-${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>
          <div>
            <div className="text-muted small">{label}</div>
            <div className="fs-4 fw-bold">{value ?? <span className="spinner-border spinner-border-sm" />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { auth } = useAuth()
  const isAdmin = auth?.role === 'ADMIN'
  const [stats,  setStats]  = useState(null)
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    if (isAdmin) api.get('/api/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/api/ventas').then(r => setVentas(r.data)).catch(() => {})
  }, [isAdmin])

  const totalGastado = ventas.reduce((s, v) => s + v.total, 0)

  return (
    <>
      <h5 className="fw-bold mb-4">Dashboard</h5>

      <div className="row g-3 mb-4">
        {isAdmin ? (
          <>
            <StatCard icon="bi-people"       label="Usuarios totales"  value={stats?.totalUsers}     color="primary" />
            <StatCard icon="bi-person-check" label="Usuarios activos"  value={stats?.activeUsers}    color="success" />
            <StatCard icon="bi-shield-check" label="Administradores"   value={stats?.adminCount}     color="warning" />
            <StatCard icon="bi-key"          label="Sesiones activas"  value={stats?.activeSessions} color="info"    />
          </>
        ) : (
          <>
            <StatCard icon="bi-cart-check" label="Mis ventas"    value={ventas.length}             color="primary" />
            <StatCard icon="bi-cash-stack" label="Total gastado" value={`S/ ${totalGastado.toFixed(2)}`} color="success" />
          </>
        )}
      </div>

      <h6 className="fw-semibold mb-3">{isAdmin ? 'Últimas ventas' : 'Mis últimas ventas'}</h6>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>#</th>
                {isAdmin && <th>Email</th>}
                <th>Fecha</th>
                <th>Ítems</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.slice(0, 5).map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  {isAdmin && <td className="text-muted small">{v.email}</td>}
                  <td>{new Date(v.fecha).toLocaleString('es')}</td>
                  <td>{v.items.length} prod.</td>
                  <td className="text-end fw-semibold">S/ {v.total.toFixed(2)}</td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center text-muted py-4">
                    Sin ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
