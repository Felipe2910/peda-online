const socket = io();

function tomarTrago() {
  const nombre = prompt("¿Quién toma?");
  if (nombre) {
    const data = { tipo: 'trago', nombre };
    socket.emit('nuevo-evento', data);
  }
}

socket.on('evento-actualizado', (data) => {
  const log = document.getElementById('log');
  const mensaje = document.createElement('div');
  if (data.tipo === 'trago') {
    mensaje.textContent = `${data.nombre} se echó un trago!`;
  }
  log.appendChild(mensaje);
  log.scrollTop = log.scrollHeight;
});

