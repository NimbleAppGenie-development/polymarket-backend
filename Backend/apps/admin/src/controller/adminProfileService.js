const Admin = require("@models/adminModel");
const moment = require("moment");
const statusCodes = require("../../../../libs/shared/utils/statusCodes");
const { simpleResponse, successResponse } = require("../../../../libs/shared/utils/response");
const { escape } = require("mysql2");

module.exports = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */

    myProfile: async (req, res, next) => {
        try {
            const adminId = req.user.id;
            const admin = await Admin.findOne({
                where: { id: adminId },
                attributes: {
                    exclude: ["password", "accessToken", "refreshToken", "tokenVersion"],
                },
            });

            if (!admin) throw new BadRequest(simpleResponse(false, "Admin not found"));

            // Ensure profile image has correct URL format
            let profileImage = admin.profileImage;
            if (profileImage) {
                profileImage = profileImage.replace(/\\/g, "/");
                profileImage = `${profileImage}`;
            }

            return res.status(statusCodes.OK).json(
                successResponse(
                    {
                        ...admin.toJSON(),
                        profileImage,
                    },
                    "Profile fetched successfully",
                ),
            );
        } catch (error) {
            console.log("error", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    addMoney: async (req, res, next) => {
        try {
            const { amount } = req.body;

            if (!amount || Number(amount) <= 0) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Valid amount is required",
                });
            }

            const admin = await Admin.findOne();

            if (!admin) {
                return res.status(statusCodes.NOT_FOUND).json({
                    status: false,
                    message: "Admin not found",
                });
            }

            //Increment wallet balance
            await Admin.update(
                {
                    walletBalance: Number(admin.walletBalance || 0) + Number(amount),
                },
                {
                    where: { id: admin.id },
                },
            );

            return res.status(statusCodes.OK).json({
                status: true,
                message: "Money added successfully",
            });
        } catch (error) {
            console.error("ADD MONEY ERROR:", error);

            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    getWalletBalance: async (req, res, next) => {
        try {
            const admin = await Admin.findOne();

            if (!admin) {
                return res.status(statusCodes.NOT_FOUND).json({
                    status: false,
                    message: "Admin not found",
                });
            }

            return res.status(statusCodes.OK).json({
                status: true,
                message: "Balance fetched successfully",
                data: {
                    walletBalance: admin.walletBalance || 0,
                },
            });
        } catch (error) {
            console.error("Balance Fetching Error:", error);

            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */

    logout: async (req, res, next) => {
        try {
            const admin = req.user;

            if (!admin) throw new Unauthorized(simpleResponse(false, "Unauthorized, user not found"));

            if (admin) {
                admin.tokenVersion = "NULL";
                admin.accessToken = "NULL";
                admin.refreshToken = "NULL";
                await admin.save();
            }

            return res.status(statusCodes.OK).json(simpleResponse(true, "Logged In Successfully"));
        } catch (error) {
            console.error("Logout error:", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */

    updateProfile: async (req, res, next) => {
        try {
            const { password, oldPassword } = req.body;

            const adminId = req.user.id;

            const admin = await Admin.findOne({ where: { id: adminId } });
            if (!admin) throw new BadRequest(simpleResponse(false, "Admin not found"));

            const profileImage = req.file;

            if (password) {
                // Verify old password
                // const opp = await admin.hashPassword1(oldPassword);
                const isMatch = await admin.verifyPassword(oldPassword);
                if (!isMatch) throw new BadRequest(simpleResponse(false, "Old password is incorrect"));
                admin.password = password;
            }
            if (profileImage) admin.profileImage = `/admin/${profileImage.filename}`;
            await admin.save();

            return res.status(statusCodes.OK).json(successResponse(true, "Profile updated successfully"));
        } catch (error) {
            console.error("Error updating profile:", error);
            next(error);
        }
    },
};
