"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Hash the password first
        const hashedPassword = await bcrypt.hash("admin", 10);

        return queryInterface.bulkInsert("admin", [
            {
                id: uuidv4(),
                fullName: "Super Admin",
                profileImage: "",
                email: "admin@nimbleappgenie.com",
                emailOTP: "",
                password: hashedPassword,
                isEmailVerified: true,
                role: "admin",
                accessToken: null,
                refreshToken: null,
                tokenVersion: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("admin", {
            email: "admin@nimbleappgenie.com"
        });
    },
};
