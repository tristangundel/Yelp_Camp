// require express, mongoose, bodyparser, and dotenv
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
require('dotenv').config();

// declare and set port and app variables
const port = process.env.PORT || 3000;
const app = express();

// connect database and seed DB
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});
seedDB();

// application configuration
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// passport configuration
app.use(require('express-session')({
    secret: "Potato swam in the pool today!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW - show form to create a new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ==================
// COMMENTS ROUTES
// ==================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // find the camprgound with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

// ==================
// AUTH ROUTES
// ==================
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }
}

// start listening on specified port
app.listen(port, function(){
    console.log("Yelp Camp Server started. Listening on port: " + port);
});
