const { Model, DataTypes } = require('sequelize');
const  database  = require('../utils/database');

class CartItem extends Model {}

CartItem.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    tableName: 'cartItems',
    sequelize: database,
});

module.exports = CartItem;
