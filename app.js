var express = require("express");

var fs = require("fs");

var app = express();

var bodyParser = require("body-parser");

var request = require("request");

var mongoose = require("mongoose");

var email = require('node-mailer'); 

mongoose.connect("mongodb://localhost/tata");

var passport = require("passport");

var localStrategy = require("passport-local");

var User = require("./models/user");

var Product = require("./models/ad");

var Userdet = require("./models/userdet");

var Img = require("./models/img");

app.use(require("express-session")({
	secret:"hello world",
	resave:false,
	saveUninitialized:false
}));

app.use(express.static( "public" ));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res)
{
	res.render("home.ejs");
});

app.get("/userhome",isLoggedIn,function (req,res) {
	var x = req.user._id;
	x.toString();
	Userdet.find({userid:x},function(err,usr)
	{
		if(err)
		{
			console.log(err);
		}
		res.render("userhome.ejs",{usr:usr[0].name});
	});
});

app.get("/signup",function(req,res)
	{
		res.render("signup.ejs");
	});

app.post("/signup",function (req,res) {
	var newuser = new User({username:req.body.username});
	User.register(newuser,req.body.password , function (err,user) {
		if(err)
		{
			console.log(err);
			return res.render("signup.ejs");
		}
		passport.authenticate('local')(req,res,function(){
			res.redirect("/userhome");
			Userdet.create({
				userid:req.user._id,
				name:req.body.name,
				mobno:req.body.mobno,
				dob:req.body.dob
			},function(err,usr)
			{
				if(err)
				{
					console.log(err);
				}
				console.log(usr)
			});
		});
	});
});

//===============
//LOGIN
//===============

app.get("/login",function (req,res) {
	res.render("login.ejs");
});

app.post("/login", passport.authenticate("local",{
	successRedirect:"/userhome",
	failureRedirect:"/login"
}),function (req,res) {
});

//========
//logout
//========
app.get("/logout",function (req,res) {
	req.logout();
	res.redirect("/");
});

app.get("/postad",isLoggedIn,function(req,res)
{
	res.render("postad.ejs");
});

app.post("/postad",function(req,res)
{
	Userdet.find({userid:req.user._id},function(errr,user){
		if(errr)
		{
			console.log(errr);
		}
		Product.create({
			userid:req.user._id,
			name:user[0].name,
			title:req.body.title,
			price:req.body.price,
			add:req.body.add,
			mob:req.body.mob,
			desc:req.body.desc,
			type:req.body.type,
			class:req.body.class
		},function(err,usr)
		{
			if(err)
			{
				console.log(err);
			}
			console.log(usr);
			res.redirect("/userhome");
		});
	});
});

app.get("/viewall",isLoggedIn,function(req,res)
{
	var x = req.user._id;
	x.toString();
	Userdet.find({userid:x},function(err,usr)
	{
		if(err)
		{
			console.log(err);
		}
		Product.find({},function(err,pro)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				res.render("viewall.ejs",{pro:pro,usr:usr[0].name});
			}
		});
	});
});

app.get("/manage",function(req,res)
{
	var k = req.user._id;
	k.toString();
	Product.find({userid:k},function(err,us)
	{
		if(err)
		{
			console.log(err);
		}
		res.render("manage.ejs",{pro:us});
	});
});

app.get("/:id/delete",function(req,res)
{
	Product.findOneAndDelete({_id:req.params.id},function(err,query)
	{
		if(err)
		{
			console.log(err);
		}
		res.redirect("/userhome");

	});
});

app.get("/img",function(req,res)
{
	var a = new Img;
    a.img.data = fs.readFileSync("D:/a.jpg");
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');
      console.log(a[0].data);

});
});



function isLoggedIn(req,res,next) {
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");
}

var port = 3000;

app.listen(port,function(){
	console.log("Listening on 3000!!!");
}
);