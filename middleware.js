const { coffeeshopSchema, reviewSchema } = require("./schemas.js");

const ExpressError = require("./utilities/ExpressError");
const CoffeeShop = require("./models/coffeeshop.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCoffeeshop = (req, res, next) => {
  const { error } = coffeeshopSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const coffeeshop = await CoffeeShop.findById(id);
  if (!coffeeshop.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this!");
    return res.redirect(`/coffeeshops/${id}`);
  }
  next();
};

module.exports.addImage = async (req, res, next) => {
  const { id } = req.params;
  const coffeeshop = await CoffeeShop.findById(id);
  if (!coffeeshop.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this!");
    return res.redirect(`/coffeeshops/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this!");
    return res.redirect(`/coffeeshops/${id}`);
  }
  next();
};
