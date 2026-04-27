"use strict";

const { Router } = require("express");

const methodNotAllowed = require("@utils/methodNotAllowed");
const {userLogin,userRegister,userAccountDetails,addMoney,userLogout,getUserPrdicationData,userPrdication,userPortfolio } = require("../../controller/userOperation");
const { isAuthenticated } = require("@middleware/authValidatorUser");
const upload = require("./uploadMiddleware");
const router = new Router();

router.route("/user-login").post(userLogin).all(methodNotAllowed);
router.route("/user-register").post(userRegister).all(methodNotAllowed);
router.route("/user-logout").post(isAuthenticated,userLogout).all(methodNotAllowed);
router.route("/user-account-details/:id").get(isAuthenticated,userAccountDetails).all(methodNotAllowed);
router.route("/add-money").post(isAuthenticated,addMoney).all(methodNotAllowed);
router.route("/get-user-prdication-data/:userId").get(isAuthenticated,getUserPrdicationData).all(methodNotAllowed);
router.route("/user-prdication").post(isAuthenticated,userPrdication).all(methodNotAllowed);
router.route("/user-portfolio/:id").get(isAuthenticated,userPortfolio).all(methodNotAllowed);




module.exports = router;
