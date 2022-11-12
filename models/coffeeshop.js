const mongoose = require("mongoose");

const CoffeeShopSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  beverage: String,
  price: Number,
});

module.exports = mongoose.model("CoffeeShop", CoffeeShopSchema);
