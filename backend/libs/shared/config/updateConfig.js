const fs = require("fs");
require("dotenv").config();

async function main() {
    try {
        let config = JSON.parse(
            fs.readFileSync("libs/shared/config/config.json", "utf8")
        );

        if (
            process.env.DB_USERNAME &&
            process.env.DB_PASSWORD &&
            process.env.DB_NAME &&
            process.env.DB_HOST &&
            process.env.DB_PORT
        ) {
            config.development.username = process.env.DB_USERNAME;
            config.development.password = String(process.env.DB_PASSWORD);
            config.development.database = process.env.DB_NAME;
            config.development.host = process.env.DB_HOST;
            config.development.dialect = "postgres";
            config.development.port = process.env.DB_PORT;
            console.log("✅ Using Environment Variables for Secrets");
        } else {
            // ✅ Fallback to local configuration
            console.warn("⚠️ AWS Secrets are incomplete or missing. Using local config.");
            config.development.username =  config.production.username;
            config.development.password =  config.production.password;
            config.development.database =  config.production.database;
            config.development.host =  config.production.host;
            config.development.dialect = "postgres";
            config.development.port =  config.production.port;
        }

        // ✅ Write the updated config back to config.json
        fs.writeFileSync(
            "libs/shared/config/config.json",
            JSON.stringify(config, null, 2)
        );

        console.log("✅ Config updated successfully");

    } catch (error) {
        console.error("❌ Error loading config:", error);
    }
}

main();
