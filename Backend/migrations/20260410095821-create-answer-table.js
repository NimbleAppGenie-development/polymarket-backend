'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("answers", {
            id: { 
              type: Sequelize.UUID, 
              defaultValue: Sequelize.UUIDV4, 
              primaryKey: true 
            },

            userId: {
                type: Sequelize.UUID,
                allowNull: false
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false
            },

            answer: Sequelize.STRING,
            
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("answers");
    }
};
