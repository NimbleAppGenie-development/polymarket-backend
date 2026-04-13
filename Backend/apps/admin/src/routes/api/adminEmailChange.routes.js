"use strict";

const { Router } = require("express");

const methodNotAllowed = require("@utils/methodNotAllowed");
const {verifyEmailOTPForUpdateEmail, sendOTPForupdateEmail, resendOTPForUpdateEmail  } = require("../../controller/adminEmailChange");
const { isAuthenticated } = require("@middleware/authValidatorUser");
const router = new Router();

router.route("/sendOTPForupdateEmail").post(isAuthenticated , sendOTPForupdateEmail).all(methodNotAllowed);
router.route("/resendOTPForUpdateEmail").post(isAuthenticated ,resendOTPForUpdateEmail).all(methodNotAllowed);
router.route("/verifyEmailOTPForUpdateEmail").post(isAuthenticated ,verifyEmailOTPForUpdateEmail).all(methodNotAllowed);

module.exports = router;
