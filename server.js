require('dotenv').config();
const http = require('http');
const app = require('./app');
const { syncDatabase } = require('./models');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await syncDatabase();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();
