// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("../../swagger.json");

const routesArray = [
    { path: null, routeObj: require("./api/adminAuth.routes") },
    { path: "markets", routeObj: require("./api/marketAdmin.routes") },
];

/**
 * @param {import('express').Express} app
 */
module.exports = (app) => {
    if (!app || typeof app.use !== 'function') {
        throw new Error('Invalid Express app instance provided to routes');
    }


    routesArray.forEach((item) => {
        // app.use(`/api/v1/admin${item.path ? `/${item.path}` : ""}`, item.routeObj);
        const fullPath = `/api/admin${item.path ? `/${item.path}` : ''}`;
        console.log(`routes at: ${fullPath}`);
        app.use(fullPath, item.routeObj);
    });

    // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use("/", (req, res) => {
        if (req.headers.accept === "application/json") {
            res.json({
                status: true,
                message: "Admin server is running 🏃",
            });
        } else {
            res.send("<h1>Admin server is running 🏃</h1>");
        }
    });

    // 404 handler (will only be reached if no other route matches)
    app.use((req, res) => {
        res.status(404).json({ status: false, message: "Route not found" });
    });
};
