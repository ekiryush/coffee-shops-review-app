const express = require("express");
const router = express.Router();
const catchErrAsync = require("../utilities/catchErrAsync");
const ExpressError = require("../utilities/ExpressError");
const CoffeeShop = require("../models/coffeeshop.js");
const { coffeeshopSchema } = require("../schemas.js");

const validateCoffeeshop = (req, res, next) => {
  const { error } = coffeeshopSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchErrAsync(async (req, res) => {
    const coffeeshops = await CoffeeShop.find({});
    res.render("coffeeshops/index", { coffeeshops });
  })
);

router.get("/new", (req, res) => {
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
      await coffeeshop.populate("reviews");
      res.render("coffeeshops/show", { coffeeshop });
    }
  })
);

router.get(
  "/:id/edit",
  catchErrAsync(async (req, res) => {
    const coffeeshop = await CoffeeShop.findById(req.params.id);
    if (!coffeeshop) {
      req.flash("error", "Cannot edit that coffee shop!");
      res.redirect("/coffeeshops");
    } else {
      res.render("coffeeshops/edit", {
        coffeeshop,
        title: `Edit ${coffeeshop.title}`,
      });
    }
  })
);

router.post(
  "/",
  validateCoffeeshop,
  catchErrAsync(async (req, res) => {
    const newCoffeeshop = new CoffeeShop(req.body.coffeeshop);
    await newCoffeeshop.save();
    req.flash("success", "Successfully created a new coffee shop!");
    res.redirect(`/coffeeshops/${newCoffeeshop._id}`);
  })
);

router.put(
  "/:id",
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
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    const coffeeshop = await CoffeeShop.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the coffee shop!");
    res.redirect("/coffeeshops");
  })
);

module.exports = router;
