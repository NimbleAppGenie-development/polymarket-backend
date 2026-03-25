'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("question_options", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      questionId: {
        type: Sequelize.UUID,
        allowNull: false
      },

      title: Sequelize.STRING, // YES / NO / Option A

      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },

      percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
