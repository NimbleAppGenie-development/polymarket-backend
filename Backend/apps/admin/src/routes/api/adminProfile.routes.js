"use strict";

const { Router } = require("express");
const {
    myProfile, updateProfile, addMoney, getWalletBalance, logout
} = require("../../controller/adminProfileService");

const methodNotAllowed = require("@utils/methodNotAllowed");
const { isAuthenticated } = require("@middleware/authValidatorAdmin");
const upload = require("./uploadMiddleware"); 

const router = new Router();

router.route("/profile").get(isAuthenticated,myProfile).all(methodNotAllowed);
router.route("/addMoney").post(isAuthenticated,addMoney).all(methodNotAllowed);
router.route("/getWalletBalance").get(isAuthenticated,getWalletBalance).all(methodNotAllowed);
router.route("/logout").post(isAuthenticated, logout).all(methodNotAllowed);
router.route("/updateProfile").post(isAuthenticated , upload("admin-profile").single("profileImage"),updateProfile).all(methodNotAllowed);

module.exports = router;
