var express = require('express');
var app = express();  //use express js module
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectID = require('mongodb').ObjectID;
var mongo = require('mongodb');


//add handlebars view engine

var handlebars = require('express-handlebars').create({defaultLayout: 'home'});  //default handlebars layout page

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars'); //sets express view engine to handlebars


app.set('port', process.env.PORT || 3000);  //sets port 3000var MongoClient = require('mongodb').MongoClient;

// Connect to the db

 var data = [{ name: "Sagar Patel", specification:" psychiatrist" , area:"San jose", rating:5},
 { name: "Hemali Patel", specification:"Cardiologist." , area:"Sunnyvale", rating:3},
 { name: "Saloni Bhatia", specification:"psychiatrist" , area:"San jose", rating:4},
 { name: "Yesha Mistry", specification:"Allergist" , area:"Albany", rating:4},
 { name: "Staffone Christine", specification:" psychiatrist" , area:"San jose", rating:3},
 { name: "Steve Christ", specification:"Allergist" , area:"San jose", rating:5},
 { name: "Ruchi Pithadia", specification:" psychiatrist" , area:"Santa Clara", rating:5},
 { name: "Shalaka Patil", specification:" psychiatrist" , area:"San jose", rating:5},
 { name: "Darshan Patel", specification:" Cardiologist." , area:"San matep", rating:5},
 { name: "Vidhi Pateliya", specification:" Allergist" , area:"San francisco", rating:5}];

// Connect to the db

MongoClient.connect(url, function (err, db) {
//Write databse Insert/Update/Query code here..
 if(err) throw err;
var dbo = db.db("information");
// drop data
dbo.collection("doctors").drop();
  dbo.collection("doctors").insert(data, function(err, res) {
 if (err) throw err;
    console.log(" documents inserted");
    db.close();
})
});



app.get('/', function(req,res){

    MongoClient.connect(url, function (err, db) {

     if(err) throw err;
    var dbo = db.db("information");

 //  dbo.collection("doctors").insert(data, function(err, res) {
 // if (err) throw err;
 //    console.log(" documents inserted");
 //    db.close();
 //  })
    var query = {};
    if (req.query.area) {
      query.area = req.query.area
    }

    if (req.query.rating) {
        query.rating = parseInt(req.query.rating);
    }
    console.log(query);
    dbo.collection("doctors").find(query).toArray(function(err, result) {
    if (err) throw err;
        res.render('home',{result:result});  //respond with homepage
    //db.close();

        });

    });

});

app.get('/list/:listid',function(req,res){

    MongoClient.connect(url, function (err, db) {

     if(err) console.log(error);
    var dbo = db.db("information");
 var o_id= new mongo.ObjectID(req.params.listid);
    console.log(o_id);
    // query

   //dbo.collection("doctors").find({_id:req.params.listid},function(err, result)
    dbo.collection("doctors").findOne({ "_id" :o_id},function(err, result)
    {
    if (err) throw err;
      dbo.collection("doctors").find({"rating": result.rating}).toArray(function(erronSimilar, similarResult) {
        if(erronSimilar) throw err
        console.log(similarResult);
        res.render('details',{result:result, recos: similarResult});  //respond with details page
          db.close();
    });
        });

    });


});

app.use(function(req,res){  //express catch middleware if page doesn't exist
	res.status(404);  //respond with status code
	res.render('404'); //respond with 404 page
});

app.listen(app.get('port'), function(){ //start express server
	console.log( 'Express Server Started on http://localhost:3000');

});
