const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');
const { createOrderSchema, updateOrderStatusSchema } = require('../validations/order.schema');

// Todas as rotas de pedidos requerem autenticação
router.use(verifyToken);

// Rotas do Cliente
router.post('/', validateRequest(createOrderSchema), orderController.create);
router.get('/my', orderController.listMyOrders);

// Rotas do Admin
router.get('/', isAdmin, orderController.listAll);
router.put('/:id/status', isAdmin, validateRequest(updateOrderStatusSchema), orderController.updateStatus);
router.delete('/:id', isAdmin, orderController.destroy);

module.exports = router;
