const Joi = require("joi");

const coffeeshopSchema = Joi.object({
  coffeeshop: Joi.object({
    title: Joi.string().required().min(4),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required().min(4),
    description: Joi.string().required().min(10),
    beverage: Joi.string(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

module.exports.coffeeshopSchema = coffeeshopSchema;
module.exports.reviewSchema = reviewSchema;
