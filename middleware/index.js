const Campground = require("../models/campground");
const Comment = require("../models/comment");
let middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    // see if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        alert("You must be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }
};

middlewareObject.checkCommentOwnership = function(req, res, next) {
    // see if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        alert("You must be logged in to do that!");
        res.redirect("back");
    }
}


module.exports = middlewareObject;
