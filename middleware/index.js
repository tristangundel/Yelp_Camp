const Campground = require("../models/campground");
const Comment = require("../models/comment");
let middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    // see if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                if (!foundCampground) {
                    req.flash("error", "Campground not found");
                    return res.redirect("back");
                }
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/login")
    }
};

middlewareObject.checkCommentOwnership = function(req, res, next) {
    // see if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (!foundComment) {
                    req.flash("error", "Comment not found");
                    return res.redirect("back");
                }
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}


module.exports = middlewareObject;
