var mongoose = require("mongoose");
var Restaurant = require("./models/restaurants");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Milestones", 
        image: "https://www.ottawabusinessjournal.com/wp-content/uploads/2019/07/terlin-projects-milestones-1-1-1140x694.jpg",
		city: "Ottawa",
        description: "Global-Fusion"
    },
    {
        name: "Di Bella Coffee", 
        image: "https://www.comunicaffe.com/wp-content/uploads/2017/03/di-bella.jpg",
		city: "Mumbai",
        description: "Cafe - Fast food"
    },
    {
        name: "Raclette", 
        image: "https://media1.popsugar-assets.com/files/thumbor/9Ms3SJlSe7ND5xHXYDirkspa418/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2018/04/22/171/n/1922195/a330a3315add4dde8f3eb8.49413590_/i/Raclette-Restaurant-New-York-City.jpg",
		city: "New York City",
        description: "French"
    }
]
 
function seedDB(){
   //Remove all hangout places
   Restaurant.remove({}, function(err){
        if(err){
    	   console.log(err);
        }
	      console.log("removed hangout place!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few restaurant
            data.forEach(function(seed){
                Restaurant.create(seed, function(err, restaurant){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a hangout place");
                        //create a comment
                        Comment.create(
	                           {
                                text: "Great food!",
								   author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    restaurant.comments.push(comment);
                                    restaurant.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
};
 
module.exports = seedDB;