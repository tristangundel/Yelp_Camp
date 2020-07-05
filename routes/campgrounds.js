const express = require("express");
const middleware = require("../middleware");
const router = express.Router();
const Campground = require("../models/campground");


// INDEX - show all campgrounds
router.get("/", function(req, res) {
    // retrieve all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
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
    let img = req.body.image;
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name: name, image: img, description: desc, author: author};
    // create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
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
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // see if user is logged in
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
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
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;
