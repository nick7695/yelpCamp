var Restaurant = ("../models/restaurants");
var Comment = ("../models/comment");
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
			//does user own the restaurant
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}	
	});
	} else {
		res.redirect("back");
	}
};


middlewareObj.checkRestaurantOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Restaurant.findById(req.params.id, function(err, foundRestaurant){
			if(err){
				res.redirect("back");
		} else {
			//does user own the restaurant
			if(foundRestaurant.author.id.equals(req.user._id)){
				next();
			} else {
				res.redirect("back");
			}
		}
	});
	} else {
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first");
	res.redirect("/login");
};

module.exports = middlewareObj;