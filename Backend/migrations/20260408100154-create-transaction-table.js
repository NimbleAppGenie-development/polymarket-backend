module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("transactions", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId:{
              type: Sequelize.UUID,
              allowNull: false,
            },
            transactionId:{
              type: Sequelize.STRING,
              allowNull: true,
            },
            paymentMethod:{
              type: Sequelize.STRING,
              allowNull: true,
            },
            response:{
              type: Sequelize.TEXT,
              allowNull: true,
            },
            status:{
              type: Sequelize.STRING,
              allowNull: true,
            },
            type:{
              type: Sequelize.STRING,
              allowNull: true,
            },
            amount:{
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
        await queryInterface.dropTable("transactions");
    },
};
