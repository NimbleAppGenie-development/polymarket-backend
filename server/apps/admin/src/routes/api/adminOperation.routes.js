"use strict";

const { Router } = require("express");
const methodNotAllowed = require("@utils/methodNotAllowed");

const controller = require("../../controller/adminOperation");

const router = new Router();

// ===== CATEGORY =====
router.route("/category")
    .post(controller.createCategory)
    .get(controller.listCategories)
    .all(methodNotAllowed);

router.route("/category/:id")
    .put(controller.updateCategory)
    .delete(controller.deleteCategory)
    .all(methodNotAllowed);

// ===== MARKET =====
router.route("/market")
    .post(controller.createMarket)
    .get(controller.listMarkets)
    .all(methodNotAllowed);

router.route("/market/:id")
    .put(controller.updateMarket)
    .delete(controller.deleteMarket)
    .all(methodNotAllowed);

// ===== QUESTION =====
router.route("/question")
    .post(controller.createQuestion)
    .get(controller.listQuestions)
    .all(methodNotAllowed);

router.route("/question/:id")
    .put(controller.updateQuestion)
    .delete(controller.deleteQuestion)
    .all(methodNotAllowed);

// ===== OPTION =====
router.route("/option")
    .post(controller.createOption)
    .get(controller.listOptions)
    .all(methodNotAllowed);

router.route("/option/:id")
    .put(controller.updateOption)
    .delete(controller.deleteOption)
    .all(methodNotAllowed);

// ===== RESOLVE =====
router.route("/question/resolve")
    .post(controller.resolveQuestion)
    .all(methodNotAllowed);

module.exports = router;