'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
          },
    
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
    
        deposit: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            isNumeric: true,
            min: 0,
        },

        role: {
            type: Sequelize.STRING,
            allowNull: false
        },
    
    },{
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        deletedAt: 'deletedAt',
        tableName: 'users'
    });
    
    User.findByUsername = async username => {
        const user = await User.findOne({
            where: { username }
        });
    
        return user;
    }
    
    User.beforeCreate(async user => {
        user.password = await user.generatePasswordHash();
    });
    
    User.prototype.generatePasswordHash = async function() {
        const saltRounds = 10;
        return bcrypt.hash(this.password, saltRounds);
    };
    
    User.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;

}
