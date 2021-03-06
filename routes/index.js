const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");


// home landing page route
router.get("/", function(req, res) {
    // render home/landing page
    res.render("landing");
});

// ==================
// AUTH ROUTES
// ==================
// render form to register new user
router.get("/register", function(req, res) {
    res.render("register");
});

// post new user to database
router.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message)
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// render form to log in
router.get("/login", function(req, res) {
    res.render("login");
});

// post form information to authorize user login
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password."
    }), function(req, res) {

});


// route to log user out
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;
