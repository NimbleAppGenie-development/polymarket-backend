const { v4: uuidv4 } = require("uuid");

const { Op, where, Sequelize } = require("sequelize");
const paginator = require("../../../../libs/shared/utils/paginator");
const { literal } = require("sequelize");
const User = require("@models/user");
const moment = require("moment");
const { BadRequest, Unauthorized, NotFound, Conflict } = require("../../../../libs/shared/utils/statusCodes");
const { successResponse, simpleResponse, errorResponse } = require("@utils/response");
const { dateGenerate } = require("../../../../libs/shared/utils/dates");
const Category = require("@models/Category");
const Question = require("@models/question");
const QuestionOption = require("@models/questionOption");
const statusCode = require("@utils/statusCodes");
const UserPredictedQuestion = require("@models/userpredictedquestions");
const declareWinners = require("../services/declareWinners.service");
const NONE_OPTION_ID = "62758fdf-b62e-4cb7-a755-d189e4b8afa0";

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

            const rows = await Category.findAll({
                where: whereQuery,

                offset,

                limit,

                order: [["createdAt", "DESC"]],

                raw: true,
            });

            const count = await Category.count({
                where: whereQuery,
            });

            // Format Data

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
            const image = req.file.filename || null;
            const category = await Category.findAll();

            const categoryExist = category?.map((opt) => opt.name);

            if (categoryExist.includes(name)) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Category already exist",
                });
            }
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

            const file = req.file || null;

            if (file) {
                category.image = file.filename;
            }

            category.name = name;

            await category.save();

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

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

            if (categoryId) {
                whereQuery.categoryId = {
                    [Op.eq]: categoryId,
                };
            }

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
            const totalQuestion = await Question.count();

            let questionsData = rows.map((q) => ({
                questionId: q.id,
                categoryId: q.categoryId,
                categoryName: q.category?.name || null,
                question: q.question,
                description: q.description,
                options: q.options || [],
                status: q.status,
                trending: q.isTrending,
                showInSlider: q.showInSlider,
                eventStartDate: q.eventStartDate,
                eventEndDate: q.eventEndDate,
                createdAt: q.createdAt,
            }));

            let response = {
                questions: questionsData,
                total: totalQuestion,
                currentPage: defaultPage,
                firstItem: totalQuestion === 0 ? 0 : (defaultPage - 1) * finalLimit + 1,
                lastItem: Math.min(defaultPage * finalLimit, totalQuestion),
            };

            return res.status(statusCode.OK).json(successResponse(response, "Question fetched successfully"));
        } catch (error) {
            console.log("GET QUESTIONS ERROR:", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    addQuestion: async (req, res, next) => {
        try {
            const admin = req.user;
            const files = req.files || [];
            let options = [];
            let { categoryId, question, description, marketRules, eventStartDate, eventEndDate } = req.body;

            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

            files.forEach((file) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    throw new Error("Invalid file type. Only JPG, PNG, WEBP allowed");
                }
            });

            if (!categoryId || !question || !description || !marketRules || !eventStartDate || !eventEndDate) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Required fields missing",
                });
            }

            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Admin not found",
                });
            }

            try {
                options = JSON.parse(req.body.options || "[]");
            } catch (err) {
                options = [];
            }

            if (!options || !Array.isArray(options) || options.length < 2) {
                throw new Error("At least 2 options required");
            }

            // create question
            const newQuestion = await Question.create({
                categoryId,
                question,
                description,
                marketRules,
                status: true,
                isTrending: true,
                showInSlider: true,
                eventStartDate,
                eventEndDate,
            });

            const optionData = options.map((opt, index) => ({
                questionId: newQuestion.id,
                option: opt.option,
                multiplier: opt.multiplier,
                image: files[index] ? files[index].filename : null,
            }));

            await QuestionOption.bulkCreate(optionData);
            await QuestionOption.create({
                id: uuidv4(),
                questionId: newQuestion.id,
                option: "None of the Above",
                multiplier: 0,
                image: null,
            });

            return res.status(statusCode.OK).json(simpleResponse(true, "Question created successfully"));
        } catch (error) {
            console.log("Add question error : ", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    updateShowInSlider: async (req, res, next) => {
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

            question.showInSlider = !question.showInSlider;
            await question.save();

            return res.status(statusCode.OK).json(simpleResponse(true, "Question slider update successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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
                        required: false,
                        attributes: ["id", "option", "multiplier", "image"],
                        where: {
                            option: {
                                [Op.ne]: "None of the Above",
                            },
                        },
                    },
                ],
            });
            if (!question) {
                throw new NotFound(simpleResponse(false, "Question not found"));
            }
            const formatDate = (date) => {
                if (!date) return null;

                const d = new Date(date);
                if (isNaN(d.getTime())) return null;

                return d.toISOString();
            };
            const formattedQuestion = {
                id: question.id,
                categoryId: question.categoryId,
                categoryName: question.category?.name || null,
                question: question.question,
                description: question.description,
                marketRules: question.marketRules,
                options: question.options.map((opt) => ({
                    option: opt.option,
                    multiplier: opt.multiplier,
                    image: opt.image,
                })),
                eventStartDate: formatDate(question.eventStartDate),
                eventEndDate: formatDate(question.eventEndDate),
            };

            return res.status(statusCode.OK).json(successResponse(formattedQuestion, "Question fetched successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    editQuestion: async (req, res, next) => {
        try {
            const admin = req.user;
            const files = req.files || [];

            if (!admin) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: false,
                    message: "Admin not found",
                });
            }

            const { id, categoryId, question, description, options, marketRules, eventStartDate, eventEndDate } =
                req.body;

            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

            files.forEach((file) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    throw new Error("Invalid file type. Only JPG, PNG, WEBP allowed");
                }
            });

            const questionExists = await Question.findOne({ where: { id } });

            if (!questionExists) {
                throw new NotFound(simpleResponse(false, "Question not found"));
            }

            questionExists.categoryId = categoryId;
            questionExists.question = question;
            questionExists.description = description;
            questionExists.marketRules = marketRules;
            questionExists.eventStartDate = eventStartDate;
            questionExists.eventEndDate = eventEndDate;

            await questionExists.save();

            await QuestionOption.destroy({
                where: {
                    questionId: id,
                    option: {
                        [Op.ne]: "None of the Above",
                    },
                },
            });

            let parsedOptions = typeof options === "string" ? JSON.parse(options) : options;

            const imageIndexes = req.body.imageIndexes || [];

            const formattedOptions = parsedOptions.map((opt, index) => {
                let fileIndex = -1;

                if (Array.isArray(imageIndexes)) {
                    fileIndex = imageIndexes.indexOf(index.toString());
                } else if (imageIndexes == index) {
                    fileIndex = 0;
                }

                return {
                    questionId: id,
                    option: opt.option,
                    multiplier: opt.multiplier,
                    image:
                        fileIndex !== -1 ? files[fileIndex].filename : typeof opt.image === "string" ? opt.image : null,
                };
            });

            await QuestionOption.bulkCreate(formattedOptions);

            return res.status(statusCode.OK).json(simpleResponse(true, "Question updated successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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
                return res.status(statusCode.NOT_FOUND).json(simpleResponse(false, "Question not found"));
            }

            const question = await Question.destroy({ where: { id: questionId } });
            await QuestionOption.destroy({ where: { questionId } });

            if (!question) throw new NotFound(simpleResponse(false, "Question not found"));

            return res.status(statusCode.OK).json({
                status: true,
                message: "Question deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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
                return res.status(statusCode.NOT_FOUND).json({
                    status: false,
                    message: "Question not found",
                });
            }

            return res.status(statusCode.OK).json({
                status: true,
                data: question,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    announceWinner: async (req, res, next) => {
        try {
            const { questionId, optionId, type } = req.body;

            await QuestionOption.update({ resultStatus: false }, { where: { questionId } });

            if (optionId !== NONE_OPTION_ID) {
                await QuestionOption.update(
                    { resultStatus: true },
                    {
                        where: {
                            id: optionId,
                            questionId,
                        },
                    },
                );
            }

            declareWinners({ questionId, answerId: optionId, type }).then(console.log);

            return res.status(statusCode.OK).json({
                status: true,
                message: "Winner announced successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};
