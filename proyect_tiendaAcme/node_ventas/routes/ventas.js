const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const store = require('../data/store');

// GET /api/ventas
//   USER  → solo sus propias ventas (filtra por userId del JWT)
//   ADMIN → todas las ventas
router.get('/', authenticate, (req, res) => {
    const { userId, role } = req.user;
    const result = role === 'ADMIN'
        ? store.ventas
        : store.ventas.filter(v => v.userId === userId);
    res.json(result);
});

// GET /api/ventas/:id
//   USER  → solo si la venta le pertenece
//   ADMIN → cualquier venta
router.get('/:id', authenticate, (req, res) => {
    const venta = store.ventas.find(v => v.id === parseInt(req.params.id));
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    if (req.user.role !== 'ADMIN' && venta.userId !== req.user.userId) {
        return res.status(403).json({ error: 'No autorizado' });
    }
    res.json(venta);
});

// POST /api/ventas — cualquier usuario autenticado puede crear una venta
// Body: { items: [{ productoId: number, cantidad: number }] }
router.post('/', authenticate, (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items es requerido y no puede estar vacío' });
    }

    let total = 0;
    const lineItems = [];

    for (const item of items) {
        if (!item.productoId || !item.cantidad || item.cantidad < 1) {
            return res.status(400).json({ error: 'Cada item requiere productoId y cantidad >= 1' });
        }
        const producto = store.productos.find(p => p.id === item.productoId);
        if (!producto) {
            return res.status(400).json({ error: `Producto ${item.productoId} no encontrado` });
        }
        const subtotal = producto.precio * item.cantidad;
        total += subtotal;
        lineItems.push({
            productoId: producto.id,
            nombre: producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: producto.precio,
            subtotal
        });
    }

    const venta = {
        id: store.nextVentaId(),
        userId: req.user.userId,
        email: req.user.sub,
        items: lineItems,
        total,
        fecha: new Date().toISOString()
    };

    store.ventas.push(venta);
    res.status(201).json(venta);
});

module.exports = router;
