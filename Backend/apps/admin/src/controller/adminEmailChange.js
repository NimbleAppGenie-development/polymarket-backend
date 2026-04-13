const statusCodes = require("@utils/statusCodes");
const Admin = require("@models/adminModel");

module.exports = {

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    sendOTPForupdateEmail: async (req, res) => {
        const { email } = req.body;
        const userId = req.user.id;

        try {
            if (!email) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Email required.",
                });
            }

            const admin = await Admin.findByPk(userId);
            if (!admin) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Admin not found.",
                });
            }

            const existingAccount = await Admin.findOne({ where: { email }  });
            if (existingAccount) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "An account with this email already exists. Please use a different email.",
                });
            }
            await admin.update({
                emailOTP: 111111 // Replace with generated OTP
            });

            return res.status(statusCodes.OK).json({
                status: true,
                message: "OTP sent successfully",
                result: ""
            });

        } catch (error) {
            console.error("sendOTPForupdateEmail error:", error);
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "We're sorry, but there was a problem processing your request.",
            });
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    verifyEmailOTPForUpdateEmail: async (req, res) => {
        const { email, otp } = req.body;

        const requiredFields = ['email', 'otp'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: `${field} is required`,
                });
            }
        }

        if (!req.user || !req.user.id) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Authentication required",
            });
        }

        
        try {

              // Find admin by ID from the authenticated user
              const admin = await Admin.findByPk(req.user.id);
              if (!admin) {
                  return res.status(statusCodes.NOT_FOUND).json({
                      status: false,
                      message: "Admin account not found",
                  });
              }

            if (otp !== "111111") { // Replace with real OTP check
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid OTP",
                });
            }

            await admin.update({
                isEmailVerified: true,
                email: email,
                emailOTP: null
            });


            const { accessToken, refreshToken } = await admin.generateToken();

            return res.status(statusCodes.OK).json({
                status: true,
                message: "OTP verified successfully. Tokens generated.",
                result: {
                    accessToken,
                    refreshToken
                }
            });

        } catch (error) {
            console.error("verifyEmailOTPForUpdateEmail error:", error);
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "We're sorry, but there was a problem processing your request.",
            });
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    resendOTPForUpdateEmail: async (req, res) => {
        const { email } = req.body;
        const userId = req.user.id;

        try {
            if (!email) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Email required.",
                });
            }

            const admin = await Admin.findByPk(userId);
            if (!admin) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Admin not found.",
                });
            }

            const existingAccount = await Admin.findOne({ where: { email } });
            if (existingAccount) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "An account with this email already exists. Please use a different email.",
                });
            }

            await admin.update({
                emailOTP: 111111 // Replace with generated OTP
            });


            return res.status(statusCodes.OK).json({
                status: true,
                message: "OTP resent successfully",
                result: ""
            });

        } catch (error) {
            console.error("resendOTPForUpdateEmail error:", error);
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "We're sorry, but there was a problem processing your request.",
            });
        }
    }

};
