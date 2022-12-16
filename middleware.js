module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    returnTo = req.originalUrl;
    console.log(`req.session.returnTo: ${req.session.returnTo}`);
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};
