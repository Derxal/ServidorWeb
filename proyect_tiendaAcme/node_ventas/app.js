require('dotenv').config();
const express = require('express');
const path = require('path');

const productosRouter = require('./routes/productos');
const ventasRouter   = require('./routes/ventas');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/productos', productosRouter);
app.use('/api/ventas',    ventasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ventas corriendo en http://localhost:${PORT}`));
