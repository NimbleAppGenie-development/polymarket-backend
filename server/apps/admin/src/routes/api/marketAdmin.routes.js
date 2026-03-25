"use strict";

const { Router } = require("express");
const methodNotAllowed = require("@utils/methodNotAllowed");

const {
    createMarket,
    getMarkets,
    getMarketById,
    updateMarket,
    deleteMarket,
    updateMarketStatus,
    getAllCategories
} = require("../../controller/marketAdminService");

const router = new Router();

/**
 * Create + List
 */
router.route("/")
    .post(createMarket)
    .get(getMarkets)
    .all(methodNotAllowed);

/**
 * Categories dropdown
 */
router.route("/categories")
    .get(getAllCategories)
    .all(methodNotAllowed);

/**
 * Single Market
 */
router.route("/:id")
    .get(getMarketById)
    .put(updateMarket)
    .delete(deleteMarket)
    .all(methodNotAllowed);

/**
 * Status Update
 */
router.route("/:id/status")
    .patch(updateMarketStatus)
    .all(methodNotAllowed);

module.exports = router;