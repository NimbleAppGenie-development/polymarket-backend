var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Unauthorized } = require("../utils/statusCodes");
const { simpleResponse } = require("../utils/response");
const Admin = require("@models/adminModel");
// const  = require("@models/user");
// Load environment variables from .env file
dotenv.config();

// const secret = process.env.JWT_SECRET_KEY;

const verifyToken = async (accessToken) => {
    try {
        const secret = process.env.JWT_SECRET_KEY;
        return jwt.verify(accessToken, secret);
    } catch (error) {
        console.log("error bcc", error);
        return null;
    }
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const isAuthenticated = async (req, res, next) => {
    try {
        if (req.user?._id) {
            return next();
        }

        const accessToken = req.headers.authorization?.split("Bearer ")[1];

        if (accessToken) {
            // try {
            const decoded = await verifyToken(accessToken);
            if (decoded) {
                const user = await Admin.findByPk(decoded.id);
                if (!user) throw new Unauthorized(simpleResponse(false, "User not found. Please sign in again."));

                req.user = user;
                return next();
            }
        } else {
            throw new Unauthorized(simpleResponse(false, "Unauthorized, Authentication accessToken required"));
        }
    } catch (error) {
        // console.log("error in authValidatorUser", error);
        next(error);
    }
};

module.exports = { isAuthenticated, verifyToken };

