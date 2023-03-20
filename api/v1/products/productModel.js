'use strict';


module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
          },
    
        sellerId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    
        productName: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
    
        amountAvailable: {
            type: Sequelize.INTEGER,
            isNumeric: true,
        },

        cost: {
            type: Sequelize.INTEGER,
            isNumeric: true,
        }
    
    },{
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        deletedAt: 'deletedAt',
        tableName: 'products'
    });

    return Product;
    

}
