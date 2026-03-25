'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      marketId: {
        type: Sequelize.UUID,
        allowNull: false
      },

      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      image: Sequelize.STRING,

      type: {
        type: Sequelize.ENUM("BINARY", "MULTIPLE"),
        defaultValue: "BINARY"
      },

      status: {
        type: Sequelize.ENUM("OPEN", "CLOSED", "RESOLVED"),
        defaultValue: "OPEN"
      },

      startTime: Sequelize.DATE,
      endTime: Sequelize.DATE,
      resolutionTime: Sequelize.DATE,

      winningOptionId: Sequelize.UUID,

      totalVolume: {
        type: Sequelize.DECIMAL(10, 2),
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
