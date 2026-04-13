const fs = require("fs");
require("dotenv").config();

module.exports = async () => {
    try {
        let config = JSON.parse(
            fs.readFileSync("libs/shared/config/config.json", "utf8")
        );

        const dbConfig = {
            username: process.env.DB_USERNAME || config.development.username || "",
            password: process.env.DB_PASSWORD || config.development.password || "",
            database: process.env.DB_NAME || config.development.database || "",
            host: process.env.DB_HOST || config.development.host || "",
            port: process.env.DB_PORT || config.development.port || 5432,
            dialect: "postgres" || "postgres"
        };
        /* const dbConfig = {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
        }; */

        return {
            development: dbConfig,
            staging: dbConfig,
            production: dbConfig,
        };
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
/* module.exports = {
	development: dbConfig,
	staging: dbConfig,
	production: dbConfig,
}; */
