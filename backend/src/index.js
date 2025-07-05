const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ruta básica para saber que el API está funcionando
app.get('/', (req, res) => {
  res.send('API funcionando, en modo mantenimiento');
});

// Ruta ejemplo para API
app.get('/api', (req, res) => {
  res.json({ message: 'API funcionando, sin DB por ahora' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
