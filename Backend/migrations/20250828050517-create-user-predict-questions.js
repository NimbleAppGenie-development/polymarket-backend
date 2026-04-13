'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('userPredictedQuestions', {
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
                allowNull: false
            },
            selectedOption: {
                type: Sequelize.ENUM('optionA', 'optionB'),
                allowNull: false,
            },
            predictionAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            pricePool: {
                type: Sequelize.STRING,
                allowNull: true
            },
            userWinning: {
                type: Sequelize.STRING,
                allowNull: true
            },
            winningCredited: {
                type: Sequelize.STRING,
                allowNull: true
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
        await queryInterface.dropTable('userPredictedQuestions');
    }
};
