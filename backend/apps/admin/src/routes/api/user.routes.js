"use strict";

const { Router } = require("express");

const methodNotAllowed = require("@utils/methodNotAllowed");


const {userList, userDelete, toggleStatus,usersUpdate } = require("../../controller/user");
const router = new Router();
const { editPageValidator } = require("../../controller/validators/admin.validator");
const { isAuthenticated } = require("@middleware/authValidatorAdmin");

router.route("/userList").get(isAuthenticated, userList).all(methodNotAllowed);
router.route("/usersUpdate/:id").post(isAuthenticated, usersUpdate).all(methodNotAllowed);
router.route("/toggleStatus/:id").post(isAuthenticated, toggleStatus).all(methodNotAllowed);
router.route("/userDelete/:id").post(isAuthenticated, userDelete).all(methodNotAllowed);

module.exports = router;