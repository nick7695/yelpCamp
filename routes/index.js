var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res){
	res.render("landing");
});



// ==================
// AUTH ROUTES
// ==================

// show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err);
			return res.render("register");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to Purlieu " + user.username);
				res.redirect("/restaurants");
			});
		}
	});
});

//show login form
router.get("/login", function(req, res){
	req.flash("success", "Logged in");
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {successRedirect: "/restaurants", failureRedirect: "/login"}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/restaurants");
});

module.exports = router;