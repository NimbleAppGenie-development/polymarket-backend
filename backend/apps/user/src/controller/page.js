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
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

            //prediction count
            const predictions = await UserPredictedQuestion.findAll({
                attributes: ["selectedOptionId", [Sequelize.fn("COUNT", Sequelize.col("selectedOptionId")), "count"]],
                group: ["selectedOptionId"],
                raw: true,
            });

            const countMap = {};
            predictions.forEach((p) => {
                countMap[p.selectedOptionId] = parseInt(p.count);
            });

            // total votes
            const totalVotes = data.options.reduce((sum, opt) => {
                return sum + (countMap[opt.id] || 0);
            }, 0);
            const totalEntryAmountOnQuestion = await UserPredictedQuestion.sum("entryAmount", {
                where: { questionId: id },
            });
            
            //options with %
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
                totalEntryAmountOnQuestion,
                createdAt: moment(data.createdAt).format("MM/DD/YYYY HH:mm:A"),
            };

            return res.status(statusCodes.OK).json(successResponse(result, "Market fetched successfully"));
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
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

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getShowInSlider: async (req, res, next) => {
        try {
            const showSlider = await Question.findAll({
                order: [["createdAt", "DESC"]],
                where: {
                    showInSlider: "true",
                },
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name"],
                    },
                ],
            });

            const total = showSlider.length;

            if (!showSlider || showSlider.length === 0)
                return res.status(statusCodes.OK).json(successResponse([], "No showSlider found"));

            const formatted = showSlider.map((item) => ({
                id: item.id,
                question: item.question,
                description: item.description,
                status: item.status,
                showInSlider: item.showInSlider,
                category: item.category,
                createdAt: moment(item.createdAt).format("MM/DD/YYYY HH:mm:A"),
            }));
            return res.status(statusCodes.OK).json(successResponse(formatted, "Page content fetched"));
        } catch (error) {
            console.error("getPage error:", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getGraphData: async (req, res, next) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                return res.status(statusCodes.BAD_REQUEST).json(errorResponse([], "Question ID required"));
            }

            const predictions = await UserPredictedQuestion.findAll({
                where: { questionId },
                attributes: ["selectedOptionId", "createdAt"],
                order: [["createdAt", "ASC"]],
                raw: true,
            });

            if (!predictions.length) {
                return res.status(statusCodes.OK).json(successResponse([], "No graph data found"));
            }

            const options = await QuestionOptions.findAll({
                where: { questionId },
                attributes: ["id", "option"],
                raw: true,
            });

            const cumulativeVotes = {};
            options.forEach((opt) => {
                cumulativeVotes[opt.id] = 0;
            });

            // Group predictions by minute bucket
            const timeBuckets = {};
            predictions.forEach((pred) => {
                const timeKey = moment(pred.createdAt).format("YYYY-MM-DD HH:mm");
                if (!timeBuckets[timeKey]) {
                    timeBuckets[timeKey] = [];
                }
                timeBuckets[timeKey].push(pred.selectedOptionId);
            });

            const graphData = [];

            // For each time bucket, ADD to cumulative then calculate %
            Object.keys(timeBuckets)
                .sort()
                .forEach(async (time) => {
                    const votes = timeBuckets[time];

                    // Add this bucket's votes to cumulative
                    votes.forEach((optId) => {
                        if (cumulativeVotes[optId] !== undefined) {
                            cumulativeVotes[optId]++;
                        }
                    });

                    // Total votes so far (cumulative)
                    const totalVotes = Object.values(cumulativeVotes).reduce((a, b) => a + b, 0);

                    // Calculate percentage for each option based on ALL votes so far
                    options.forEach((opt) => {
                        const count = cumulativeVotes[opt.id] || 0;
                        const percentage = totalVotes ? Number(((count / totalVotes) * 100).toFixed(1)) : 0;

                        graphData.push({
                            time,
                            optionId: opt.id,
                            option: opt.option.trim(),
                            percentage,
                        });
                    });
                });

            return res.status(statusCodes.OK).json(successResponse(graphData, "Graph data fetched"));
        } catch (error) {
            console.error("getGraphData error:", error);
            next(error);
        }
    },
    
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getLiveData: async (req, res, next) => {
        try {
            const liveData = await Question.findAll({
                where: {status: "true"},
                attributes:["id", "question", "description", "status"],
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name","image"],
                    },
                    {
                        model: QuestionOptions,
                        as: "options",
                        attributes: ["id", "questionId", "option", "multiplier", "resultStatus", "image"],
                    }
                ]
            })
            
            return res.status(statusCodes.OK).json(successResponse(liveData, "Live data fetched"));
        } catch (error) {
            console.error("getLiveData error:", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getHowItWorks: async (req, res, next) => {
        try {
            const howItWorksPage = await Page.findAll({
                order: [['createdAt', 'ASC']],
                where: { slug: "how-it-works" },
            })
            const formatted = howItWorksPage.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm')
            }));
            return res.status(statusCodes.OK).json(
                successResponse(formatted, "How it works content fetched successfully")
            )
        } catch (error) {
            console.error("getHowItWorks error:", error);
            next(error);
        }
    }
};
