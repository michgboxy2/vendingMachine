'use strict';


module.exports = (sequelize, Sequelize) => {
    const Deposit = sequelize.define('deposit', {
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
    
        deposit: {
            type: Sequelize.INTEGER,
            isNumeric: true,
        },
    },{
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        deletedAt: 'deletedAt',
        tableName: 'products'
    });

    return Deposit;
}
