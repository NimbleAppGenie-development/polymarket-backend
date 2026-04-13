const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize; // Store instance globally

async function initializeDatabase() {
    if (sequelize) {
        console.log("🔄 Reusing existing database connection");
        return sequelize;
    }

    try {
        sequelize = new Sequelize(
            process.env.DB_NAME, // Should be database name, not instance ID
            process.env.DB_USERNAME,
            String(process.env.DB_PASSWORD),
            {
                host: process.env.DB_HOST,
                dialect: "postgres",
                port: process.env.DB_PORT || 5432,
                logging: false, // Enable logging for debugging
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
            }
        );

        await sequelize.authenticate();
        console.log("✅ Database connection established successfully!");

        return sequelize;
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}

// Export a **Promise** that resolves when the DB is ready
const sequelizePromise = initializeDatabase();

module.exports = sequelizePromise;
