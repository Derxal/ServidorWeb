// Reloj en vivo en el footer
const reloj = document.getElementById("reloj");
function actualizarReloj() {
  reloj.textContent = new Date().toLocaleString("es-ES");
}
actualizarReloj();
setInterval(actualizarReloj, 1000);
