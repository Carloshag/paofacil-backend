const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  preço_unitário: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'order_items',
  timestamps: false,
});
module.exports = OrderItem;
