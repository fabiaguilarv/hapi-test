var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
///change url 
mongoose.connect("mongodb://localhost:27017/hapi-db", {useNewUrlParser: true, useUnifiedTopology: true});
var userModel = require('../models/user');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

var router = express.Router();	
router.use(session({
	secret: 'key',
	resave: true,
	saveUninitialized: true
}));
/* GET home page. */
router.get('/', function(req, res, next) {
 req.session.destroy();//destroy session
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
 userModel.findOne({email:req.body.email}).exec().then(result=>{
 	if(bcryptjs.compareSync(req.body.password,result.password)){
		req.session.cust_log = "true"; 
			req.session.email = result.email; 
		res.redirect('home');
		}
	else{
	    res.status(201).json({"error":"Wrong Password"}); 
	}	
 }).catch(err=>{
 	res.status(500).json({"error":"Wrong Password"});
 });

});

router.get('/signup', function(req, res, next) {
 res.render('signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
	console.log(req.body.password);
	bcryptjs.genSalt(saltRounds, function(err, salt) {
	bcryptjs.hash(req.body.password, salt, function(err, hash) {
	const user = new userModel({
	email: req.body.email,
	password:hash
	});
	user
	.save()
	.then(result=>{
			res.redirect('/');
	res.render('index', { title: 'Express' });
	})
	.catch(err=>{
	res.send("Error ");
	res.status(500).json({error:err});
	});

	});
	});
});

router.get('/home', function(req, res, next) {
	if(req.session.cust_log=="true"){
	  res.render('home', { title: 'Express',email:req.session.email});
	}else
	{
	 res.render('login', { title: 'Express' });
	}
});
module.exports = router;