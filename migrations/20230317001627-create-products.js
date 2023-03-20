'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('products', { 
      id: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: Sequelize.INTEGER,
      },

      amountAvailable: {
        type: Sequelize.INTEGER,
      },

      cost: {
        type: Sequelize.INTEGER,
      },
      
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      sellerId: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      
      deletedAt: {
        type: Sequelize.DATE,
      },
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
