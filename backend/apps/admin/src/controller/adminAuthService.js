const Admin = require("@models/adminModel");
const moment = require("moment");
const statusCode  = require("../../../../libs/shared/utils/statusCodes");
const { simpleResponse, successResponse } = require("../../../../libs/shared/utils/response");
const { v4: uuidv4 } = require('uuid');

module.exports = {

   /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */

    login: async (req, res, next) => {
        try {
            const { email, password  } = req.body;

            // Find admin by email
            const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

            if (!admin) {
                return res.status(statusCode.UNAUTHORIZED).json({
                    status: false,
                    message: "Admin not found"
                })
            }

            // Validate password
            const isPasswordValid = await admin.verifyPassword(password);
            if(!isPasswordValid){
                return res.status(statusCode.UNAUTHORIZED).json({
                    status: false,
                    message: "Invalid Password"
                })
            }

            // Generate token
            const { accessToken, refreshToken } = await admin.generateToken();
            const tokens = { accessToken, refreshToken };
            const newTokenVersion = uuidv4();
            await admin.update({
                tokenVersion: newTokenVersion
            });
            await admin.save();

            res.json({
                body: {
                    tokens: tokens,
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    profileImage: admin.profileImage,
                },
            });
        } catch (error) {
            console.error('Error ', error);
            next(error);
        }
    },
}
