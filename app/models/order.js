const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentType: {
    type: DataTypes.STRING,
    defaultValue: 'COD'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'order_placed'
  }
}, { timestamps: true });

module.exports = Order;
