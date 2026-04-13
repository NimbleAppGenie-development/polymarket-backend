const { errorResponse, simpleResponse } = require("../../../../libs/shared/utils/response");
const db = require("sequelize");
const { APIError } = require("../../../../libs/shared/utils/statusCodes")

module.exports = {
    interceptor: (req, res, next) => {
        next();
    },
    errorHandler: (err, req, res, next) => {
        if (err) {
            // catch all api errors
           /*  if (err instanceof APIError) {
                return res.status(err.status).send(err.message);
            } */

            // catch all sequelize errors
            if (err instanceof db.ConnectionRefusedError) {
                return res.status(500).send({
                    status: false,
                    message: "Could not connect to database!",
                });
            }
            if (err instanceof db.ConnectionError) {
                return res
                    .status(408)
                    .send({ status: false, message: "Connection timed out!" });
            }
            if (err instanceof db.ForeignKeyConstraintError) {
                return res
                    .status(409)
                    .send({ status: false, message: "Failed to insert data!" });
            }
            if (err instanceof db.UniqueConstraintError) {
                return res
                    .status(409)
                    .send({ status: false, message: err.errors[0].message });
            }
            if (err.name === "JsonWebTokenError") {
                return res
                    .status(401)
                    .send({ status: false, message: "Invalid token" });
            }
            if (err.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .send({ status: false, message: "Token expired" });
            }

            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};

            res.status(err.status || 500).send(
                errorResponse("Error Occured", {
                    message: err.message,
                    error: err.stack.split("\n").map((item) => item.trim()),
                })
            );
        } else {
            next();
        }
    },
    notFound: (req, res, next) => {
        res.status(404).json(
            simpleResponse(false, `Route '${req.url}' not found!`)
        );
    },
};
