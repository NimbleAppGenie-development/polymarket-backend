var jwt = require("jsonwebtoken");
const fs = require("fs");
const statusCodes = require("@utils/statusCodes");
const dotenv = require("dotenv");

const User = require("@models/user");
const { BadRequest, InternalServer, Unauthorized } = require("../../../libs/shared/utils/statusCodes");
const { errorResponse, simpleResponse, successResponse } = require("../../../libs/shared/utils/response");
// Load environment variables from .env file
dotenv.config();

// const secret = process.env.JWT_SECRET_KEY;

const verifyToken = async (accessToken) => {
    try {
        console.log("Verifying token...", accessToken);
        let config = JSON.parse(
            fs.readFileSync("libs/shared/config/config.json", "utf8")
        );

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
        if (req.user?._id) return next();

        const accessToken = req.headers.authorization?.split("Bearer ")[1];
        if (!accessToken) {
            return next(new Unauthorized(simpleResponse(false, "Unauthorized, Authentication accessToken required")));
        }

        const decoded = await verifyToken(accessToken);
        if (!decoded) {
            return next(new Unauthorized(simpleResponse(false, "Invalid or expired token. Please sign in again.")));
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return next(new Unauthorized(simpleResponse(false, "User not found. Please sign in again.")));
        }

        // 🔒 Safe tokenVersion check
        // if (!user.tokenVersion || decoded.tokenVersion !== user.tokenVersion) {
        //     return next(new Unauthorized(simpleResponse(false, "Token is no longer valid. Please sign in again.")));
        // }

        if (decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({
                status: false,
                message: "Token is no longer valid. Please sign in again.",
            });
        }

        req.user = user;
        return next();

    } catch (error) {
        console.error("Error in isAuthenticated:", error);

        if (error instanceof jwt.TokenExpiredError) {
            return next(new Unauthorized(simpleResponse(false, "Token has expired. Please sign in again.")));
        }

        return next(new InternalServer(simpleResponse(false, "Authentication failed due to internal error.")));
    }
};

// const isAdmin = [
//   isAuthenticated,
//   async (req, res, next) => {
//     try {
//       const role = { $in: ['admin'] };
//       const found = await adminModel.findOne({ _id: req.user._id, role });

//       if (!found) {
//         return res
//           .status(statusCodes.UNAUTHORIZED)
//           .json({
//             status: false,
//             result: false,
//             message: "only admin has right to access",
//           });
//       }
//       var user = { ...found._doc };
//       req.user = user;
//       // console.debug("isAdmin:", req.user);
//       next();
//     } catch (error) {
//       res
//         .status(statusCodes.BAD_REQUEST)
//         .json({ status: false, result: false, message: "We're sorry, but there was a problem processing your request." });
//     }
//   },
// ];
module.exports = { isAuthenticated, verifyToken };
// module.exports.admin = isAdmin;
