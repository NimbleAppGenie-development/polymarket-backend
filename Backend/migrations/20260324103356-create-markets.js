'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("markets", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      category: Sequelize.JSON,
      status: { type: Sequelize.STRING, defaultValue: "ACTIVE" },
      homeTabView: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("now") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("now") }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("markets");
  }
};
