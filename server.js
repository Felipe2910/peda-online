const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Un amigo se unió a la peda');

  socket.on('nuevo-evento', (data) => {
    io.emit('evento-actualizado', data);
  });

  socket.on('disconnect', () => {
    console.log('Un compa salió de la peda');
  });
});

http.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});


