const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve imagens de produtos armazenadas localmente
const staticUploadDir = process.env.UPLOADS_PATH || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(staticUploadDir));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('PãoFácil API está rodando!');
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor.', details: err.message });
});

module.exports = app;
