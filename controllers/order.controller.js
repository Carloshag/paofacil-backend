const { Order, OrderItem, Product, sequelize, Address } = require('../models');
const { getIo } = require('../socket');

const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { tipo_entrega, forma_pagamento, observações, items } = req.body;
    const user_id = req.user.id;

    let total = 0;
    const orderItemsData = [];

    // Calculate total and prepare items data
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction });

      if (!product) {
        throw new Error(`Produto ID ${item.product_id} não encontrado.`);
      }
      if (!product.disponível) {
        throw new Error(`Produto '${product.nome}' não está disponível.`);
      }

      const preço_unitário = product.preço;
      total += item.quantidade * preço_unitário;

      orderItemsData.push({
        product_id: product.id,
        quantidade: item.quantidade,
        preço_unitário
      });
    }

    // Create Order
    const order = await Order.create({
      user_id,
      tipo_entrega,
      forma_pagamento,
      observações,
      total,
      status: 'pending'
    }, { transaction });

    // Link Items to Order
    const itemsToCreate = orderItemsData.map(oi => ({
      ...oi,
      order_id: order.id
    }));
    await OrderItem.bulkCreate(itemsToCreate, { transaction });

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          association: 'user',
          attributes: ['nome', 'email'],
          include: [{ model: Address }]
        },
        { model: OrderItem, as: 'items', include: ['product'] }
      ]
    });

    // Notifica admins em tempo real
    try {
      getIo().to('admin').emit('new_order', createdOrder);
    } catch (_) { }

    return res.status(201).json({ message: 'Pedido criado com sucesso.', order: createdOrder });
  } catch (error) {
    await transaction.rollback();
    const statusCode = error.message.includes('não encontrado') ? 404 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
};

const listMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: ['product'] }],
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedidos.', details: error.message });
  }
};

const listAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          association: 'user',
          attributes: ['nome', 'email'],
          include: [{ model: Address }]
        },
        { model: OrderItem, as: 'items', include: ['product'] }
      ],
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedidos.', details: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updatedRows] = await Order.update({ status }, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const order = await Order.findByPk(id);

    // Notifica o cliente dono do pedido em tempo real
    try {
      getIo().to(`user_${order.user_id}`).emit('order_status_changed', {
        orderId: order.id,
        status: order.status
      });
    } catch (_) { }

    return res.status(200).json({ message: 'Status atualizado com sucesso.', order });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar status do pedido.', details: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
    await OrderItem.destroy({ where: { order_id: id } });
    await order.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir pedido.', details: error.message });
  }
};

module.exports = { create, listMyOrders, listAll, updateStatus, destroy };
