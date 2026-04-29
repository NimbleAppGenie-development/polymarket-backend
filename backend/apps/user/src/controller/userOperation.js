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
const Transaction = require("@models/transaction");
const UserWallet = require("@models/userWallet");
const Category = require("@models/Category");
const { randomUUID } = require("crypto");
const TransactionLimit = require("@models/transactionLimit");

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

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!email || !emailRegex.test(email)) {
                return res.json(errorResponse([], "Please enter a valid email address."));
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Password validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!password || !passwordRegex.test(password)) {
                return res.json(
                    errorResponse(
                        [],
                        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
                    ),
                );
            }

            const existingUser = await User.findOne({ where: { email: normalizedEmail } });
            if (existingUser) {
                return res.json(errorResponse([], "Email is already registered."));
            }

            const newUser = await User.create({
                name,
                email: normalizedEmail,
                password,
                isActive: true,
            });

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
                        id: newUser.id,
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

    userAccountDetails: async (req, res) => {
        try {
            const { id } = req.params;

            let { page = 1, limit = 10 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const offset = (page - 1) * limit;

            if (!id) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "ID not found",
                });
            }

            const user = await User.findOne({
                where: { id },
                attributes: {
                    exclude: ["password", "accessToken", "refreshToken"],
                },
                include: [
                    {
                        model: UserWallet,
                        as: "wallet",
                        attributes: ["userId", "type", "balance"],
                    },
                ],
            });

            if (!user) {
                return res.status(statusCodes.NOT_FOUND).json({
                    status: false,
                    message: "User not found",
                });
            }

            const wallet = await UserWallet.findOne({
                where: {
                    userId: id,
                    type: "MAIN",
                },
            });

            const { count, rows } = await Transaction.findAndCountAll({
                where: { userId: id },
                order: [["createdAt", "DESC"]],
                limit,
                offset,
            });

            return res.json({
                status: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    availableBalance: user.wallet?.find((w) => w.type === "MAIN")?.balance || 0,
                    winningBalance: user.wallet?.find((w) => w.type === "WINNING")?.balance || 0,

                    transactions: rows,

                    total: count,
                    page,
                    limit,
                    firstItem: count === 0 ? 0 : offset + 1,
                    lastItem: Math.min(offset + limit, count),
                },
            });
        } catch (error) {
            console.error("userAccountDetails ERROR:", error);

            return res.status(500).json({
                status: false,
                message: "Internal server error",
            });
        }
    },

    addMoney: async (req, res, next) => {
        try {
            const { userId, amount, type } = req.body;

            if (!userId || !amount || !type) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "All fields are required",
                });
            }

            const addAmount = Number(amount);

            if (isNaN(addAmount) || addAmount <= 0) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid amount",
                });
            }

            const user = await User.findOne({
                where: { id: userId },
                attributes: { exclude: ["password", "accessToken", "refreshToken"] },
                include: [
                    {
                        model: UserWallet,
                        as: "wallet",
                        attributes: ["userId", "type", "balance"],
                    },
                ],
            });

            if (!user) {
                return res.status(statusCodes.NOT_FOUND).json({
                    status: false,
                    message: "User not found",
                });
            }

            const newBalance = Number(user.walletBalance || 0) + addAmount;

            if (type === "MAIN") {
                const wallet = await UserWallet.findOne({
                    where: {
                        userId,
                        type: "MAIN",
                    },
                });

                if (!wallet) {
                    // create new wallet
                    await UserWallet.create({
                        userId,
                        type: "MAIN",
                        balance: addAmount,
                    });
                } else {
                    // update existing wallet
                    await wallet.update({
                        balance: Number(wallet.balance || 0) + addAmount,
                    });
                }
            }
            await Transaction.create({
                userId,
                transactionId: `TXN-${randomUUID()}`,
                amount,
                type: "DEPOSIT",
                status: "SUCCESS",
                response: JSON.stringify({ userId }),
            });

            return res.json({
                status: true,
                message: "Money added successfully",
                data: {
                    walletBalance: newBalance,
                },
            });
        } catch (error) {
            console.error("addMoney ERROR:", error);

            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Internal server error",
            });
        }
    },

    withdrawMoney: async (req, res, next) => {
        try {
            const { userId, amount, type } = req.body;

            if (!userId || !amount || !type) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "All fields are required",
                });
            }

            const deductAmount = Number(amount);

            if (isNaN(deductAmount) || deductAmount <= 0) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid amount",
                });
            }

            const user = await User.findOne({
                where: { id: userId },
                attributes: { exclude: ["password", "accessToken", "refreshToken"] },
                include: [
                    {
                        model: UserWallet,
                        as: "wallet",
                        attributes: ["userId", "type", "balance"],
                    },
                ],
            });

            if (!user) {
                return res.status(statusCodes.NOT_FOUND).json({
                    status: false,
                    message: "User not found",
                });
            }

            const withdrawLimit = await TransactionLimit.findOne();
            if (
                Number(amount) < Number(withdrawLimit.minWithdrawAmount) ||
                Number(amount) > Number(withdrawLimit.maxWithdrawAmount)
            ) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: `Amount must be between ${withdrawLimit.minWithdrawAmount} and ${withdrawLimit.maxWithdrawAmount}`,
                });
            }
            const newBalance = Number(user.walletBalance || 0) - deductAmount;

            if (type === "WINNING") {
                
                const wallet = await UserWallet.findOne({
                    where: {
                        userId,
                        type: "WINNING",
                    },
                });
                if(!wallet){
                    return res.status(statusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Winning wallet not found"
                    })
                }
                if (Number(wallet.balance) < deductAmount) {
                    return res.status(statusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Insufficient winning balance",
                    });
                }
                if (!wallet) {
                    await UserWallet.create({
                        userId,
                        type: "WINNING",
                        balance: deductAmount,
                    });
                } else {
                    await wallet.update({
                        balance: Number(wallet.balance || 0) - deductAmount,
                    });
                }
            }
            await Transaction.create({
                userId,
                transactionId: `TXN-${randomUUID()}`,
                amount,
                type: "WITHDRAW",
                status: "PENDING",
                response: JSON.stringify({ userId }),
            });

            return res.json({
                status: true,
                message: "Money withdraw successfully",
                data: {
                    walletBalance: newBalance,
                },
            });
        } catch (error) {
            console.error("Withdraw money ERROR:", error);

            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Internal server error",
            });
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
            const { userId, categoryId, questionId, selectedOption, amount, type } = req.body;

            if (!userId || !categoryId || !questionId || !selectedOption || !amount || !type) {
                return res.json(errorResponse([], "All fields are required."));
            }

            const betAmount = Number(amount);

            if (isNaN(betAmount) || betAmount <= 0) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid amount",
                });
            }

            const user = await User.findOne({
                where: { id: userId },
                attributes: { exclude: ["password", "accessToken", "refreshToken"] },
                include: [
                    {
                        model: UserWallet,
                        as: "wallet",
                        attributes: ["userId", "type", "balance"],
                    },
                ],
            });

            if (!user) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "User not found",
                });
            }

            const wallet = await UserWallet.findOne({
                where: {
                    userId,
                    type: "MAIN",
                },
            });

            if (!wallet || Number(wallet.balance) < betAmount) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Insufficient wallet balance",
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
                where: { id: selectedOption },
            });

            if (!optionData) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Selected option not found",
                });
            }

            const existUserOption = await UserPredictedQuestion.findOne({
                where: { userId, categoryId, questionId },
            });

            if (existUserOption) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "This user already selected this question",
                });
            }

            const optionPlain = optionData.get({ plain: true });

            await UserWallet.update(
                {
                    balance: Number(wallet.balance) - betAmount,
                },
                {
                    where: {
                        userId: userId,
                        type: "MAIN",
                    },
                },
            );

            // transaction log
            await Transaction.create({
                userId,
                amount: betAmount,
                type: "ENTRY",
                status: "SUCCESS",
                response: JSON.stringify({ questionId, selectedOption }),
            });

            await UserPredictedQuestion.create({
                userId,
                categoryId,
                questionId,
                selectedOptionId: optionPlain.id,
                selectedOptionName: optionPlain.option,
                entryAmount: betAmount,
                multiplier: optionPlain.multiplier,
                winningStatus: "PENDING",
            });

            const admin = await Admin.findOne();

            await admin.increment("walletBalance", {
                by: betAmount,
            });

            return res.json(successResponse([], "Prediction submitted successfully."));
        } catch (error) {
            console.error("userPrdication ERROR:", error);

            return res.json(errorResponse([], error.message));
        }
    },

    userPortfolio: async (req, res) => {
        try {
            const { id } = req.params;

            let { page = 1, limit = 10 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const offset = (page - 1) * limit;

            if (!id) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "ID not found",
                });
            }

            const user = await User.findOne({
                where: { id },
                attributes: {
                    exclude: ["password", "accessToken", "refreshToken"],
                },
                include: [
                    {
                        model: UserPredictedQuestion,
                        as: "predictedQuestions",
                        include: [
                            {
                                model: Question,
                                as: "question",
                                include: [
                                    {
                                        model: Category,
                                        as: "category",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (!user) {
                return res.status(statusCodes.NOT_FOUND).json({
                    status: false,
                    message: "User not found",
                });
            }

            const predictions = user.predictedQuestions || [];

            const openAll = predictions.filter((p) => p.winningStatus === "PENDING");

            const historyAll = predictions.filter((p) => ["WIN", "LOSS"].includes(p.winningStatus));

            const paginate = (arr) => {
                const total = arr.length;

                const data = arr.slice(offset, offset + limit);

                return {
                    data,
                    total,
                    firstItem: total === 0 ? 0 : offset + 1,
                    lastItem: Math.min(offset + limit, total),
                };
            };

            const formatData = (arr) =>
                arr.map((p) => ({
                    id: p.id,
                    entryAmount: p.entryAmount,
                    multiplier: p.multiplier,
                    winningStatus: p.winningStatus,
                    selectedOption: p.selectedOptionName,
                    question: p.question?.question,
                    category: p.question?.category?.name,
                    createdAt: p.createdAt,
                }));

            const openPaginated = paginate(openAll);
            const historyPaginated = paginate(historyAll);

            return res.status(statusCodes.OK).json({
                status: true,
                data: {
                    open: formatData(openPaginated.data),
                    history: formatData(historyPaginated.data),

                    totalOpen: openPaginated.total,
                    totalHistory: historyPaginated.total,

                    firstItem: openPaginated.firstItem,
                    lastItem: openPaginated.lastItem,
                },
            });
        } catch (error) {
            console.error("userPortfolio ERROR:", error);

            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Internal server error",
            });
        }
    },
};
