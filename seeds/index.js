const mongoose = require("mongoose");
const locations = require("./locations.js");
const { descriptors, names } = require("./seedHelpers.js");
const CoffeeShop = require("../models/coffeeshop.js");

mongoose.connect("mongodb://localhost:27017/coffee-shops", {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const pickRandom = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const seedDB = async () => {
  await CoffeeShop.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const newCoffeeShop = new CoffeeShop({
      title: `${pickRandom(descriptors)} ${pickRandom(names)}`,
      location: `${pickRandom(locations).city}, ${
        pickRandom(locations).neighbourhood
      }`,
    });
    await newCoffeeShop.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
