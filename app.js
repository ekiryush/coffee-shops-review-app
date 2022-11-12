const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const CoffeeShop = require("./models/coffeeshop.js");

mongoose.connect("mongodb://localhost:27017/coffee-shops", {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/coffeeshops", async (req, res) => {
  const coffeeshops = await CoffeeShop.find({});
  res.render("coffeeshops/index", { coffeeshops });
});

app.get("/coffeeshops/new", (req, res) => {
  res.render("coffeeshops/new");
});

app.get("/coffeeshops/:id", async (req, res) => {
  const coffeeshop = await CoffeeShop.findById(req.params.id);
  res.render("coffeeshops/show", { coffeeshop });
});

app.get("/coffeeshops/:id/edit", async (req, res) => {
  const coffeeshop = await CoffeeShop.findById(req.params.id);
  res.render("coffeeshops/edit", { coffeeshop });
});

app.post("/coffeeshops", async (req, res) => {
  const coffeeshop = new CoffeeShop(req.body.coffeeshop);
  await coffeeshop.save();
  res.redirect(`/coffeeshops/${coffeeshop._id}`);
});

app.put("/coffeeshops/:id", async (req, res) => {
  const { id } = req.params;
  await CoffeeShop.findOneAndUpdate(id, req.body.coffeeshop);
  res.redirect(`/coffeeshops/${id}`);
});

app.delete("/coffeeshops/:id", async (req, res) => {
  const coffeeshop = await CoffeeShop.findByIdAndDelete(req.params.id);
  res.redirect("/coffeeshops");
});

app.listen(8080, () => {
  console.log("Serving on port 8080");
});
