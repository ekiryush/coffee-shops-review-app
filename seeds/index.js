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
    const randomNum = Math.floor(Math.random() * 20);
    const price = (Math.random() * 5 + 2.5).toFixed(2);
    const newCoffeeShop = new CoffeeShop({
      title: `${pickRandom(descriptors)} ${pickRandom(names)}`,
      location: `${pickRandom(locations).city}, ${
        pickRandom(locations).neighbourhood
      }`,
      description:
        "This place is amazing! They offered the best coffee and showed the best attitude to its costumers. Internet connection is very fast and is unlimited as well. This place is indeed perfect for studying and chilling out. It was very quiet and air-conditioned. I just want to keep coming back to this place. Thank you!",
      image: `https://source.unsplash.com/400x400?coffee&${randomNum}`,
      price,
    });
    await newCoffeeShop.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
