const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { coffeeshopSchema } = require("./schemas.js");
const catchErrAsync = require("./utilities/catchErrAsync");
const ExpressError = require("./utilities/ExpressError");
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

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCoffeeshop = (req, res, next) => {
  const { error } = coffeeshopSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get(
  "/coffeeshops",
  catchErrAsync(async (req, res) => {
    const coffeeshops = await CoffeeShop.find({});
    res.render("coffeeshops/index", { coffeeshops });
  })
);

app.get("/coffeeshops/new", (req, res) => {
  res.render("coffeeshops/new");
});

app.get(
  "/coffeeshops/:id",
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(id);
    const coffeeshop = await CoffeeShop.findById(id);
    res.render("coffeeshops/show", { coffeeshop });
  })
);

app.get(
  "/coffeeshops/:id/edit",
  catchErrAsync(async (req, res) => {
    const coffeeshop = await CoffeeShop.findById(req.params.id);
    res.render("coffeeshops/edit", {
      coffeeshop,
      title: `Edit ${coffeeshop.title}`,
    });
  })
);

app.post(
  "/coffeeshops",
  validateCoffeeshop,
  catchErrAsync(async (req, res) => {
    const newCoffeeshop = new CoffeeShop(req.body.coffeeshop);
    await newCoffeeshop.save();
    res.redirect(`/coffeeshops/${newCoffeeshop._id}`);
  })
);

app.put(
  "/coffeeshops/:id",
  validateCoffeeshop,
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    await CoffeeShop.findByIdAndUpdate(id, req.body.coffeeshop);
    res.redirect(`/coffeeshops/${req.params.id}`);
  })
);

app.delete(
  "/coffeeshops/:id",
  catchErrAsync(async (req, res) => {
    const { id } = req.params;
    const coffeeshop = await CoffeeShop.findByIdAndDelete(id);
    res.redirect("/coffeeshops");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Serving on port 8080");
});
