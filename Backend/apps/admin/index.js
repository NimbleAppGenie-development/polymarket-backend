console.log("index file in the admin")
require("module-alias/register");
const { createServer } = require("node:http");
const app = require("./src/app");
const PORT = process.env.ADMINPORT ?? 8017;

if (!app) {
    console.error("❌ Express app is undefined. Check your app.js file.");
    process.exit(1);
}


const server = createServer(app);

server.listen(PORT, () => {

    console.log(`🚀Admin Server is running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind = typeof PORT === "string" ? "Pipe " + PORT : "PORT " + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
});
