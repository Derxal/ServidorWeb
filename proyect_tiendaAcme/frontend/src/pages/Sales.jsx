import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const newItem = () => ({ productoId: '', cantidad: 1 })

export default function Sales() {
  const { auth } = useAuth()
  const isAdmin = auth?.role === 'ADMIN'

  const [ventas,    setVentas]    = useState([])
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [items,     setItems]     = useState([newItem()])
  const [saleError, setSaleError] = useState('')
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    Promise.all([api.get('/api/ventas'), api.get('/api/productos')])
      .then(([vR, pR]) => { setVentas(vR.data); setProducts(pR.data) })
      .finally(() => setLoading(false))
  }, [])

  function openModal() { setItems([newItem()]); setSaleError(''); setShowModal(true) }

  function addItem()            { setItems(prev => [...prev, newItem()]) }
  function removeItem(i)        { setItems(prev => prev.filter((_, j) => j !== i)) }
  function updateItem(i, k, v)  { setItems(prev => prev.map((it, j) => j === i ? { ...it, [k]: v } : it)) }

  function calcTotal() {
    return items.reduce((sum, it) => {
      const p = products.find(p => p.id === Number(it.productoId))
      return sum + (p ? p.precio * Number(it.cantidad) : 0)
    }, 0)
  }

  async function createSale() {
    setSaleError('')
    const payload = items.map(it => ({ productoId: Number(it.productoId), cantidad: Number(it.cantidad) }))
    if (payload.some(it => !it.productoId || it.cantidad < 1)) {
      setSaleError('Selecciona producto y cantidad válida en cada ítem')
      return
    }
    setSaving(true)
    try {
      await api.post('/api/ventas', { items: payload })
      const r = await api.get('/api/ventas')
      setVentas(r.data)
      setShowModal(false)
    } catch (err) {
      setSaleError(err.response?.data?.error || 'Error al crear la venta')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">{isAdmin ? 'Todas las ventas' : 'Mis ventas'}</h5>
        {!isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={openModal}>
            <i className="bi bi-cart-plus me-1"></i>Nueva venta
          </button>
        )}
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>#</th>
                {isAdmin && <th>Email</th>}
                <th>Fecha</th>
                <th>Ítems</th>
                <th className="text-end">Total</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id}>
                  <td className="text-muted">{v.id}</td>
                  {isAdmin && <td className="small text-muted">{v.email}</td>}
                  <td className="small">{new Date(v.fecha).toLocaleString('es')}</td>
                  <td>{v.items.length} prod.</td>
                  <td className="text-end fw-semibold">S/ {v.total.toFixed(2)}</td>
                  <td className="small text-muted" style={{ maxWidth: 200 }}>
                    {v.items.map(i => `${i.nombre} ×${i.cantidad}`).join(' · ')}
                  </td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center text-muted py-4">
                    Sin ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nueva venta */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nueva venta</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                {saleError && <div className="alert alert-danger py-2 small">{saleError}</div>}

                {items.map((item, i) => (
                  <div key={i} className="d-flex gap-2 mb-2 align-items-center">
                    <select
                      className="form-select form-select-sm flex-grow-1"
                      value={item.productoId}
                      onChange={e => updateItem(i, 'productoId', e.target.value)}
                    >
                      <option value="">— Seleccionar producto —</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} — S/ {Number(p.precio).toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number" min="1" className="form-control form-control-sm"
                      style={{ width: 72 }} value={item.cantidad}
                      onChange={e => updateItem(i, 'cantidad', e.target.value)}
                    />
                    {items.length > 1 && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(i)}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                ))}

                <button className="btn btn-sm btn-outline-secondary mt-1" onClick={addItem}>
                  <i className="bi bi-plus me-1"></i>Agregar ítem
                </button>

                {calcTotal() > 0 && (
                  <div className="mt-3 text-end fw-bold text-success">
                    Total: S/ {calcTotal().toFixed(2)}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={createSale} disabled={saving}>
                  {saving && <span className="spinner-border spinner-border-sm me-1" />}
                  Confirmar venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
