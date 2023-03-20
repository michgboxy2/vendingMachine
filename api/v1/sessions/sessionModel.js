'use strict';


module.exports = (sequelize, Sequelize) => {
    const Session = sequelize.define('session', {
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
    
        userType: {
            type: Sequelize.STRING,
            allowNull: false
        },

        username: {
            type: Sequelize.STRING,
            allowNull: false
        },

    
    },{
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        deletedAt: 'deletedAt',
        tableName: 'sessions'
    });

    return Session;
    

}
