import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const EMPTY = { nombre: '', precio: '' }

export default function Products() {
  const { auth } = useAuth()
  const isAdmin = auth?.role === 'ADMIN'

  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [editing,    setEditing]    = useState(null)
  const [form,       setForm]       = useState(EMPTY)
  const [formError,  setFormError]  = useState('')
  const [saving,     setSaving]     = useState(false)

  useEffect(() => { fetchProducts() }, [])

  function fetchProducts() {
    api.get('/api/productos').then(r => setProducts(r.data)).finally(() => setLoading(false))
  }

  function openAdd()   { setEditing(null); setForm(EMPTY); setFormError(''); setShowModal(true) }
  function openEdit(p) { setEditing(p); setForm({ nombre: p.nombre, precio: String(p.precio) }); setFormError(''); setShowModal(true) }

  async function save() {
    if (!form.nombre.trim() || !form.precio) { setFormError('Nombre y precio son requeridos'); return }
    setSaving(true)
    try {
      const body = { nombre: form.nombre.trim(), precio: Number(form.precio) }
      if (editing) await api.put(`/api/productos/${editing.id}`, body)
      else          await api.post('/api/productos', body)
      setShowModal(false)
      fetchProducts()
    } catch {
      setFormError('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    await api.delete(`/api/productos/${id}`)
    fetchProducts()
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Productos</h5>
        {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i>Nuevo producto
          </button>
        )}
      </div>

      {/* Admin → tabla; User → cards */}
      {isAdmin ? (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead>
                <tr><th>#</th><th>Nombre</th><th className="text-end">Precio</th><th></th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="text-muted">{p.id}</td>
                    <td className="fw-semibold">{p.nombre}</td>
                    <td className="text-end">S/ {Number(p.precio).toFixed(2)}</td>
                    <td>
                      <div className="d-flex gap-1 justify-content-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(p)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-muted py-4">Sin productos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {products.map(p => (
            <div key={p.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card shadow-sm h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-box-seam text-primary" style={{ fontSize: '2.5rem' }}></i>
                  <h6 className="mt-2 fw-semibold">{p.nombre}</h6>
                  <p className="text-success fw-bold mb-0">S/ {Number(p.precio).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Editar producto' : 'Nuevo producto'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} autoFocus />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio (S/)</label>
                  <input type="number" step="0.01" min="0" className="form-control" value={form.precio}
                    onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving && <span className="spinner-border spinner-border-sm me-1" />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
