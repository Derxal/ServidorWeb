const store = {
    productos: [
        { id: 1, nombre: 'Laptop',   precio: 3500 },
        { id: 2, nombre: 'Mouse',    precio: 80   },
        { id: 3, nombre: 'Teclado',  precio: 150  }
    ],
    _productosNextId: 4,
    nextProductoId() { return this._productosNextId++; },

    ventas: [],
    _ventasNextId: 1,
    nextVentaId() { return this._ventasNextId++; }
};

module.exports = store;
