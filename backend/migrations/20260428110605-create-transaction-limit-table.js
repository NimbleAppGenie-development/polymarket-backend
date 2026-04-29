module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("transactionLimits", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            minWithdrawAmount:{
              type:Sequelize.DECIMAL(10,2),
              allowNull: true,
            },
            maxWithdrawAmount:{
              type:Sequelize.DECIMAL(10,2),
              allowNull: true,
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
        await queryInterface.dropTable("transactionLimits");
    },
};
