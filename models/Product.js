const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descrição: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preço: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  porções: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  disponível: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Product;
