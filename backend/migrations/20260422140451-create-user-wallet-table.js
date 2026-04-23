module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("userWallets", {
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
            type: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("userWallets");
    },
};
