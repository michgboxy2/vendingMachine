'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('sessions', { 
       id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
       },

       userId: {
         allowNull: false,
         type: Sequelize.INTEGER,
       },

       username: {
         allowNull: false,
         type: Sequelize.STRING,
       },

       userType: {
         allowNull: false,
         type: Sequelize.STRING,
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
     await queryInterface.dropTable('sessions');
  }
};
