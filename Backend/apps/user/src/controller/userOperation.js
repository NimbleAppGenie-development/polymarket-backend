const { Op, where, Sequelize } = require("sequelize");
const paginator = require("../../../../libs/shared/utils/paginator");
const { literal } = require("sequelize");
const User = require("@models/user");
const UserPredictedQuestion = require("@models/userpredictedquestions");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const statusCodes = require("../../../../libs/shared/utils/statusCodes");
const { successResponse, simpleResponse, errorResponse } = require("@utils/response");
const { dateGenerate } = require("../../../../libs/shared/utils/dates");
const Question = require("@models/question");
const QuestionOption = require("@models/questionOption");
const Admin = require("@models/adminModel");

module.exports = {
    userLogin: async (req, res, next) => {
        try {
            const { emailL, passwordL } = req.body;
            if (!emailL || !passwordL) {
                res.json(errorResponse([], "Email and password are required."));
                return;
            }
            const user = await User.findOne({ where: { email: emailL } });
            if (!user) {
                res.json(errorResponse([], "Account not exist."));
                return;
            }
            if (!user.isActive) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "User is inactive, please contact Admin",
                });
            }
            const passwordMatch = await user.verifyPassword(passwordL);
            if (!passwordMatch) {
                res.json(errorResponse([], "Invalid password."));
                return;
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
                expiresIn: "7d",
            });

            const { accessToken, refreshToken } = await user.generateToken();
            const tokens = {
                accessToken,
                refreshToken,
            };

            await user.save();

            res.json(
                successResponse(
                    {
                        body: {
                            tokens: tokens,
                            id: user.id,
                            name: user.name,
                            email: user.email,
                        },
                    },
                    "User login successfully.",
                ),
            );
        } catch (error) {
            console.error(error);
            res.json(errorResponse([], "An error occurred while logging in."));
        }
    },

    userRegister: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                res.json(errorResponse([], "Email is already registered."));
                return;
            }

            const newUser = await User.create({ name, email, password, isActive: true });
            const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET || "secret", {
                expiresIn: "7d",
            });

            const { accessToken, refreshToken } = (await newUser.generateToken?.()) || {
                accessToken: token,
                refreshToken: null,
            };

            res.json(
                successResponse(
                    {
                        userId: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        tokens: { accessToken, refreshToken },
                    },
                    "User registered successfully.",
                ),
            );
        } catch (error) {
            console.error(error);
            res.json(errorResponse([], "An error occurred while registering the user."));
        }
    },

    userLogout: async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "User not found",
                });
            }

            if (user) {
                user.accessToken = "NULL";
                user.refreshToken = "NULL";
                await user.save();
            }

            return res.status(statusCodes.OK).json(simpleResponse(true, "User Logged In Successfully"));
        } catch (error) {
            console.error("Logout error:", error);
            next(error);
        }
    },

    getUserPrdicationData: async (req, res, next) => {
        try {
            const { userId } = req.params;
            console.log("Fetching market detail for ID:", userId);
            const userPredictions = await UserPredictedQuestion.findAll({
                where: { userId },
            });
            res.json(successResponse(userPredictions, "Get user prediction data."));
        } catch (error) {
            console.error(error);
            res.json(errorResponse([], "An error occurred while registering the user."));
        }
    },

    userPrdication: async (req, res, next) => {
        try {
            const { userId, categoryId, questionId, selectedOption, amount } = req.body;

            if (!userId || !categoryId || !questionId || !selectedOption || !amount) {
                return res.json(errorResponse([], "All fields are required."));
            }

            if (isNaN(amount) || Number(amount) <= 0) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid amount",
                });
            }
            const questionOptions = await QuestionOption.findAll({
                where: { questionId },
            });

            const isDeclared = questionOptions.some((opt) => opt.resultStatus === true);

            if (isDeclared) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Betting already closed for this question",
                });
            }
            const optionData = await QuestionOption.findOne({
                where: {
                    id: selectedOption,
                },
            });

            if (!optionData) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Selected option not found",
                });
            }

            const optionPlain = optionData.get({ plain: true });

            const existUserOption = await UserPredictedQuestion.findOne({
                where: {
                    userId,
                    categoryId,
                    questionId,
                },
            });

            if (existUserOption) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "This user already selected this question",
                });
            }

            await UserPredictedQuestion.create({
                userId,
                categoryId,
                questionId,
                selectedOptionId: optionPlain.id,
                selectedOptionName: optionPlain.option,
                entryAmount: amount,
                multiplier: optionPlain.multiplier,
                winningStatus: "PENDING",
            });

            const admin = await Admin.findOne();

            await admin.increment("walletBalance", {
                by: Number(amount),
            });

            return res.json(successResponse([], "Prediction submitted successfully."));
        } catch (error) {
            console.error("userPrdication ERROR FULL:", error);
            console.error("userPrdication ERROR MSG:", error.message);
            console.error("userPrdication ERROR STACK:", error.stack);

            return res.json(errorResponse([], error.message));
        }
    },
};
