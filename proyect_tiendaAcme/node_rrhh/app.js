// server.js
const express = require('express');
const app = express();

app.use(express.json());

// Datos de ejemplo (en memoria)
let usuarios = [
  { id: 1, nombre: 'Ana', email: 'ana@mail.com' },
  { id: 2, nombre: 'Luis', email: 'luis@mail.com' }
];

// Endpoint 1: GET - obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// Endpoint 2: POST - crear un nuevo usuario
app.get('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  res.json(usuario);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});