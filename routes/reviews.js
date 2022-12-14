const express = require("express");
const router = express.Router({ mergeParams: true });
const catchErrAsync = require("../utilities/catchErrAsync");
const ExpressError = require("../utilities/ExpressError");
const Review = require("../models/review.js");
const CoffeeShop = require("../models/coffeeshop.js");

const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchErrAsync(async (req, res) => {
    const coffeeshop = await CoffeeShop.findById(req.params.id);
    const newReview = new Review(req.body.review);
    coffeeshop.reviews.push(newReview);
    await coffeeshop.save();
    await newReview.save();
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/coffeeshops/${coffeeshop._id}`);
  })
);

router.delete(
  "/:reviewid",
  catchErrAsync(async (req, res) => {
    await CoffeeShop.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewid },
    });
    await Review.findByIdAndDelete(req.params.reviewid);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/coffeeshops/${req.params.id}`);
  })
);

module.exports = router;
