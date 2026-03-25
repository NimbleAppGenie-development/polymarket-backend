module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("admin", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: true, // Same as model (no allowNull specified in model)
            },
            profileImage: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            emailOTP: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true, // Same as model (no allowNull specified)
            },
            isEmailVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM("admin"),
                defaultValue: "admin",
                allowNull: false
            },
            accessToken: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            refreshToken: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            tokenVersion: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: false
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



        await queryInterface.addIndex("admin", {
            fields: ['email'], // no function wrapper
            unique: true,
            name: 'admins_email_unique'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Admin");
    },
};
