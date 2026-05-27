const { z } = require('zod');

const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['client', 'admin']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.')
});

const verifySchema = z.object({
  email: z.string().email('Email inválido.'),
  code: z.string().min(6, 'O código deve ter 6 dígitos.').max(6, 'O código deve ter 6 dígitos.')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido.')
});

const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido.'),
  code: z.string().min(6, 'O código deve ter 6 dígitos.').max(6, 'O código deve ter 6 dígitos.'),
  novaSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
});

module.exports = { registerSchema, loginSchema, verifySchema, forgotPasswordSchema, resetPasswordSchema };
