"use strict";

const { Router } = require("express");

const methodNotAllowed = require("@utils/methodNotAllowed");
const { getMarketList, getMarketDetail, getTrendingList,getShowInSlider, getGraphData, getLiveData } = require("../../controller/page");
const router = new Router();
const { editPageValidator } = require("../../controller/validators/admin.validator");
const { isAuthenticated } = require("@middleware/authValidatorUser");

router.route("/get-market-list").get(getMarketList).all(methodNotAllowed);
router.route("/get-market-detail/:id").get(getMarketDetail).all(methodNotAllowed);
router.route("/get-trending-list").get(getTrendingList).all(methodNotAllowed);
router.route("/get-show-slider").get(getShowInSlider).all(methodNotAllowed);
router.route("/get-graph-data/:questionId").get(getGraphData).all(methodNotAllowed);
router.route("/get-live-data").get(getLiveData).all(methodNotAllowed);

module.exports = router;
