"use strict";

const { Router } = require("express");

const methodNotAllowed = require("@utils/methodNotAllowed");
const { login } = require("../../controller/adminAuthService");
const { adminLoginValidator } = require("../../controller/validators/admin.validator");

const router = new Router();

router.route("/login").post(adminLoginValidator, login).all(methodNotAllowed);

module.exports = router;
