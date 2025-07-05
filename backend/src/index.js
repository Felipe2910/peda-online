const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Servir los archivos estáticos de React desde frontend/build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Ruta API ejemplo
app.get('/api', (req, res) => {
  res.send('API funcionando');
});

// Para cualquier ruta que no sea /api, devolver index.html (React SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
