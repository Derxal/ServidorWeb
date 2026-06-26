const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let usuarios = [
  { id: 1, nombre: 'Ana', email: 'ana@mail.com' },
  { id: 2, nombre: 'Luis', email: 'luis@mail.com' }
];
let nextId = 3;

app.get('/usuarios', (req, res) => res.json(usuarios));

app.get('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
});

app.post('/usuarios', (req, res) => {
  const { nombre, email } = req.body;
  const nuevo = { id: nextId++, nombre, email };
  usuarios.push(nuevo);
  res.status(201).json(nuevo);
});

app.put('/usuarios/:id', (req, res) => {
  const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  usuarios[idx] = { ...usuarios[idx], ...req.body };
  res.json(usuarios[idx]);
});

app.delete('/usuarios/:id', (req, res) => {
  const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  usuarios.splice(idx, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log('RRHH corriendo en http://localhost:3000'));
