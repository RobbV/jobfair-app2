var express = require('express');
var router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const functions = require('../config/functions');
const User = require('../models/user');

router.get('/', (req,res,next) => {
	let messages = req.session.messages || [];
	req.session.messages = [];
	res.render('admins/login', {
			title: 'Login',
			messages: messages
	});
});
// POST: /login
router.post('/', passport.authenticate('local', {
	  successRedirect: 'admins/admins-home',
	    failureRedirect: '/admins',
	    failureMessage: 'Invalid Login'
	}));

	router.get('/admins-home', functions.isLoggedIn, (req, res, next) => {
		User.findOne(
	 	 {'username': req.user.username},
	 	 // list of information to grab from the db
	 	 'fullname userType adminlevel', (err,user) => {
			 if (user.userType == 'admin') {
				 User.find(
					 { 'userType': 'employer' },
					 ' _id username companyName companyLogo approved contactPerson phone companySite',
					 ( err, employer) => {
		 				if(err) {
		 					console.log(err);
		 				} else {
							console.log(employer);
							console.log(user);
				 res.render('admins/index', {
					 title: 'admin home page',
					 admin: user,
					 user: user,
					 employer: employer
				  });
				}
			});
		 } else {
				 res.redirect('/users');
			}
		});
	});

router.get('/approve-employer/:_id', functions.isLoggedIn, (req, res, next) => {
	let _id = req.params._id;

	User.update({_id: _id},
	{$set: {
		approved: true
	}}, null, (err) =>{
		if(err){
			console.log(err);
		}else{
		res.redirect('/admins/admins-home');
		}
	});
});
router.get('/disable-employer/:_id', functions.isLoggedIn, (req, res, next) => {
	let _id = req.params._id;

	User.update({_id: _id},
	{$set: {
		approved: false
	}}, null, (err) =>{
		if(err){
			console.log(err);
		}else{
		res.redirect('/admins/admins-home');
		}
	});
});
// // temporary admin sign up
// router.get('/sign-up', (req, res , next) =>{
// 	res.render('admins/sign-up', {
// 		title: 'Admin Sign up',
// 		user: req.user
// 	});
// });
//
// //Process admin and register them
// router.post('/sign-up', (req, res, next) => {
// 	User.register(new User({
// 		username: req.body.username,
// 		fullname: req.body.fullname,
// 		adminlevel: req.body.adminlevel,
// 		userType: req.body.userType
// 	}), req.body.password, (err, user) => {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			res.redirect('/');
// 		}
// 	});
// });

module.exports = router;
