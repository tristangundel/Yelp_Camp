const express = require("express");
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
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

// CREATE - add a new campground to database
router.post("/", function(req, res) {
    // get data from form and store in variables
    let name = req.body.name;
    let img = req.body.image;
    let desc = req.body.description
    let newCampground = {name: name, image: img, description: desc};
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

module.exports = router;
