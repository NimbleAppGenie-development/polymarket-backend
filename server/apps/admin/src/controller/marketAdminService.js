"use strict";

const { BadRequest, NotFound } = require("../../../../libs/shared/utils/statusCodes");
const { successResponse } = require("../../../../libs/shared/utils/response");
const Market = require("@models/market");
const { Op } = require("sequelize");

module.exports = {

    /**
     * Create Market
     */
    createMarket: async (req, res, next) => {
        try {
            const { title, description, category, homeTabView } = req.body;

            if (!title) throw new BadRequest("Title is required");

            const market = await Market.create({
                title,
                description,
                category,
                homeTabView
            });

            res.json(successResponse(true, market, "Market created successfully"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get All Markets (with optional filters)
     */
    getMarkets: async (req, res, next) => {
        try {
            const { status, search } = req.query;

            let where = {};

            if (status) where.status = status;

            if (search) {
                where.title = {
                    [Op.iLike]: `%${search}%`
                };
            }

            const markets = await Market.findAll({
                where,
                order: [["createdAt", "DESC"]]
            });

            res.json(successResponse(true, markets, "Markets fetched"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get Single Market
     */
    getMarketById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const market = await Market.findByPk(id);
            if (!market) throw new NotFound("Market not found");

            res.json(successResponse(true, market, "Market fetched"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update Market
     */
    updateMarket: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description, category, homeTabView } = req.body;

            const market = await Market.findByPk(id);
            if (!market) throw new NotFound("Market not found");

            await market.update({
                title,
                description,
                category,
                homeTabView
            });

            res.json(successResponse(true, market, "Market updated"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Delete Market
     */
    deleteMarket: async (req, res, next) => {
        try {
            const { id } = req.params;

            const market = await Market.findByPk(id);
            if (!market) throw new NotFound("Market not found");

            await market.destroy();

            res.json(successResponse(true, "Market deleted"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update Status (ACTIVE / INACTIVE)
     */
    updateMarketStatus: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!["ACTIVE", "INACTIVE"].includes(status)) {
                throw new BadRequest("Invalid status");
            }

            const market = await Market.findByPk(id);
            if (!market) throw new NotFound("Market not found");

            market.status = status;
            await market.save();

            res.json(successResponse(true, market, "Status updated"));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get All Unique Categories (for dropdown)
     */
    getAllCategories: async (req, res, next) => {
        try {
            const markets = await Market.findAll({
                attributes: ["category"]
            });

            let categories = [];

            markets.forEach(m => {
                if (Array.isArray(m.category)) {
                    categories.push(...m.category);
                }
            });

            // Unique values
            const uniqueCategories = [...new Set(categories)];

            res.json(successResponse(true, uniqueCategories, "Categories fetched"));
        } catch (error) {
            next(error);
        }
    }
};