
const { Op } = require("sequelize");
const { literal } = require('sequelize');
const Page = require("@models/page");
const moment = require("moment");
const statusCodes  = require("../../../../libs/shared/utils/statusCodes");
const { successResponse, simpleResponse } = require("@utils/response");
const Question = require("@models/question");
const Category = require("@models/Category");

module.exports = {
    getMarketList: async (req, res, next) => {
        try {
            const marketList = await Question.findAll({
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name", "image"]
                    }
                ]
            });

            const total = marketList.length;

            if (!marketList || marketList.length === 0) 
                return res.status(statusCodes.OK).json(
                    successResponse([], "No marketList found"
                ));

            const formatted = marketList.map(item => ({
                id: item.id,
                question: item.question,
                description: item.description,
                optionA: item.optionA,
                optionB: item.optionB,
                optionAValue: item.optionAValue,
                optionBValue: item.optionBValue,
                status: item.status,
                category: item.category ? { id: item.category.id, name: item.category.name, image: item.category.image } : null,
                createdAt: moment(item.createdAt).format('MM/DD/YYYY HH:mm:A')
            }));
            return res.status(statusCodes.OK).json(
                successResponse(
                    formatted,
                    "Page content fetched")
            );
        } catch (error) {
            console.error("getPage error:", error);
            next(error);
        }
    },

    getMarketDetail: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new BadRequest(simpleResponse(false, "ID is required"));

            let query = { id: id.toLowerCase() };

            const data = await Question.findOne({
                where: query,
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name", "image"]
                    }
                ]
            });

            let result = {};
            if (data) {
                result = {
                    id: data.id,
                    question: data.question,
                    description: data.description,
                    optionA: data.optionA,
                    optionB: data.optionB,
                    optionAValue: data.optionAValue,
                    optionBValue: data.optionBValue,
                    status: data.status,
                    category: data.category ? { id: data.category.id, name: data.category.name, image: data.category.image } : null,
                    createdAt: moment(data.createdAt).format('MM/DD/YYYY HH:mm:A')
                }
            }

            return res.status(statusCodes.OK).json(successResponse(
                result,
                "Market fetched successfully"
            ));
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    getTrendingList: async(req,res,next) => {
        try {
            const trendingList = await Question.findAll({
                order: [["createdAt", "DESC"]],
                where: {
                    isTrending: "true"
                }
                /* include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name", "image"]
                    }
                ] */
            });
            console.log("================Backend======",trendingList)
            
            const total = trendingList.length;

            if (!trendingList || trendingList.length === 0) 
                return res.status(statusCodes.OK).json(
                    successResponse([], "No trendingList found"
                ));

            const formatted = trendingList.map(item => ({
                id: item.id,
                question: item.question,
                description: item.description,
                optionA: item.optionA,
                optionB: item.optionB,
                optionAValue: item.optionAValue,
                optionBValue: item.optionBValue,
                status: item.status,
                trending: item.isTrending,
                createdAt: moment(item.createdAt).format('MM/DD/YYYY HH:mm:A')
            }));
            return res.status(statusCodes.OK).json(
                successResponse(
                    formatted,
                    "Page content fetched")
            );
        } catch (error) {
            console.error("getPage error:", error);
            next(error);
        }
    },

};
