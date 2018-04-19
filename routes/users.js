var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const functions = require('../config/functions');
const User = require('../models/user');
const fs = require('fs');

// storage engine
const storage = multer.diskStorage({
	destination: './public/uploads/resumes',
	filename: (req, file, callback) => {
		callback(null, file.fieldname + '-' + req.user.username + path.extname(file.originalname));
	}
});
// storage engine
const storageCl = multer.diskStorage({
	destination: './public/uploads/coverletters',
	filename: (req, file, callback) => {
		callback(null, file.fieldname + '-' + req.user.username + path.extname(file.originalname));
	}
});
// init upload
const upload = multer({
	storage: storage,
	limits: {fileSize: 1000000}
}).single('myResume');
// init upload
const uploadCl = multer({
	storage: storageCl,
	limits: {fileSize: 1000000}
}).single('myCoverletter');

/* GET users listing. */
router.get('/', functions.isLoggedIn, (req, res, next) =>{
	// get the users details from the db
 User.findOne(
	 {'username': req.user.username},
	 // list of information to grab from the db
	 'firstname lastname gender dateofbirth city province postalcode phone address userType companyName contactPerson companySite oesc approved resume coverletter', (err,user) => {
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
			address: user.address,
			resume: user.resume,
			coverletter: user.coverletter
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
// GET Upload resume
router.get('/upload-resume', functions.isLoggedIn, (req,res,next) => {
	res.render('users/upload-resume', {
		title: 'file upload',
		msg: undefined
	});
});
router.post('/upload-resume', functions.isLoggedIn, (req,res) => {
	// get the users details from the db
 User.findOne(
	 {'username': req.user.username},
	 // list of information to grab from the db
	 'resume', (err,user) => {
		if(err){
			console.log(err);
		}
		// check if the user has a saved resume
		if(user.resume) {
			let file = "./public/uploads/resumes/" + user.resume
			console.log(file);
			// delete the old resume and upload the new one and save it to mongodb
			try {
				 fs.unlinkSync(file);
				 upload(req, res, (err) => {
					 if(err){
						 console.log(err);
						 res.render('users/upload-resume', {
							 title: 'Upload Resume',
							 msg: err,
							 msgType: 'alert alert-danger'
						 });
					 } else {
						 console.log(req.file.filename);
						 let username = req.user.username;
						 User.update({username:username},
							 { $set: {
								 resume: req.file.filename
							 }}, null, (err) => {
							 if(err){
								 console.log(err);
							 }
							 else {
								 res.redirect('/users');
							 }
						 });
					 }
				 });
				} catch (err) {
					console.log(err);
				}
		}else{
			upload(req, res, (err) => {
				if(err){
					console.log(err);
					res.render('users/upload-resume', {
						title: 'Upload Resume',
						msg: err,
						msgType: 'alert alert-danger'
					});
				} else {
					console.log(req.file.filename);
					let username = req.user.username;
					User.update({username:username},
						{ $set: {
							resume: req.file.filename
						}}, null, (err) => {
						if(err){
							console.log(err);
						}
						else {
							res.redirect('/users');
						}
					});
				}
			});
		}
	});
});
// GET Upload coverletter
router.get('/upload-coverletter', functions.isLoggedIn, (req,res,next) => {
	res.render('users/upload-coverletter');
});
router.post('/upload-coverletter', functions.isLoggedIn, (req,res) => {
	// get the users details from the db
 User.findOne(
	 {'username': req.user.username},
	 // list of information to grab from the db
	 'coverletter', (err,user) => {
		if(err){
			console.log(err);
		} if (user.coverletter) {
			let file = "./public/uploads/coverletters/" + user.coverletter
			try{
				fs.unlinkSync(file);
				uploadCl(req, res, (err) => {
					if(err){
						console.log(err);
						res.render('users/upload-coverletter', {
							title: 'Upload coverletter',
							msg: err,
							msgType: 'alert alert-danger'
						});
					} else {
						console.log(req.file.filename);
						let username = req.user.username;
						User.update({username:username},
							{ $set: {
								coverletter: req.file.filename
							}}, null, (err) => {
							if(err){
								console.log(err);
							}
							else {
								res.redirect('/users');
							}
						});
					}
				});
			} catch(err) {
				console.log(err)
			}
		} else {
			uploadCl(req, res, (err) => {
				if(err){
					console.log(err);
					res.render('users/upload-coverletter', {
						title: 'Upload coverletter',
						msg: err,
						msgType: 'alert alert-danger'
					});
				} else {
					console.log(req.file.filename);
					let username = req.user.username;
					User.update({username:username},
						{ $set: {
							coverletter: req.file.filename
						}}, null, (err) => {
						if(err){
							console.log(err);
						}
						else {
							res.redirect('/users');
						}
					});
				}
			});
		}
	});
});
// GET Profile page
router.get('/profile', functions.isLoggedIn, (req,res,next) => {
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
