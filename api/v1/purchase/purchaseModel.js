'use strict';


module.exports = (sequelize, Sequelize) => {
    const Purchase = sequelize.define('purchase', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
          },
    
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    },{
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        deletedAt: 'deletedAt',
        tableName: 'products'
    });

    return Purchase;
}
