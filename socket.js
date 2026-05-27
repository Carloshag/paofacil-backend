const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Middleware de autenticação por JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Token não fornecido.'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role, ... }
      next();
    } catch (err) {
      next(new Error('Token inválido.'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user;

    // Coloca o usuário na sala correta
    if (role === 'admin') {
      socket.join('admin');
      console.log(`[Socket] Admin conectado: user_id=${id} socket=${socket.id}`);
    } else {
      socket.join(`user_${id}`);
      console.log(`[Socket] Cliente conectado: user_id=${id} socket=${socket.id}`);
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] Desconectado: user_id=${id} socket=${socket.id}`);
    });
  });

  console.log('[Socket] Socket.io configurado com sucesso.');
  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io ainda não foi inicializado.');
  }
  return io;
};

module.exports = { initSocket, getIo };
