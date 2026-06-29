const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const store = require('../data/store');

// GET /api/productos — todos los usuarios autenticados
router.get('/', authenticate, (req, res) => {
    res.json(store.productos);
});

// GET /api/productos/:id — todos los usuarios autenticados
router.get('/:id', authenticate, (req, res) => {
    const producto = store.productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
});

// POST /api/productos — solo ADMIN
router.post('/', authenticate, requireRole('ADMIN'), (req, res) => {
    const { nombre, precio } = req.body;
    if (!nombre || precio == null) {
        return res.status(400).json({ error: 'nombre y precio son requeridos' });
    }
    const producto = { id: store.nextProductoId(), nombre, precio: Number(precio) };
    store.productos.push(producto);
    res.status(201).json(producto);
});

// PUT /api/productos/:id — solo ADMIN
router.put('/:id', authenticate, requireRole('ADMIN'), (req, res) => {
    const idx = store.productos.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const { nombre, precio } = req.body;
    if (!nombre || precio == null) {
        return res.status(400).json({ error: 'nombre y precio son requeridos' });
    }
    store.productos[idx] = { ...store.productos[idx], nombre, precio: Number(precio) };
    res.json(store.productos[idx]);
});

// DELETE /api/productos/:id — solo ADMIN
router.delete('/:id', authenticate, requireRole('ADMIN'), (req, res) => {
    const idx = store.productos.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    store.productos.splice(idx, 1);
    res.status(204).end();
});

module.exports = router;
