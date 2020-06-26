var express = require('express');
var router = express.Router();
var Restaurant = require("../models/restaurants");
var middleware = require("../middleware/index.js");

//SHOW all hangout places
router.get("/", function(req, res){
	// GET ALL DATA FROM DB
	Restaurant.find({}, function(err, allRestaurant){
		if (err){
			console.log(err);
		} else {
			res.render("restaurants/index", {restaurants: allRestaurant, currentUser: req.user});
		}
	});
	//res.render("restaurants", {restaurants: restaurants});
});

//CREATE new hangout places.
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from new restaurant page and push it to existing restaurant list
	var name = req.body.name;
	var image = req.body.image;
	var city = req.body.city;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRestaurant = {name: name, image: image, city: city, description: description, author: author};
	// CREATE NEW RESTAURANT AND SAVE IT TO DB
	Restaurant.create(newRestaurant, function(err, newlyCreated){
		if (err){
			console.log(err);
		} else{
			//redirect back to form page
			res.redirect("/restaurants");
		};
	});
	// WE DONT NEED THIS ANYMORE //restaurants.push(newRestaurant);
});

//SHOW form to add new hangout place.
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("restaurants/new");
});

//SHOW us more info about one hangout place
router.get("/:id", function(req, res){
	//find the hangout place with the unique ID
	Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundHangout){
		if(err){
			console.log(err);
		} else {
			res.render("restaurants/show", {restaurant: foundHangout});
		}
	});
});

//EDIT hangout route
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
		Restaurant.findById(req.params.id, function(err, foundRestaurant){
			if(err){
				res.redirect("back");
			} else {
				res.render("restaurants/edit", {restaurant: foundRestaurant});
			}
	});
});

// UPDATE hangout route
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
	//find and update correct restaurant or hangout place
	Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
		if(err){
			res.redirect("/restaurants");
		} else {
			res.redirect("/restaurants/" + updatedRestaurant._id);
		}
	});
});

//DESTROY hangout route
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/restaurants");
		} else {
			res.redirect("/restaurants");
		}
	});
});


module.exports = router;
