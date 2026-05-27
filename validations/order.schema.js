const { z } = require('zod');

const orderItemSchema = z.object({
  product_id: z.number().int().positive('ID do produto inválido.'),
  quantidade: z.number().int().positive('A quantidade deve ser maior que zero.')
});

const createOrderSchema = z.object({
  tipo_entrega: z.enum(['retirada', 'entrega']),
  forma_pagamento: z.enum(['pix', 'dinheiro', 'cartao']),
  observações: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'O pedido deve conter pelo menos um item.')
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'delivering', 'done'])
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
