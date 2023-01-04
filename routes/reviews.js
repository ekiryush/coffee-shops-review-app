const express = require("express");
const router = express.Router({ mergeParams: true });
const catchErrAsync = require("../utilities/catchErrAsync");
const Review = require("../models/review.js");
const reviews = require("../controllers/reviews");
const CoffeeShop = require("../models/coffeeshop.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchErrAsync(reviews.createReview)
);

router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  catchErrAsync(reviews.deleteReview)
);

module.exports = router;
