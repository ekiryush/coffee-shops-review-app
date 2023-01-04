const express = require("express");
const router = express.Router();
const catchErrAsync = require("../utilities/catchErrAsync");
const CoffeeShop = require("../models/coffeeshop.js");
const { isLoggedIn, isAuthor, validateCoffeeshop } = require("../middleware");

router.get(
  "/",
  catchErrAsync(async (req, res) => {
    const coffeeshops = await CoffeeShop.find({});
    res.render("coffeeshops/index", { coffeeshops });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("coffeeshops/new");
});

router.get(
  "/:id",
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    const coffeeshop = await CoffeeShop.findById(id);
    if (!coffeeshop) {
      req.flash("error", "Cannot find that coffee shop!");
      res.redirect("/coffeeshops");
    } else {
      await (
        await coffeeshop.populate({
          path: "reviews",
          populate: { path: "author" },
        })
      ).populate("author");
      console.log(coffeeshop);
      res.render("coffeeshops/show", { coffeeshop });
    }
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    const coffeeshop = await CoffeeShop.findById(id);
    if (!coffeeshop) {
      req.flash("error", "Cannot edit that coffee shop!");
      res.redirect("/coffeeshops");
    }
    res.render("coffeeshops/edit", {
      coffeeshop,
      title: `Edit ${coffeeshop.title}`,
    });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCoffeeshop,
  catchErrAsync(async (req, res) => {
    const newCoffeeshop = new CoffeeShop(req.body.coffeeshop);
    newCoffeeshop.author = req.user._id;
    await newCoffeeshop.save();
    req.flash("success", "Successfully created a new coffee shop!");
    res.redirect(`/coffeeshops/${newCoffeeshop._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCoffeeshop,
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    await CoffeeShop.findByIdAndUpdate(id, req.body.coffeeshop);
    req.flash("success", "Successfully saved the changes!");
    res.redirect(`/coffeeshops/${req.params.id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    await CoffeeShop.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the coffee shop!");
    res.redirect("/coffeeshops");
  })
);

module.exports = router;
