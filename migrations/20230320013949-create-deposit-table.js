'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('deposit', { 
      id: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.INTEGER,
      },

      deposit: {
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
    await queryInterface.dropTable('deposits');
  }
};
