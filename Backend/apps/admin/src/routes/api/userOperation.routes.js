"use strict";



const { Router } = require("express");



const methodNotAllowed = require("@utils/methodNotAllowed");

const {getCategory, addCategory,getCategoryById,editCategory, 
    getQuestionForWinner,announceWinner,deleteCategory,updateCategoryStatus,
    getQuestions,addQuestion,updateQuestionStatus,
    updateQuestionTrending,getQuestionById,editQuestion,
    deleteQuestion,getStaticsCount } = require("../../controller/userOperation");

const { isAuthenticated } = require("@middleware/authValidatorAdmin");

const { createCategoryValidator, createQuestionValidator } = require("../../controller/validators/admin.validator");

const upload = require("./uploadMiddleware");

const router = new Router();



router.route("/dashboard").get(isAuthenticated, getStaticsCount).all(methodNotAllowed);



/* Category */

router.route("/category").get(isAuthenticated, getCategory).all(methodNotAllowed);

router.route("/category/addCategory").post(isAuthenticated, upload("category").single("image"), addCategory).all(methodNotAllowed);

router.route("/categoryById/:id").get(isAuthenticated, getCategoryById).all(methodNotAllowed);

router.route("/category/editCategory").post(isAuthenticated, upload("category").single("image"), editCategory).all(methodNotAllowed);

router.route("/category/deleteCategory").post(isAuthenticated, deleteCategory).all(methodNotAllowed);

router.route("/category/update-status/:id").get(isAuthenticated, updateCategoryStatus).all(methodNotAllowed);



/* Question */

router.route("/questions").get(isAuthenticated, getQuestions).all(methodNotAllowed);

router.route("/question/add").post(isAuthenticated, createQuestionValidator, addQuestion).all(methodNotAllowed);

router.route("/question/update-status/:id").get(isAuthenticated, updateQuestionStatus).all(methodNotAllowed);
router.route("/question/update-trending/:id").get(isAuthenticated, updateQuestionTrending).all(methodNotAllowed);

router.route("/questionById/:id").get(isAuthenticated, getQuestionById).all(methodNotAllowed);
router.route("/question/winner/:id").get(isAuthenticated, getQuestionForWinner).all(methodNotAllowed);
router.route("/question/announce-winner").post(isAuthenticated, announceWinner).all(methodNotAllowed);

router.route("/question/edit").post(isAuthenticated, editQuestion).all(methodNotAllowed);

router.route("/question/delete").post(isAuthenticated, deleteQuestion).all(methodNotAllowed);





module.exports = router;