// require express, mongoose, bodyparser, and dotenv
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config();

// declare and set port and app variables
const port = process.env.PORT || 3000;
const app = express();

// connect database
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});

// set view engine  and static folder for express
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// schema setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// home landing page route
app.get("/", function(req, res) {
    // render home/landing page
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
    // retrieve all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            // render campgrounds page with all campgrounds
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW - show form to create a new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

// CREATE - add a new campground to database
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/:id", function(req, res){
    // find the camprgound with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
})

// start listening on specified port
app.listen(port, function(){
    console.log("Yelp Camp Server started. Listening on port: " + port);
});
