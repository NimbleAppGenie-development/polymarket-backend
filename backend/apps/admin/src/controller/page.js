
const { Op } = require("sequelize");
const { literal } = require('sequelize');
const Page = require("@models/page");
const moment = require("moment");
const statusCodes = require("../../../../libs/shared/utils/statusCodes");
const { successResponse, simpleResponse } = require("@utils/response");
const Question = require("@models/question");
const Category = require("@models/Category");
const QuestionOption = require("@models/questionOption");

module.exports = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getPage: async (req, res, next) => {
        try {
            const admin = req.user;
            const pages = await Page.findAll({
                where: {
                    slug: {
                        [Op.notIn]: ["responsible-play"]
                    }
                }
            })

            if (!pages || pages.length === 0) return res.status(statusCodes.OK).json(successResponse([], "No pages found"));

            const formatted = pages.map(page => ({
                id: page.id,
                slug: page.slug,
                description: page.description,
                title: page.title,
                createdAt: moment(page.createdAt).format('YYYY-MM-DD HH:mm:ss')
            }));

            return res.status(statusCodes.OK).json(
                successResponse(formatted, "Page content fetched")
            );
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
    getPageById: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) throw new BadRequest(simpleResponse(false, "Admin not found"));
            const { id } = req.params;
            const page = await Page.findOne({
                where: { id },
                attributes: { exclude: ['updatedAt', 'createdAt'] }
            });

            if (!page) throw new NotFound(simpleResponse(false, "Page not found"));

            const formatted = {
                id: page.id,
                slug: page.slug,
                description: page.description,
                title: page.title,
                createdAt: moment(page.createdAt).format('YYYY-MM-DD HH:mm:ss')
            };

            return res.status(statusCodes.OK).json(
                successResponse(formatted, "Page content fetched")
            );
        } catch (error) {
            console.error("getPageById error:", error);
            next(error);
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    updatePageById: async (req, res, next) => {
        try {
            const admin = req.user;
            if (!admin) throw new BadRequest(simpleResponse(false, "Admin not found"));

            const { description, slug, title, id, content } = req.body;

            const updatedPage = await Page.findOne({ where: { id } });
            if (!updatedPage) throw new NotFound(simpleResponse(false, "Page not found"));

            const des = (description || "").trim().length < 1 ? JSON.stringify(content) : description;
            const titl = (title || "").trim().length < 1 ? updatedPage.title : title;
            const slg = (slug || "").trim().length < 1 ? updatedPage.slug : slug;

            await Page.update(
                {
                    description: des,
                    title: titl,
                    slug: slg
                },
                { where: { id } }
            );

            return res.status(statusCodes.OK).json(
                simpleResponse(true, "Page updated successfully")
            );
        } catch (error) {
            console.error("updatePageById error:", error);
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "We're sorry, but there was a problem processing your request.",
            });
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    getPageBySlug: async (req, res, next) => {
        try {
            const { slug } = req.params;
            if (!slug) throw new BadRequest(simpleResponse(false, "Slug is required"));

            let query = { slug: slug.toLowerCase() };

            const data = await Page.findOne({ where: query });

            let result = {};
            if (data) {
                result = {
                    id: data.id,
                    description: data.description,
                    title: data.title,
                }
            }

            return res.status(statusCodes.OK).json(successResponse(
                result,
                "Page content fetched successfully"
            ));
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    

};
