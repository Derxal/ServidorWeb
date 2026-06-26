const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let productos = [
  { id: 1, nombre: 'Laptop', precio: 3500 },
  { id: 2, nombre: 'Mouse', precio: 80 },
  { id: 3, nombre: 'Teclado', precio: 150 }
];

app.get('/productos', (req, res) => res.json(productos));

app.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
});

app.listen(3000, () => console.log('Ventas corriendo en http://localhost:3000'));
