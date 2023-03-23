'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('purchase', { 
      id: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: Sequelize.INTEGER,
      },

      productId: {
        type: Sequelize.INTEGER,
      },

      quantity: {
        type: Sequelize.INTEGER,
      },

      userId: {
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
    await queryInterface.dropTable('purchases');
  }
};
