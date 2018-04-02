var express = require('express');
var router = express.Router();
const functions = require('../config/functions');
const User = require('../models/user')

/* GET users listing. */
router.get('/', functions.isLoggedIn, (req, res, next) =>{
	// get the users details from the db
 User.findOne(
	 {'username': req.user.username},
	 // list of information to grab from the db
	 'firstname lastname gender dateofbirth city province postalcode phone address userType companyName contactPerson companySite oesc approved', (err,user) => {
		if(err){
			console.log(err);
		}
		if(user.userType == "jobSeeker") {
		res.render('users/job-seeker-profile.ejs', {
			title: 'Welcome',
			// user details
			user: req.user,
			firstname: user.firstname,
			lastname: user.lastname,
			gender: user.gender,
			dateofbirth: user.dateofbirth,
			city: user.city,
			province: user.province,
			postalcode: user.postalcode,
			phone: user.phone,
			address: user.address
		});
	} else {
		res.render('employers/employerProfile.ejs', {
			title: 'Employer Profile',
    message: 'Welcome to your Employer Profile. Here you will be able to create a profile page for your company to hire job seekers during your job fair.',
			// user details
			user: req.user,
			contactPerson: user.contactPerson,
			gender: user.gender,
			dateofbirth: user.dateofbirth,
			city: user.city,
			province: user.province,
			postalcode: user.postalcode,
			phone: user.phone,
			address: user.address,
			approved: user.approved
		})
		}
	});
});
//update the users Profile
router.post('/', (req,res,next) => {
	let username = req.user.username;

	//update the users details with the new inputs
	User.update({username:username},
		{ $set: {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			gender: req.body.gender,
			dateofbirth: req.body.dateofbirth,
			city: req.body.city,
			province: req.body.province,
			postalcode: req.body.postalcode,
			phone: req.body.phone,
			address: req.body.address
		}}, null, (err) => {
		if(err){
			console.log(err);
		}
		else {
			res.redirect('/users');
		}
	});
});
// GET Profile page
router.get('/profile', (req,res,next) => {
	res.render('users/employeeProfile.ejs', {
		title: 'profile pages'
	});
});
//GET: jobs list pages
router.get('/jobs-list', (req,res,next) => {
	res.render('main',{
		title: 'SMWDB',
		user: req.user
	});
});
//GET the Employers list page
router.get('/employers-list', (req,res,next) => {
	res.render('main',{
		title: 'SMWDB',
		user: req.user
	});
});
module.exports = router;
