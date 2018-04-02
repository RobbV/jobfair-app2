var express = require('express');
var router = express.Router();
//passport
const passport = require('passport');
//required models
const User = require('../models/user.js');
const Employer = require('../models/employer.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SMWDB' });
});
// GET the Main info page
router.get('/main', (req,res,next) => {
	res.render('homepage', {
		title: 'SMWDB',
		message: 'Simcoe Muskoka Workforce Development Board. On this page you will be able to choose from either Employer, Job Seeker or to just Browse. After you choose which option is right for you, specific instructions for what is next will appear on the next page. Thank you for visiting the Simcoe Muskoka Workforce Development Board.',
		user: req.user
	});
});
//GET home page
router.get('/home', (req,res,next) => {
	res.render('homepage', {
		title: 'SMWDB',
    message: 'Simcoe Muskoka Workforce Development Board. On this page you will be able to choose from either Employer, Job Seeker or to just Browse. After you choose which option is right for you, specific instructions for what is next will appear on the next page. Thank you for visiting the Simcoe Muskoka Workforce Development Board.',
		user: req.user
	})
});
// user
//============================================
//GET: the user register page
router.get('/register-user', (req,res,next) => {
	res.render('register-user',{
		title: 'Sign up',
		user: req.user
	});
});
//POST:
router.post('/register-user', (req,res,next) => {

	User.register(new User({
		userType: req.body.userType,
		username: req.body.username,
		firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    dateofbirth: req.body.dob,
    city: req.body.city,
    province: req.body.province,
    postalcode: req.body.postalcode,
    phone: req.body.phone
	}), req.body.password, (err, user) => {
	if (err) {
		console.log(err);
	} else {
		res.redirect('/')
	}
	});
});
//============================================
//employer
//============================================
router.get('/register-employer', (req,res,next) =>{
	res.render('register-employer', {
		title: 'Register your company',
		user: req.user
	});
});
// POST: register employer
router.post('/register-employer', (req,res,next) => {

	User.register(new User({
			userType: req.body.userType,
			companyName: req.body.companyName,
			contactPerson: req.body.contactPerson,
			username: req.body.username,
			companySite: req.body.companySite,
			city: req.body.city,
			province: req.body.province,
			postalCode: req.body.postalCode,
			phone: req.body.phone,
			aboutCompany: req.body.aboutCompany,
			companyLogo: req.body.companyLogo,
			oesc: req.body.oesc,
			approved: req.body.approved
	}), req.body.password, (err,employer) =>{
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});
//============================================
//login
//============================================
// GET: login page
router.get('/login', (req,res,next) => {
	// // check for invalid login message in the session object
	// let messages = req.session.messages || [];
	// // clear the session messages
	// req.session.messages = [];
	res.render('login', {
		title: "Login to access your account"
	});
});
// POST: /login
router.post('/login', passport.authenticate('local', {
	  successRedirect: '/users',
	    failureRedirect: '/login',
	    failureMessage: 'Invalid Login'
	}));
// GET: /logout
router.get('/logout', (req, res, next) => {

    // clear out any session messages
    req.session.messages = [];

    // end the user's session
    req.logout();

    // redirect to login or home
    res.redirect('/login');
});
//============================================
module.exports = router;
