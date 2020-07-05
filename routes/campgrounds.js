const express = require("express");
const middleware = require("../middleware");
const router = express.Router();
const Campground = require("../models/campground");


// INDEX - show all campgrounds
router.get("/", function(req, res) {
    // retrieve all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            // render campgrounds page with all campgrounds
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE - add a new campground to database
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and store in variables
    let name = req.body.name;
    let price = req.body.price;
    let img = req.body.image;
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name: name, price: price, image: img, description: desc, author: author};
    // create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - detail page for a single campground
router.get("/:id", function(req, res){
    // find the camprgound with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            req.flash("error", "Campground not found");
            console.log(err);
            return res.redirect("back");
        }
        if (!foundCampground) {
            req.flash("error", "Campground not found");
            console.log(err);
            return res.redirect("back");
        }
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

// EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // see if user is logged in
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;
