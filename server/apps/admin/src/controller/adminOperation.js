const { Op } = require("sequelize");
const moment = require("moment");

const Category = require("../../../../libs/shared/models/Category");
const Market = require("../../../../libs/shared/models/Market");
const Question = require("../../../../libs/shared/models/Question");
const Option = require("../../../../libs/shared/models/Options");

const { BadRequest } = require("../../../../libs/shared/utils/statusCodes");
const { successResponse } = require("../../../../libs/shared/utils/response");

module.exports = {

    // ================= CATEGORY =================

    // ================= CREATE =================
    createCategory: async (req, res, next) => {
        try {
            const { name, icon, status } = req.body;
            console.log("name", name)
            console.log("icon", icon)
            console.log("status", status)
            if (!name) {
                throw new BadRequest("Category name is required");
            }

            const data = await Category.create({
                name: name.trim(),
                icon: icon || null,
                status: status ?? true
            });

            return res.json(successResponse(true, "Category created", data));
        } catch (e) { next(e); }
    },

    // ================= UPDATE =================
    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, icon, status } = req.body;

            const category = await Category.findByPk(id);
            if (!category) {
                throw new BadRequest("Category not found");
            }

            await category.update({
                ...(name && { name: name.trim() }),
                ...(icon !== undefined && { icon }),
                ...(status !== undefined && { status })
            });

            return res.json(successResponse(true, "Category updated", category));
        } catch (e) { next(e); }
    },

    // ================= DELETE =================
    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) {
                throw new BadRequest("Category not found");
            }

            await category.destroy();

            return res.json(successResponse(true, "Category deleted"));
        } catch (e) { next(e); }
    },

    // ================= LIST =================
    listCategories: async (req, res, next) => {
        try {
            let { page = 1, limit = 10, search, sort = "createdAt", order = "DESC" } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const where = {};

            if (search) {
                where.name = {
                    [Op.iLike]: `%${search.trim()}%`
                };
            }

            const { rows, count } = await Category.findAndCountAll({
                where,
                limit,
                offset: (page - 1) * limit,
                order: [[sort, order]]
            });

            return res.json(successResponse(true, "Category list", {
                categories: rows,
                total: count,
                page,
                limit
            }));
        } catch (e) { next(e); }
    },


    // ================= MARKET =================

    // ================= CREATE =================
    createMarket: async (req, res, next) => {
        try {
            const {
                title,
                description,
                categoryId,
                startTime,
                endTime,
                homeTabView,
                status
            } = req.body;

            if (!title) {
                throw new BadRequest("Market title is required");
            }

            if (!categoryId) {
                throw new BadRequest("Category is required");
            }

            // optional: validate category exists
            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new BadRequest("Invalid category");
            }

            const data = await Market.create({
                title: title.trim(),
                description: description || null,
                categoryId,
                startTime: startTime || null,
                endTime: endTime || null,
                homeTabView: homeTabView ?? false,
                status: status || "ACTIVE"
            });

            return res.json(successResponse(true, "Market created", data));
        } catch (e) { next(e); }
    },

    // ================= UPDATE =================
    updateMarket: async (req, res, next) => {
        try {
            const { id } = req.params;

            const market = await Market.findByPk(id);
            if (!market) {
                throw new BadRequest("Market not found");
            }

            const {
                title,
                description,
                categoryId,
                startTime,
                endTime,
                homeTabView,
                status
            } = req.body;

            // optional: validate category if updating
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    throw new BadRequest("Invalid category");
                }
            }

            await market.update({
                ...(title && { title: title.trim() }),
                ...(description !== undefined && { description }),
                ...(categoryId && { categoryId }),
                ...(startTime !== undefined && { startTime }),
                ...(endTime !== undefined && { endTime }),
                ...(homeTabView !== undefined && { homeTabView }),
                ...(status && { status })
            });

            return res.json(successResponse(true, "Market updated", market));
        } catch (e) { next(e); }
    },

    // ================= DELETE =================
    deleteMarket: async (req, res, next) => {
        try {
            const { id } = req.params;

            const market = await Market.findByPk(id);
            if (!market) {
                throw new BadRequest("Market not found");
            }

            await market.destroy();

            return res.json(successResponse(true, "Market deleted"));
        } catch (e) { next(e); }
    },

    // ================= LIST =================
    listMarkets: async (req, res, next) => {
        try {
            let {
                page = 1,
                limit = 10,
                search,
                status,
                categoryId,
                sort = "createdAt",
                order = "DESC"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const where = {};

            if (search) {
                where.title = {
                    [Op.iLike]: `%${search.trim()}%`
                };
            }

            if (status && status !== "ALL") {
                where.status = status;
            }

            if (categoryId) {
                where.categoryId = categoryId;
            }

            const { rows, count } = await Market.findAndCountAll({
                where,
                limit,
                offset: (page - 1) * limit,
                order: [[sort, order]],
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "name"]
                    }
                ]
            });

            return res.json(successResponse(true, "Market list", {
                markets: rows,
                total: count,
                page,
                limit
            }));

        } catch (e) { next(e); }
    },
    // ================= QUESTION =================

    createQuestion: async (req, res, next) => {
        try {
            const data = await Question.create(req.body);
            return res.json(successResponse(true, "Question created", data));
        } catch (e) { next(e); }
    },

    updateQuestion: async (req, res, next) => {
        try {
            await Question.update(req.body, { where: { id: req.params.id } });
            return res.json(successResponse(true, "Question updated"));
        } catch (e) { next(e); }
    },

    deleteQuestion: async (req, res, next) => {
        try {
            await Question.destroy({ where: { id: req.params.id } });
            return res.json(successResponse(true, "Question deleted"));
        } catch (e) { next(e); }
    },

    listQuestions: async (req, res, next) => {
        try {
            const { page = 1, limit = 10, search, marketId, status } = req.query;

            const where = {
                ...(search && { title: { [Op.iLike]: `%${search}%` } }),
                ...(marketId && { marketId }),
                ...(status && { status })
            };

            const data = await Question.findAndCountAll({
                where,
                include: [{ model: Option }],
                limit: +limit,
                offset: (page - 1) * limit,
                order: [["createdAt", "DESC"]]
            });

            return res.json(successResponse(true, "Question list", data));
        } catch (e) { next(e); }
    },

    // ================= OPTION =================

    createOption: async (req, res, next) => {
        try {
            const data = await Option.create(req.body);
            return res.json(successResponse(true, "Option created", data));
        } catch (e) { next(e); }
    },

    updateOption: async (req, res, next) => {
        try {
            await Option.update(req.body, { where: { id: req.params.id } });
            return res.json(successResponse(true, "Option updated"));
        } catch (e) { next(e); }
    },

    deleteOption: async (req, res, next) => {
        try {
            await Option.destroy({ where: { id: req.params.id } });
            return res.json(successResponse(true, "Option deleted"));
        } catch (e) { next(e); }
    },

    listOptions: async (req, res, next) => {
        try {
            const { questionId } = req.query;

            const data = await Option.findAll({
                where: { questionId }
            });

            return res.json(successResponse(true, "Option list", data));
        } catch (e) { next(e); }
    },

    // ================= RESULT (SET WINNER) =================

    resolveQuestion: async (req, res, next) => {
        try {
            const { questionId, winningOptionId } = req.body;

            await Question.update({
                winningOptionId,
                status: "RESOLVED",
                resolutionTime: moment().toDate()
            }, {
                where: { id: questionId }
            });

            return res.json(successResponse(true, "Question resolved"));
        } catch (e) { next(e); }
    }

};