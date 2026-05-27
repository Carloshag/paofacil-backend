const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);
router.get('/address', userController.getAddress);
router.post('/address', userController.saveAddress);
router.get('/delivery-estimate', userController.getDeliveryEstimate);

module.exports = router;
