"use strict";

const { Router } = require("express");

const methodNotAllowed = require("@utils/methodNotAllowed");


const {
    // createPage,
    getPageBySlug,
    getPageById,
    getPageForEdit,
    updatePageById,
    getPage } = require("../../controller/page");
const router = new Router();
const { editPageValidator } = require("../../controller/validators/admin.validator");
const { isAuthenticated } = require("@middleware/authValidatorAdmin");

router.route("/getPageById/:id").get(isAuthenticated, getPageById).all(methodNotAllowed);
router.route("/updatePageById").post(isAuthenticated, updatePageById).all(methodNotAllowed);
router.route("/pages").get(getPage).all(methodNotAllowed);
router.route("/staticPageData/:slug").get(getPageBySlug).all(methodNotAllowed);

module.exports = router;
