const mongoose = require("mongoose");
const Review = require("./review");

const CoffeeShopSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  beverage: String,
  price: Number,
  image: String,
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
