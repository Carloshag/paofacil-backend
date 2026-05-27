const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');
const { productSchema } = require('../validations/product.schema');
const upload = require('../middlewares/upload.middleware');

// Rotas públicas
router.get('/', productController.list);

// Rotas protegidas (Admin)
router.use(verifyToken, isAdmin);
router.get('/all', productController.listAllAsAdmin);
router.post('/upload-image', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('[Upload Error]:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    const host = req.get('host');
    const protocol = (host.includes('localhost') || host.includes('127.0.0.1')) ? 'http' : 'https';
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    return res.status(200).json({ url: imageUrl });
  });
});
router.post('/', validateRequest(productSchema), productController.create);
router.put('/:id', validateRequest(productSchema), productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
