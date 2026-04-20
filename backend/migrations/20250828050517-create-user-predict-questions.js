"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("userPredictedQuestions", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            categoryId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            selectedOptionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            selectedOptionName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            multiplier: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            entryAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            winningCredited: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            winningStatus: {
                type: Sequelize.ENUM("WIN", "LOSS", "PENDING"),
                allowNull: false,
                defaultValue: "PENDING",
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("now"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("now"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("userPredictedQuestions");
    },
};
