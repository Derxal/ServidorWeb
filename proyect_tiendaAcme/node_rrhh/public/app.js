const API = '/usuarios';

async function cargarUsuarios() {
  const res = await fetch(API);
  const usuarios = await res.json();
  const tbody = document.getElementById('tabla-body');
  tbody.innerHTML = usuarios.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td class="actions">
        <button class="btn-edit" onclick="editar(${u.id}, '${u.nombre}', '${u.email}')">Editar</button>
        <button class="btn-danger" onclick="eliminar(${u.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function guardar() {
  const id = document.getElementById('edit-id').value;
  const nombre = document.getElementById('input-nombre').value.trim();
  const email = document.getElementById('input-email').value.trim();
  if (!nombre || !email) return toast('Completa nombre y email');

  if (id) {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email })
    });
    toast('Usuario actualizado');
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email })
    });
    toast('Usuario agregado');
  }

  cancelarEdicion();
  cargarUsuarios();
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  toast('Usuario eliminado');
  cargarUsuarios();
}

function editar(id, nombre, email) {
  document.getElementById('edit-id').value = id;
  document.getElementById('input-nombre').value = nombre;
  document.getElementById('input-email').value = email;
  document.getElementById('form-titulo').textContent = 'Editar usuario';
  document.getElementById('btn-cancelar').style.display = 'inline-block';
}

function cancelarEdicion() {
  document.getElementById('edit-id').value = '';
  document.getElementById('input-nombre').value = '';
  document.getElementById('input-email').value = '';
  document.getElementById('form-titulo').textContent = 'Agregar usuario';
  document.getElementById('btn-cancelar').style.display = 'none';
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

cargarUsuarios();
