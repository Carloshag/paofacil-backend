const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'delivering', 'done'),
    defaultValue: 'pending',
  },
  tipo_entrega: {
    type: DataTypes.ENUM('retirada', 'entrega'),
    allowNull: false,
  },
  forma_pagamento: {
    type: DataTypes.ENUM('pix', 'dinheiro', 'cartao'),
    allowNull: true,
  },
  observações: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
module.exports = Order;
