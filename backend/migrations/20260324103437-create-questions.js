'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("questions", {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

            categoryId: {
                type: Sequelize.UUID,
                allowNull: false
            },

            question: Sequelize.STRING,
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            marketRules: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            status: Sequelize.BOOLEAN,
            isTrending: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            showInSlider: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            eventStartDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            eventEndDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("questions");
    }
};
