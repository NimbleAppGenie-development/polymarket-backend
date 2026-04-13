'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("categories", {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

            name: Sequelize.STRING,
            image: { type: Sequelize.STRING, defaultValue: null },
            status: { type: Sequelize.BOOLEAN, defaultValue: true },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("categories");
    }
};
