const { z } = require('zod');

const productSchema = z.object({
  nome: z.string().min(2, 'O nome do produto é obrigatório.'),
  descrição: z.string().optional(),
  preço: z.number().positive('O preço deve ser positivo.'),
  imagem: z.string().optional().or(z.literal('')),
  porções: z.string().optional(),
  disponível: z.boolean().optional()
});

module.exports = { productSchema };
