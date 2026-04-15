const Admin = require("@models/adminModel");
const moment = require("moment");
const statusCodes = require("../../../../libs/shared/utils/statusCodes");
const { simpleResponse, successResponse } = require("../../../../libs/shared/utils/response");

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
                    exclude: ['password', 'accessToken', 'refreshToken', 'tokenVersion']
                }
            });

            if (!admin) throw new BadRequest(simpleResponse(false, "Admin not found"));

            // Ensure profile image has correct URL format
            let profileImage = admin.profileImage;
            if (profileImage) {
                profileImage = profileImage.replace(/\\/g, "/");
                profileImage = `${profileImage}`;
            }

            return res.status(statusCodes.OK).json(successResponse({
                ...admin.toJSON(),
                profileImage
            }, "Profile fetched successfully"));
        } catch (error) {
            console.log("error", error);
            next(error)
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

            if (!admin) throw new Unauthorized(
                simpleResponse(false, "Unauthorized, user not found")
            );

            if (admin) {
                admin.tokenVersion = "NULL";
                admin.accessToken = "NULL";
                admin.refreshToken = "NULL";
                await admin.save();
            }

            return res.status(statusCodes.OK).json(simpleResponse(true, "Logged In Successfully"));

        } catch (error) {
            console.error("Logout error:", error);
            next(error)
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

            if(password) {
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
    }

}
