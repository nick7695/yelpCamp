var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Restaurant = require("./models/restaurants");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds"); //Seed the DB

//Requiring Routes
var commentRoutes 		= require("./routes/comments");
var	restaurantRoutes 	= require("./routes/restaurants");
var	indexRoutes 		= require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //Seed the DB

//PASSPORT AUTHENTICATION
app.use(require("express-session")({
		secret: "Once upon a time in Mumbai",
		resave: false,
		saveUninitialized: false
		}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Restaurant.create(
	//	{
	//		name: "Firouz",
	//		image: "https://www.instagram.com/p/BvU0d8VlFWs/media?size=l",
	//		city: "Ottawa",
	//		description: "Middle Eastern Restaurant"
	//	}, function (err, restaurant){
	//		if (err){
	//			console.log(err);
	//		} else {
	//			console.log("Newly created hangout place");
	//			console.log(restaurant);
	//		}
	//	});

//var restaurants = [
		//{name: "Firouz", image: "https://www.instagram.com/p/BvU0d8VlFWs/media?size=l", city: "Ottawa"},
		//{name: "Riviera", image: "https://www.instagram.com/p/BzjZWzIF9cS/media?size=l", city: "Ottawa"},
		//{name: "India Curry and Kebab House", image: "https://www.yourultimatemenu.com/wp-content/uploads/2019/07/Beef-Curry-1466px.jpg", city: "Ottawa"},
		//{name: "Firouz", image: "https://www.instagram.com/p/BvU0d8VlFWs/media?size=l", city: "Ottawa"},
		//{name: "Riviera", image: "https://www.instagram.com/p/BzjZWzIF9cS/media?size=l", city: "Ottawa"},
		//{name: "India Curry and Kebab House", image: "https://www.yourultimatemenu.com/wp-content/uploads/2019/07/Beef-Curry-1466px.jpg", city: "Ottawa"}
	//];

app.use(indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);


app.listen(3000, function(){
	console.log("The server has started on port 3000");
});