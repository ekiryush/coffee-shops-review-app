const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchErrAsync = require("../utilities/catchErrAsync");
const User = require("../models/user.js");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post(
  "/register",
  catchErrAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Coffeemania");
        res.redirect("/coffeeshops");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/coffeeshops";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/coffeeshops");
  });
});

module.exports = router;
