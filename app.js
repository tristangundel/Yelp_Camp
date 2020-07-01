// require express, bodyparser, and dotenv
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// declare and set port and app variables
const port = process.env.PORT || 3000;
const app = express();

// set view engine  and static folder for express
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// declare campground array for set up
let campgrounds = [
    {   name: "Salmon Creek",
        image: "https://blog-assets.thedyrt.com/uploads/2018/06/freecampingspot-2000x1120.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://www.familyeducation.com/sites/default/files/fe_slideshow/2010_06/Camping_Tent_1922387_H.jpg"
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbSgMHBURX0gS4gQ5S0n05lcP_xwaDTBYQJw&usqp=CAU"
    },
    {
        name: "Big Basin",
        image: "https://www.outsideonline.com/sites/default/files/styles/img_600x600/public/2018/05/31/favorite-free-camping-apps_s.jpg?itok=_jzf7iRS"
    },
    {
        name: "Big Sur",
        image: "https://www.tripsavvy.com/thmb/ekAcrsKGhqVjsQvxnMJpjv1ymvw=/2137x1403/filters:fill(auto,1)/sunrise-camping--676019412-5b873a5a46e0fb0050f2b7e0.jpg"
    },
    {
        name: "Lassin National Park",
        image: "https://media.wzzm13.com/assets/KUSA/images/c4403859-a976-48a1-8db2-4d180817128a/c4403859-a976-48a1-8db2-4d180817128a_750x422.jpg"
    },
    {
        name: "Josua Tree",
        image: "https://koa.com/blog/images/make-tent-camping-more-comfortable.jpg?preset=blogPhoto"
    },
    {
        name: "Death Valley",
        image: "https://cdn.vox-cdn.com/thumbor/FMUIaXcnBaKK9YqdP8qtxUog150=/0x0:4741x3161/1200x800/filters:focal(1992x1202:2750x1960)/cdn.vox-cdn.com/uploads/chorus_image/image/59535149/shutterstock_625918454.0.jpg"
    }
]

// home landing page route
app.get("/", function(req, res) {
    // render home/landing page
    res.render("landing");
});

// campground route
app.get("/campgrounds", function(req, res) {
    // render list of campgrounds
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

// add a campground route
app.post("/campgrounds", function(req, res) {
    let name = req.body.name;
    let img = req.body.image;
    let newCampground = {name: name, image: img};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

// start listening on specified port
app.listen(port, function(){
    console.log("Yelp Camp Server started. Listening on port: " + port);
});
