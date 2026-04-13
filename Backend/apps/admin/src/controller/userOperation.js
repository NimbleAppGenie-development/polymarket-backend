const { Op, where, Sequelize } = require("sequelize");
const paginator = require("../../../../libs/shared/utils/paginator");
const { literal } = require("sequelize");
const User = require("@models/user");
const moment = require("moment");
const { BadRequest, Unauthorized, NotFound, Conflict } = require("../../../../libs/shared/utils/statusCodes");
// const statusCode = require("../../../../libs/shared/utils/statusCodes");
const { successResponse, simpleResponse, errorResponse } = require("@utils/response");
const { dateGenerate } = require("../../../../libs/shared/utils/dates");
const Category = require("@models/Category");
const Question = require("@models/question");
const QuestionOption = require("@models/questionOption");
const statusCode = require("@utils/statusCodes");

module.exports = {
    getStaticsCount: async (req, res, next) => {
        try {
            const user = await User.count();
            const category = await Category.count();
            const questions = await Question.count();

            return res.status(statusCode.OK).json(
                successResponse(
                    {
                        totalUser: user,
                        totalCategory: category,
                        totalQuestions: questions,
                    },
                    "Statics fetched successfully",
                ),
            );
        } catch (error) {
            console.error("Error fetching user count:", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getCategory: async (req, res, next) => {
        try {
            const admin = req.user;

            if (!admin) {
                // throw new BadRequest(simpleResponse(false, "Admin not found"));
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            let { search, page, limit, dateRange, filter } = req.query;

            // Default values
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;

            const offset = (page - 1) * limit;

            let whereQuery = {};

            // =========================
            // Date Range Filter
            // =========================

            if (dateRange && dateRange !== "") {
                let dateRangeArr = dateRange.split(" - ");

                if (dateRangeArr.length === 2) {
                    let startDate = dateGenerate({
                        date: dateRangeArr[0],
                        format: "YYYY-MM-DD 00:00:00",
                    });

                    let endDate = dateGenerate({
                        date: dateRangeArr[1],
                        format: "YYYY-MM-DD 23:59:59",
                    });

                    whereQuery.createdAt = {
                        [Op.between]: [startDate, endDate],
                    };
                }
            }

            // =========================
            // Search Filter (Optimized)
            // =========================

            if (search && search.trim() !== "") {
                whereQuery.name = {
                    [Op.iLike]: `%${search.trim()}%`,
                };
            }
            // =========================
            // Fetch Rows FIRST
            // =========================

            const rows = await Category.findAll({
                where: whereQuery,

                offset,

                limit,

                order: [["createdAt", "DESC"]],

                raw: true,
            });

            // =========================
            // Count Separately (Faster)
            // =========================

            const count = await Category.count({
                where: whereQuery,
            });

            // =========================
            // Format Data
            // =========================

            let enrichedCategories = rows.map((category) => ({
                categoryId: category.id,

                name: category.name,

                image: category.image,

                status: category.status,

                date: moment(category.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            }));

            const response = {
                allCategory: enrichedCategories,

                total: count,

                currentPage: page,

                firstItem: offset + 1,

                lastItem: Math.min(offset + limit, count),
            };

            return res.status(statusCode.OK).json(successResponse(response, "Category fetched successfully"));
        } catch (error) {
            console.error("CATEGORY ERROR:", error);

            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */

    addCategory: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { name } = req.body;

            // Handle uploaded files
            const image = req.file.filename || null;
            await Category.create({
                name,
                image,
                status: true,
            });

            return res.status(statusCode.OK).json(simpleResponse(true, "Category created successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    editCategory: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { name, id } = req.body;

            const category = await Category.findOne({ where: { id } });
            if (!category) {
                return res.status(statusCode.NOT_FOUND).json({
                    stutus: false,
                    message: "Match not found",
                });
            }

            // Handle uploaded images
            const file = req.file || null;

            if (file) {
                category.image = file.filename;
            }
            // Update other fields
            category.name = name;

            await category.save();

            // Respond immediately
            res.status(statusCode.OK).json(simpleResponse(true, "Category updated successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    updateCategoryStatus: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { id } = req.params;
            const category = await Category.findOne({ where: { id } });
            if (!category) {
                return res.status(statusCode.NOT_FOUND).json({
                    stutus: false,
                    message: "Category not found",
                });
            }

            category.status = !category.status;
            await category.save();

            return res.status(statusCode.OK).json(simpleResponse(true, "Category status update successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getCategoryById: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { id } = req.params;

            const category = await Category.findOne({ where: { id } });
            if (!category) {
                return res.status(statusCode.NOT_FOUND).json({
                    stutus: false,
                    message: "Match not found",
                });
            }
            const formattedMatch = {
                categoryId: category.id,
                name: category.name,
                image: category.image,
            };
            return res.status(statusCode.OK).json(successResponse(formattedMatch, "Category fetched successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    deleteCategory: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { categoryId } = req.body;

            const category = await Category.destroy({ where: { id: categoryId } });
            if (!category) {
                return res.status(statusCode.NOT_FOUND).json({
                    stutus: false,
                    message: "Category not found",
                });
            }

            return res.status(statusCode.OK).json(simpleResponse(true, "Category deleted successfully"));
        } catch (error) {
            next(error);
        }
    },

    getQuestions: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                // throw new BadRequest(simpleResponse(false, "Admin not found"));
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            let { search, page, limit, dateRange, type, categoryId } = req.query;
            type = type?.toLowerCase() || "all";

            let whereQuery = {};

            // Category filter
            if (categoryId) {
                whereQuery.categoryId = {
                    [Op.eq]: categoryId,
                };
            }

            // Date Range filter (FIXED)
            if (dateRange) {
                const [startDate, endDate] = dateRange.split(" - ");

                if (startDate && endDate) {
                    const start = moment(startDate).startOf("day").toDate();

                    const end = moment(endDate).endOf("day").toDate();

                    whereQuery.createdAt = {
                        [Op.between]: [start, end],
                    };
                }
            }

            if (search && search.trim() !== "") {
                whereQuery[Op.or] = [
                    {
                        question: {
                            [Op.iLike]: `%${search.trim()}%`,
                        },
                    },
                ];
            }

            let { offset, finalLimit, defaultPage } = paginator({ page, limit });

            let { count, rows } = await Question.findAndCountAll({
                where: whereQuery,
                offset,
                limit: finalLimit,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name"],
                    },
                    {
                        model: QuestionOption,
                        as: "options",
                        attributes: ["id", "option", "multiplier", "resultStatus"],
                    },
                ],
            });

            let questionsData = rows.map((q) => ({
                questionId: q.id,
                categoryId: q.categoryId,
                categoryName: q.category?.name || null,
                question: q.question,
                description: q.description,
                options: q.options || [],
                status: q.status,
                trending: q.isTrending,
                createdAt: q.createdAt,
            }));

            let response = {
                questions: questionsData,
                total: count,
                currentPage: defaultPage,
                firstItem: count === 0 ? 0 : (defaultPage - 1) * finalLimit + 1,
                lastItem: Math.min(defaultPage * finalLimit, count),
            };

            return res.status(statusCode.OK).json(successResponse(response, "Question fetched successfully"));
        } catch (error) {
            console.log("GET QUESTIONS ERROR:", error);
            next(error);
        }
    },
    addQuestion: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                // throw new BadRequest(simpleResponse(false, "Admin not found"));
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            let { categoryId, question, description, options } = req.body;

            const newQuestion = await Question.create({
                categoryId,
                question,
                description,
                status: true,
                isTrending: true,
            });
            if (!options || !Array.isArray(options) || options.length < 2) {
                throw new Error("At least 2 options required");
            }
            const optionData = options.map((opt) => ({
                questionId: newQuestion.id,
                option: opt.option,
                multiplier: opt.multiplier,
            }));

            await QuestionOption.bulkCreate(optionData);

            return res.status(statusCode.OK).json(simpleResponse(true, "Question created successfully"));
        } catch (error) {
            next(error);
            console.log("Add question error : ", error);
        }
    },

    updateQuestionStatus: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { id } = req.params;
            const question = await Question.findOne({ where: { id } });
            if (!question) {
                return res.status(statusCode.NOT_FOUND).json({
                    stutus: false,
                    message: "Question not found",
                });
            }
            question.status = !question.status;
            await question.save();

            return res.status(statusCode.OK).json(simpleResponse(true, "Question status update successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    updateQuestionTrending: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { id } = req.params;
            const question = await Question.findOne({ where: { id } });
            if (!question) {
                return res.status(statusCode.NOT_FOUND).json({
                    stutus: false,
                    message: "Question not found",
                });
            }

            question.isTrending = !question.isTrending;
            await question.save();

            return res.status(statusCode.OK).json(simpleResponse(true, "Question trending update successfully"));
        } catch (error) {
            next(error);
        }
    },

    /* getQuestionById: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { id } = req.params;
            console.log("QuestionId", id);

            const question = await Question.findOne({ where: { id } });
            const categoryN = question.categoryId;
            const categoryData = await Category.findOne({ where: { id: categoryN } });
            if (!question) throw new NotFound(simpleResponse(false, "Question not found"));

            const formattedQuestion = {
                categoryId: question.categoryId,
                categoryName: `${categoryData.name}`,
                question: question.question,
                description: question.description,
            };
            return res.status(statusCode.OK).json(successResponse(formattedQuestion, "Question fetched successfully"));
        } catch (error) {
            next(error);
        }
    }, */

    getQuestionById: async (req, res, next) => {
        try {
            const admin = req.user;

            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Admin not found",
                });
            }

            const { id } = req.params;

            const question = await Question.findOne({
                where: { id },
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name"],
                    },
                    {
                        model: QuestionOption,
                        as: "options",
                        attributes: ["id", "option", "multiplier"],
                    },
                ],
            });
            console.log("===================quesiton===========", question);
            if (!question) {
                throw new NotFound(simpleResponse(false, "Question not found"));
            }

            const formattedQuestion = {
                id: question.id,
                categoryId: question.categoryId,
                categoryName: question.category?.name || null,
                question: question.question,
                description: question.description,
                options: question.options.map((opt) => ({
                    option: opt.option,
                    multiplier: opt.multiplier,
                })),
            };

            return res.status(statusCode.OK).json(successResponse(formattedQuestion, "Question fetched successfully"));
        } catch (error) {
            next(error);
        }
    },

    /* editQuestion: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }

            const { categoryId, question, description, optionA, optionB, optionAValue, optionBValue, id } = req.body;

            const questionExists = await Question.findOne({ where: { id } });
            if (!questionExists) throw new NotFound(simpleResponse(false, "Question not found"));

            ((questionExists.categoryId = categoryId),
                (questionExists.question = question),
                (questionExists.optionA = optionA),
                (questionExists.optionB = optionB),
                (questionExists.optionAValue = optionAValue),
                (questionExists.optionBValue = optionBValue),
                (questionExists.description = description),
                await questionExists.save());

            return res.status(statusCode.OK).json(simpleResponse(true, "Question updated successfully"));
        } catch (error) {
            next(error);
        }
    }, */

    editQuestion: async (req, res, next) => {
        try {
            const admin = req.user;

            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Admin not found",
                });
            }

            const { id, categoryId, question, description, options } = req.body;

            // 1️⃣ CHECK QUESTION EXISTS
            const questionExists = await Question.findOne({ where: { id } });

            if (!questionExists) {
                throw new NotFound(simpleResponse(false, "Question not found"));
            }

            // 2️⃣ UPDATE MAIN QUESTION
            questionExists.categoryId = categoryId;
            questionExists.question = question;
            questionExists.description = description;

            await questionExists.save();

            // 3️⃣ DELETE OLD OPTIONS
            await QuestionOption.destroy({
                where: { questionId: id },
            });

            // 4️⃣ INSERT NEW OPTIONS
            if (Array.isArray(options) && options.length > 0) {
                const formattedOptions = options.map((opt) => ({
                    questionId: id,
                    option: opt.option,
                    multiplier: opt.multiplier,
                }));

                await QuestionOption.bulkCreate(formattedOptions);
            }

            return res.status(statusCode.OK).json(simpleResponse(true, "Question updated successfully"));
        } catch (error) {
            next(error);
        }
    },

    deleteQuestion: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    stutus: false,
                    message: "Admin not found",
                });
            }
            const { questionId } = req.body;
            const questionData = await Question.findOne({ where: { id: questionId } });
            if (!questionData) {
                return res.status(404).json(simpleResponse(false, "Question not found"));
            }

            const question = await Question.destroy({ where: { id: questionId } });
            if (!question) throw new NotFound(simpleResponse(false, "Question not found"));

            return res.status(statusCode.OK).json({
                status: true,
                message: "Question deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },
    getQuestionForWinner: async (req, res, next) => {
        try {
            const { id } = req.params;

            const question = await Question.findOne({
                where: { id },
                include: [
                    {
                        model: QuestionOption,
                        as: "options",
                        attributes: ["id", "option", "multiplier", "resultStatus"],
                    },
                ],
            });

            if (!question) {
                return res.status(404).json({
                    status: false,
                    message: "Question not found",
                });
            }

            return res.status(200).json({
                status: true,
                data: question,
            });
        } catch (error) {
            next(error);
        }
    },
    announceWinner: async (req, res, next) => {
        try {
            const { questionId, optionId } = req.body;

            // ❌ reset all options first
            await QuestionOption.update({ resultStatus: false }, { where: { questionId } });

            // ✅ mark selected option as winner
            await QuestionOption.update(
                { resultStatus: true },
                {
                    where: {
                        id: optionId,
                        questionId,
                    },
                },
            );

            return res.status(200).json({
                status: true,
                message: "Winner announced successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};
