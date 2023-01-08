const mongoose = require("mongoose");
const Review = require("./review");

const CoffeeShopSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  beverage: String,
  price: Number,
  image: {
    url: String,
    filename: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CoffeeShopSchema.post("findOneAndDelete", async function (deletedCoffeeShop) {
  if (deletedCoffeeShop) {
    await Review.deleteMany({ _id: { $in: deletedCoffeeShop.reviews } });
  }
});

module.exports = mongoose.model("CoffeeShop", CoffeeShopSchema);
