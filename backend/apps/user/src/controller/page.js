const { Op } = require("sequelize");
const { literal } = require("sequelize");
const Page = require("@models/page");
const moment = require("moment");
const statusCodes = require("../../../../libs/shared/utils/statusCodes");
const { successResponse, simpleResponse } = require("@utils/response");
const Question = require("@models/question");
const Category = require("@models/Category");
const QuestionOptions = require("@models/questionOption");
const UserPredictedQuestion = require("@models/userpredictedquestions");
const { Sequelize } = require("sequelize");

module.exports = {
    getMarketList: async (req, res, next) => {
        try {
            const marketList = await Question.findAll({
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name", "image"],
                    },
                    {
                        model: QuestionOptions,
                        as: "options",
                        attributes: ["id", "questionId", "option", "multiplier", "resultStatus", "image"],
                    },
                ],
            });

            if (!marketList || marketList.length === 0) {
                return res.status(statusCodes.OK).json(successResponse([], "No marketList found"));
            }

            const predictions = await UserPredictedQuestion.findAll({
                attributes: ["selectedOptionId", [Sequelize.fn("COUNT", Sequelize.col("selectedOptionId")), "count"]],
                group: ["selectedOptionId"],
                raw: true,
            });

            const countMap = {};

            predictions.forEach((p) => {
                countMap[p.selectedOptionId] = parseInt(p.count);
            });
            const closedQuestions = await QuestionOptions.findAll({
                where: { resultStatus: true },
                attributes: ["questionId"],
            });
            const closedQuestionIds = closedQuestions.map((q) => q.questionId);

            const filteredMarketList = marketList.filter((item) => {
                return !closedQuestionIds.includes(item.id);
            });

            const formatted = filteredMarketList.map((item) => {
                const plainItem = item.get({ plain: true });
                const totalVotes = plainItem.options.reduce((sum, opt) => {
                    return sum + (countMap[opt.id] || 0);
                }, 0);

                const optionsWithPercentage = plainItem.options.map((opt) => {
                    const count = countMap[opt.id] || 0;

                    return {
                        ...opt,
                        count,
                        percentage: totalVotes ? ((count / totalVotes) * 100).toFixed(0) : 0,
                    };
                });
                return {
                    id: plainItem.id,
                    question: plainItem.question,
                    description: plainItem.description,
                    status: plainItem.status,
                    category: plainItem.category,
                    options: optionsWithPercentage,
                    image: plainItem.image,
                    createdAt: moment(plainItem.createdAt).format("MM/DD/YYYY hh:mm A"),
                };
            });

            return res.status(statusCodes.OK).json(successResponse(formatted, "Market list fetched"));
        } catch (error) {
            console.error("getMarketList error:", error);
            next(error);
        }
    },

    /* getMarketDetail: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "ID is required",
                });
            }

            let query = { id: id.toLowerCase() };

            const data = await Question.findOne({
                where: query,
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name", "image"],
                    },
                    {
                        model: QuestionOptions,
                        as: "options",
                        attributes: ["id", "questionId", "option", "multiplier", "resultStatus","image"],
                    },
                ],
            });

            let result = {};
            if (data) {
                result = {
                    id: data.id,
                    question: data.question,
                    description: data.description,
                    marketRules: data.marketRules,
                    status: data.status,

                    category: data.category
                        ? {
                              id: data.category.id,
                              name: data.category.name,
                              image: data.category.image,
                          }
                        : null,

                    options: data.options
                        ? data.options.map((opt) => ({
                              id: opt.id,
                              option: opt.option,
                              multiplier: opt.multiplier,
                              resultStatus: opt.resultStatus,
                              image: opt.image
                          }))
                        : [],

                    createdAt: moment(data.createdAt).format("MM/DD/YYYY HH:mm:A"),
                };
            }

            return res.status(statusCodes.OK).json(successResponse(result, "Market fetched successfully"));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }, */

    getMarketDetail: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "ID is required",
                });
            }

            const data = await Question.findOne({
                where: { id },
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name", "image"],
                    },
                    {
                        model: QuestionOptions,
                        as: "options",
                        attributes: ["id", "questionId", "option", "multiplier", "resultStatus", "image"],
                    },
                ],
            });

            if (!data) {
                return res.status(statusCodes.OK).json(successResponse({}, "No data found"));
            }

            // ✅ prediction count
            const predictions = await UserPredictedQuestion.findAll({
                attributes: ["selectedOptionId", [Sequelize.fn("COUNT", Sequelize.col("selectedOptionId")), "count"]],
                group: ["selectedOptionId"],
                raw: true,
            });

            const countMap = {};
            predictions.forEach((p) => {
                countMap[p.selectedOptionId] = parseInt(p.count);
            });

            // ✅ total votes
            const totalVotes = data.options.reduce((sum, opt) => {
                return sum + (countMap[opt.id] || 0);
            }, 0);

            // ✅ options with %
            const optionsWithPercentage = data.options.map((opt) => {
                const count = countMap[opt.id] || 0;

                return {
                    id: opt.id,
                    option: opt.option,
                    multiplier: opt.multiplier,
                    resultStatus: opt.resultStatus,
                    image: opt.image,
                    count,
                    percentage: totalVotes ? ((count / totalVotes) * 100).toFixed(0) : 0,
                };
            });

            const result = {
                id: data.id,
                question: data.question,
                description: data.description,
                marketRules: data.marketRules,
                status: data.status,
                category: data.category,
                options: optionsWithPercentage,
                createdAt: moment(data.createdAt).format("MM/DD/YYYY HH:mm:A"),
            };

            return res.status(statusCodes.OK).json(successResponse(result, "Market fetched successfully"));
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    
    getTrendingList: async (req, res, next) => {
        try {
            const trendingList = await Question.findAll({
                order: [["createdAt", "DESC"]],
                where: {
                    isTrending: "true",
                },
            });

            const total = trendingList.length;

            if (!trendingList || trendingList.length === 0)
                return res.status(statusCodes.OK).json(successResponse([], "No trendingList found"));

            const formatted = trendingList.map((item) => ({
                id: item.id,
                question: item.question,
                description: item.description,
                status: item.status,
                trending: item.isTrending,
                createdAt: moment(item.createdAt).format("MM/DD/YYYY HH:mm:A"),
            }));
            return res.status(statusCodes.OK).json(successResponse(formatted, "Page content fetched"));
        } catch (error) {
            console.error("getPage error:", error);
            next(error);
        }
    },
};
