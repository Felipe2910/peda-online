const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const salas = {};
const iconos = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const bebidas = [
  { nombre: 'Cerveza', alcohol: 4.5 },
  { nombre: 'Tequila', alcohol: 38 },
  { nombre: 'Mezcal', alcohol: 45 },
  { nombre: 'Aguardiente', alcohol: 29 },
  { nombre: 'Coco con piquete', alcohol: 12 },
  { nombre: 'Jaguar rojo', alcohol: 40 },
  { nombre: 'Chelada con chamoy', alcohol: 9 },
  { nombre: 'Mojito de pozol', alcohol: 10 },
  { nombre: 'Shots encadenados', alcohol: 50 }
];

io.on('connection', socket => {
  console.log('Usuario conectado:', socket.id);

  socket.on('registrar_usuario', ({ nombre, icono }, cb) => {
    socket.data.usuario = {
      id: socket.id,
      nombre,
      icono,
      resistencia: 100,
      medallas: 0,
      sala: null,
      eliminado: false
    };
    cb(socket.data.usuario);
  });

  socket.on('crear_sala', ({ tipo, bebidasSeleccionadas }, cb) => {
    const codigo = Math.random().toString(36).substring(2, 7);
    const creador = socket.data.usuario;
    creador.sala = codigo;

    salas[codigo] = {
      codigo,
      tipo,
      jugadores: [creador],
      host: socket.id,
      estado: 'esperando',
      bebidas: bebidas.filter(b => bebidasSeleccionadas.includes(b.nombre)),
      ronda: 0,
      inactivo: setTimeout(() => {
        destruirSala(codigo);
      }, 10 * 60 * 1000)
    };

    socket.join(codigo);
    cb({ codigo, sala: salas[codigo] });
    io.to(codigo).emit('sala_actualizada', salas[codigo]);
  });

  socket.on('unirse_sala', ({ codigo }, cb) => {
    const sala = salas[codigo];
    if (!sala) return cb({ error: 'Sala no existe' });
    if (sala.estado !== 'esperando') return cb({ error: 'Peda en curso' });

    const usuario = socket.data.usuario;
    usuario.sala = codigo;
    usuario.eliminado = false;
    usuario.resistencia = 100;

    sala.jugadores.push(usuario);
    socket.join(codigo);
    cb({ sala });
    io.to(codigo).emit('sala_actualizada', sala);
  });

  socket.on('iniciar_peda', (codigo) => {
    const sala = salas[codigo];
    if (!sala || sala.jugadores.length < 2) return;
    if (socket.id !== sala.host) return;

    clearTimeout(sala.inactivo);
    sala.estado = 'en-juego';
    sala.ronda = 1;

    iniciarRonda(sala);
  });

  socket.on('elegir_bebida', ({ codigo, bebida }) => {
    const sala = salas[codigo];
    if (!sala || sala.estado !== 'en-juego') return;

    const jugador = sala.jugadores.find(u => u.id === socket.id);
    if (!jugador || jugador.eliminado) return;

    jugador.eleccion = bebida;
  });

  socket.on('disconnect', () => {
    const usuario = socket.data.usuario;
    if (!usuario || !usuario.sala) return;

    const sala = salas[usuario.sala];
    if (!sala) return;

    sala.jugadores = sala.jugadores.filter(j => j.id !== socket.id);
    io.to(usuario.sala).emit('sala_actualizada', sala);

    if (sala.jugadores.length === 0) {
      destruirSala(usuario.sala);
    }
  });
});

function iniciarRonda(sala) {
  io.to(sala.codigo).emit('nueva_ronda', {
    ronda: sala.ronda,
    bebidas: sala.bebidas
  });

  // 10 segundos para elegir
  setTimeout(() => {
    sala.jugadores.forEach(jugador => {
      if (jugador.eliminado) return;

      let bebida = jugador.eleccion;
      if (!bebida) {
        bebida = Math.random() < 0.5
          ? 'Cerveza'
          : sala.bebidas[Math.floor(Math.random() * sala.bebidas.length)].nombre;
      }

      const b = sala.bebidas.find(b => b.nombre === bebida);
      jugador.resistencia -= b.alcohol;
      jugador.eleccion = null;

      if (jugador.resistencia <= 0) {
        jugador.eliminado = true;
      }
    });

    const vivos = sala.jugadores.filter(j => !j.eliminado);

    if (vivos.length <= 1) {
      sala.estado = 'finalizada';

      if (vivos.length === 1) {
        vivos[0].medallas += 1;
        io.to(sala.codigo).emit('ganador', vivos[0]);
      } else {
        io.to(sala.codigo).emit('todos_eliminados');
      }

      setTimeout(() => destruirSala(sala.codigo), 10000);
    } else {
      sala.ronda += 1;
      iniciarRonda(sala);
    }

    io.to(sala.codigo).emit('sala_actualizada', sala);
  }, 10000);
}

function destruirSala(codigo) {
  const sala = salas[codigo];
  if (!sala) return;

  io.to(codigo).emit('sala_destruida');
  sala.jugadores.forEach(j => {
    io.sockets.sockets.get(j.id)?.leave(codigo);
  });

  delete salas[codigo];
  console.log(`Sala ${codigo} destruida por inactividad.`);
}

http.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
