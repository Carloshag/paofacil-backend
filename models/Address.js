const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Address;
