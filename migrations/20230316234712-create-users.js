'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('users', { 
       id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
       },

       role: {
         allowNull: false,
         type: Sequelize.ENUM('buyer', 'seller')
       },

       username: {
         type: Sequelize.STRING,
         allowNull: false
       },

       deposit: {
         type: Sequelize.INTEGER,
         allowNull: false,
         min: 0,
       },
       
       password: {
         type: Sequelize.STRING,
         allowNull: false
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('users');
  }
};
