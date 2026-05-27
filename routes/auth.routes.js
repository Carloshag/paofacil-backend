const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema, verifySchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/auth.schema');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/verify', validateRequest(verifySchema), authController.verifyCode);
router.post('/resend-code', validateRequest(forgotPasswordSchema), authController.resendCode);
router.get('/users', verifyToken, isAdmin, authController.listUsers);

router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.requestPasswordReset);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

module.exports = router;
