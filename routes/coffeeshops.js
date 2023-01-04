const express = require("express");
const router = express.Router();
const coffeeshops = require("../controllers/coffeeshops");
const catchErrAsync = require("../utilities/catchErrAsync");
const CoffeeShop = require("../models/coffeeshop.js");
const { isLoggedIn, isAuthor, validateCoffeeshop } = require("../middleware");

router.get("/", catchErrAsync(coffeeshops.index));

router.get("/new", isLoggedIn, coffeeshops.renderNewForm);

router.get("/:id", catchErrAsync(coffeeshops.showCoffeeShop));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchErrAsync(coffeeshops.renderEditForm)
);

router.post(
  "/",
  isLoggedIn,
  validateCoffeeshop,
  catchErrAsync(coffeeshops.createCoffeeShop)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCoffeeshop,
  catchErrAsync(coffeeshops.updateCoffeeShop)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchErrAsync(coffeeshops.deleteCoffeeShop)
);

module.exports = router;
