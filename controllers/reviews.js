const CoffeeShop = require("../models/coffeeshop.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const coffeeshop = await CoffeeShop.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  coffeeshop.reviews.push(newReview);
  await coffeeshop.save();
  await newReview.save();
  req.flash("success", "Successfully added a new review!");
  res.redirect(`/coffeeshops/${coffeeshop._id}`);
};

module.exports.deleteReview = async (req, res) => {
  await CoffeeShop.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewid },
  });
  await Review.findByIdAndDelete(req.params.reviewid);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/coffeeshops/${req.params.id}`);
};
