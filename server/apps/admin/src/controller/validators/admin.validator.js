const Joi = require("joi");
const { BadRequest } = require('../../../../../libs/shared/utils/statusCodes');
const { errorResponse } = require("../../../../../libs/shared/utils/response");

const adminLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const createMatchSchema = Joi.object({
    teamA: Joi.string().required(),
    teamAShortName: Joi.string().required(),
    teamB: Joi.string().required(),
    teamBShortName: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().allow(null).required(),
    prize: Joi.number().required(),
    date: Joi.date().required(),
});

const createQuestionSchema = Joi.object({
    matchId: Joi.string().required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    optionA: Joi.number().required(),
    optionB: Joi.number().required(),
    optionAValue: Joi.string(),
    optionBValue: Joi.string(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().valid('pre', 'live').required(),
});

const editPageSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().required(),
});

const adminLoginValidator = (req, res, next) => {
    const { error } = adminLoginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((item) => item.message);
        throw new BadRequest(errorResponse(errorMessages, errorMessages));
    }
    next();
};

const createMatchValidator = (req, res, next) => {
    const { error } = createMatchSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((item) => item.message);
        throw new BadRequest(errorResponse(errorMessages, errorMessages));
    }
    next();
};

const createQuestionValidator = (req, res, next) => {
    const { error } = createQuestionSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((item) => item.message);
        throw new BadRequest(errorResponse(errorMessages, errorMessages));
    }
    next();
};

const editPageValidator = (req, res, next) => {
    const { error } = editPageSchema.validate(req.body, { abortEarly: false });
    console.log("+++++++++++++++++++++", error)
    if (error) {
        const errorMessages = error.details.map((item) => item.message);
        throw new BadRequest(errorResponse(errorMessages, errorMessages));
    }
    next();
};

module.exports = {
    adminLoginValidator,
    createMatchValidator,
    createQuestionValidator,
    editPageValidator
};