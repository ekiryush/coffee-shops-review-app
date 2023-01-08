const CoffeeShop = require("../models/coffeeshop.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const coffeeshops = await CoffeeShop.find({});
  res.render("coffeeshops/index", { coffeeshops });
};

module.exports.renderNewForm = (req, res) => {
  res.render("coffeeshops/new");
};

module.exports.createCoffeeShop = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.coffeeshop.location,
      limit: 1,
    })
    .send();
  const newCoffeeshop = new CoffeeShop(req.body.coffeeshop);
  const randomNum1 = Math.random();
  const randomNum2 = Math.random();
  newCoffeeshop.geometry = geoData.body.features[0].geometry;
  newCoffeeshop.author = req.user._id;
  if (req.file) {
    newCoffeeshop.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    newCoffeeshop.image = {
      url: "/images/noimage.webp",
      filename: `CoffeeShopApp/${randomNum1}rhnjawlrtmqz${randomNum2}sp`,
    };
  }
  await newCoffeeshop.save();
  console.log(newCoffeeshop);
  req.flash("success", "Successfully created a new coffee shop!");
  res.redirect(`/coffeeshops/${newCoffeeshop._id}`);
};

module.exports.showCoffeeShop = async (req, res) => {
  const { id } = req.params;
  const coffeeshop = await CoffeeShop.findById(id);
  if (!coffeeshop) {
    req.flash("error", "Cannot find that coffee shop!");
    res.redirect("/coffeeshops");
  } else {
    await (
      await coffeeshop.populate({
        path: "reviews",
        populate: { path: "author" },
      })
    ).populate("author");
    console.log(coffeeshop);
    res.render("coffeeshops/show", { coffeeshop });
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const coffeeshop = await CoffeeShop.findById(id);
  if (!coffeeshop) {
    req.flash("error", "Cannot edit that coffee shop!");
    res.redirect("/coffeeshops");
  }
  res.render("coffeeshops/edit", {
    coffeeshop,
    title: `Edit ${coffeeshop.title}`,
  });
};

module.exports.renderEditImageForm = async (req, res) => {
  const { id } = req.params;
  const coffeeshop = await CoffeeShop.findById(id);
  if (!coffeeshop) {
    req.flash("error", "Cannot edit that coffee shop!");
    res.redirect("/coffeeshops");
  }
  res.render("coffeeshops/editimage", {
    coffeeshop,
    title: `Edit ${coffeeshop.title}`,
  });
};

module.exports.updateCoffeeShop = async (req, res) => {
  const { id } = req.params;
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.coffeeshop.location,
      limit: 1,
    })
    .send();
  const coffeeshop = await CoffeeShop.findByIdAndUpdate(
    id,
    req.body.coffeeshop
  );
  coffeeshop.geometry = geoData.body.features[0].geometry;
  await coffeeshop.save();
  req.flash("success", "Successfully saved the changes!");
  res.redirect(`/coffeeshops/${req.params.id}`);
};

module.exports.updateCoffeeShopImage = async (req, res) => {
  const { id } = req.params;
  const randomNum1 = Math.random();
  const randomNum2 = Math.random();
  if (req.file) {
    const coffeeshop = await CoffeeShop.findByIdAndUpdate(id, {
      $set: { image: { url: req.file.path, filename: req.file.filename } },
    });
    await coffeeshop.save();
  } else {
    const coffeeshop = await CoffeeShop.findByIdAndUpdate(id, {
      $set: {
        image: {
          url: "/images/noimage.webp",
          filename: `CoffeeShopApp/${randomNum1}rhnjasdkftmqz${randomNum2}sp`,
        },
      },
    });
    await coffeeshop.save();
  }
  req.flash("success", "Successfully saved the changes!");
  res.redirect(`/coffeeshops/${req.params.id}`);
};

module.exports.deleteCoffeeShop = async (req, res) => {
  const { id } = req.params;
  await CoffeeShop.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the coffee shop!");
  res.redirect("/coffeeshops");
};
