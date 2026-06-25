const express = require('express');
const app = express();

app.use(express.json());

// Datos de ejemplo (en memoria)
let productos = [
  { id: 1, nombre: 'Laptop', precio: 3500 },
  { id: 2, nombre: 'Mouse', precio: 80 },
  { id: 3, nombre: 'Teclado', precio: 150 }
];

// GET - todos los productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

// GET - un producto por id
app.get('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  res.json(producto);
});

app.listen(3000, () => {
  console.log('Servidor de ventas corriendo en http://localhost:3000');
});
