var express = require('express');
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurants");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// ==============================
// Comments Routes
// ==============================

//Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find restaurants by ID
	Restaurant.findById(req.params.id, function(err, restaurant){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {restaurant: restaurant});
		}
	});
});

//Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup campground using ID
	Restaurant.findById(req.params.id, function(err, restaurant){
		if(err){
			req.flash("error", "Something went wrong!");
			console.log(err);
			res.redirect("/restaurants");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					restaurant.comments.push(comment);
					restaurant.save();
					console.log(comment);
					req.flash("success", "Successfully added a comment!");
					res.redirect("/restaurants/" + restaurant._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment
	//redirect to page
});

//EDIT comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Successfully editted a comment!");
			res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
		}
	})
});

//UPDATE comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Successfully updated a comment!");
			res.redirect("/restaurants/" + req.params.id);
		}
	})
});

//DELETE comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/restaurants/" + req.params.id);
		}
	})
});

module.exports = router;