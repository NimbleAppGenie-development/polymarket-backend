const { BadRequest, Unauthorized } = require("../../../../libs/shared/utils/statusCodes");
const { simpleResponse, successResponse } = require("../../../../libs/shared/utils/response");
const Admin = require("@models/adminModel");

module.exports = {

    /**
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      * @param {import('express').NextFunction} next
      */

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Find admin by email
            const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

            if (!admin) throw new Unauthorized(simpleResponse(false, "Admin not found"));

            // Validate password
            const isPasswordValid = await admin.verifyPassword(password);
            if (!isPasswordValid) throw new Unauthorized(simpleResponse(false, "Invalid password"));

            // Generate token
            const { accessToken, refreshToken } = await admin.generateToken();
            const tokens = {
                accessToken, refreshToken
            };
            await admin.save();

            res.json({
                success: true,
                message: "Login successful",
                token: tokens,
                data: {
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