const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro de validação de dados.',
        details: error.errors
      });
    }
  };
};

module.exports = validateRequest;
