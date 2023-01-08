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
  const newCoffeeShop = new CoffeeShop({
    author: "63b828f12bd25bd4ae05ca81",
    title: `Balzac's Coffee Roasters`,
    location: `43 Hanna Ave #123, Toronto, Liberty Village`,
    description:
      "In Balzac's smooth interpretation of a 1950s café, they have created an airy space with sleek touches, such as an authentic zinc bar from Paris and custom-made Art Deco floor tiles. Balzac’s third café, opened in 2006, resides in Toronto’s hotbed of high-tech, media and cultural companies — a place for the free exchange of ideas and a village within a city that preserves its links to the past while forgoing a vision of a lofty future.",
    image: {
      url: "../images/balzacs.webp",
      filename: "CoffeeShopApp/Balzac'sCoffeeRoasters",
    },
    geometry: { type: "Point", coordinates: [-79.420744, 43.63837] },
  });
  await newCoffeeShop.save();
};

seedDB().then(() => {
  mongoose.connection.close();
});
