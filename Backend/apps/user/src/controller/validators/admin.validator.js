const Joi = require("joi");
const { BadRequest } = require('../../../../../libs/shared/utils/statusCodes');
const { errorResponse } = require("../../../../../libs/shared/utils/response");

const adminLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const createCategorySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
});
const createQuestionSchema = Joi.object({
    categoryId: Joi.string().required(),
    question: Joi.string().required(),
    description: Joi.string().required(),
    optionA: Joi.string().required(),
    optionB: Joi.string().required(),
    optionAValue: Joi.number().required(),
    optionBValue: Joi.number().required(),
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

const createCategoryValidator = (req, res, next) => {
    const { error } = createCategorySchema.validate(req.body, { abortEarly: false });
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
    if (error) {
        const errorMessages = error.details.map((item) => item.message);
        throw new BadRequest(errorResponse(errorMessages, errorMessages));
    }
    next();
};

module.exports = {
    adminLoginValidator,
    createCategoryValidator,
    createQuestionValidator,
    editPageValidator
};
