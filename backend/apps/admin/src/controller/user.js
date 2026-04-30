const { Op, where, Sequelize } = require("sequelize");
const paginator = require("../../../../libs/shared/utils/paginator");
const { literal } = require("sequelize");
const User = require("@models/user");
const moment = require("moment");
const { successResponse, simpleResponse, errorResponse } = require("@utils/response");
const { dateGenerate } = require("../../../../libs/shared/utils/dates");
const Category = require("@models/Category");
const Question = require("@models/question");
const statusCode = require("@utils/statusCodes");
const UserWallet = require("@models/userWallet");

module.exports = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    userList: async (req, res) => {
        try {
            const { page, limit, search = "", dateRange } = req.query;

            const where = {};

            // Search filter (name OR email)
            if (search && search.trim() !== "") {
                where[Op.or] = [
                    {
                        name: {
                            [Op.iLike]: `%${search.trim()}%`,
                        },
                    },
                    {
                        email: {
                            [Op.iLike]: `%${search.trim()}%`,
                        },
                    },
                ];
            }

            // Date Range filter
            if (dateRange) {
                const [startDate, endDate] = dateRange.split(" - ");
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);

                    where.createdAt = {
                        [Op.between]: [start, end],
                    };
                }
            }

            // Use paginator utility
            const { offset, finalLimit, defaultPage } = paginator({ page, limit });

            const { rows, count } = await User.findAndCountAll({
                where,
                order: [["createdAt", "DESC"]],
                limit: finalLimit,
                offset,
                attributes: {
                    exclude: ["accessToken", "refreshToken", "password", "walletBalance"],
                },
                include: [
                    {
                        model: UserWallet,
                        as: "wallet",
                        attributes: ["type", "balance"],
                    },
                ],
            });
            const formattedUsers = rows.map((user) => {
                const userData = user.toJSON();

                const mainWallet = userData.wallet.find((w) => w.type === "MAIN");

                return {
                    ...userData,
                    wallet: mainWallet ? mainWallet.balance : null,
                };
            });

            const response = {
                users: formattedUsers,
                total: count,
                currentPage: defaultPage,
                firstItem: count === 0 ? 0 : (defaultPage - 1) * finalLimit + 1,
                lastItem: Math.min(defaultPage * finalLimit, count),
            };

            return res.status(statusCode.OK).json({
                status: true,
                result: response,
                message: "User fetched successfully",
            });
        } catch (error) {
            console.error("USER LIST ERROR:", error);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Something went wrong",
            });
        }
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    userDelete: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "User ID is required",
                });
            }

            await User.destroy({
                where: { id },
            });

            return res.status(statusCode.OK).json({
                status: true,
                message: "User deleted successfully",
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Something went wrong",
            });
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    toggleStatus: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "User ID is required",
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(statusCode.NOT_FOUND).json({
                    status: false,
                    message: "User not found",
                });
            }

            user.isActive = !user.isActive;

            await user.save();

            return res.status(statusCode.OK).json({
                status: true,
                message: `User is now ${user.isActive ? "Active" : "Inactive"}`,
                data: user,
            });
        } catch (error) {
            console.error("TOGGLE STATUS ERROR:", error);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    usersUpdate: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "User ID is required",
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(statusCode.NOT_FOUND).json({
                    status: false,
                    message: "User not found",
                });
            }

            const { fullName, email, wallet, active } = req.body;

            const nameRegex = /^[A-Za-z ]{3,22}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const walletRegex = /^\d+(\.\d{1,2})?$/;

            if (fullName && !nameRegex.test(fullName)) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid name. Only letters and spaces allowed (3–22 characters).",
                });
            }

            if (email && !emailRegex.test(email)) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid email format.",
                });
            }

            if (wallet && !walletRegex.test(wallet)) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid wallet amount. Max 2 decimals allowed.",
                });
            }

            if (fullName !== undefined) user.name = fullName;
            if (email !== undefined) user.email = email;
            if (wallet !== undefined) user.wallet = wallet;
            if (active !== undefined) user.isActive = active === "true" || active === true;

            await user.save();

            return res.status(statusCode.OK).json({
                status: true,
                message: "User updated successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    wallet: user.wallet,
                    isActive: user.isActive,
                },
            });
        } catch (error) {
            console.error("USER UPDATE ERROR:", error);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Something went wrong while updating the user",
            });
        }
    },
};
