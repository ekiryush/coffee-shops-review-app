const express = require("express");
const router = express.Router();
const coffeeshops = require("../controllers/coffeeshops");
const catchErrAsync = require("../utilities/catchErrAsync");
const {
  isLoggedIn,
  isAuthor,
  validateCoffeeshop,
  addImage,
} = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", catchErrAsync(coffeeshops.index));

router.get("/new", isLoggedIn, coffeeshops.renderNewForm);

router.get("/:id", catchErrAsync(coffeeshops.showCoffeeShop));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchErrAsync(coffeeshops.renderEditForm)
);

router.get(
  "/:id/editimage",
  isLoggedIn,
  isAuthor,
  catchErrAsync(coffeeshops.renderEditImageForm)
);

router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateCoffeeshop,
  catchErrAsync(coffeeshops.createCoffeeShop)
);

router.put(
  "/image/:id",
  isLoggedIn,
  isAuthor,
  upload.single("image"),
  catchErrAsync(coffeeshops.updateCoffeeShopImage)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.single("image"),
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
