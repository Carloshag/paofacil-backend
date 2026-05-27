const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }

    next();
  };
};

const isAdmin = requireRole('admin');

module.exports = { requireRole, isAdmin };
