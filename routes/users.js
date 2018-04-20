var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const functions = require('../config/functions');
const User = require('../models/user');
const Job = require('../models/job');

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

const storageImg = multer.diskStorage({
	destination: './public/uploads/images',
	filename: (req, file, callback) => {
		callback(null, file.fieldname + '-' + req.user.username + path.extname(file.originalname));
	}
});

//init upload
const uploadImg = multer({
   storage: storageImg,
	 limits: {fileSize: 2000000},
	 fileFilter: (req, file, cb) => {
		 checkImageType(file, cb);
	 }
}).single('myPic')

// init upload
const upload = multer({
	storage: storage,
	limits: {fileSize: 1000000},
	fileFilter: (req,file,cb) =>{
		checkFileType(file, cb);
	}
}).single('myResume');
// init upload
const uploadCl = multer({
	storage: storageCl,
	limits: {fileSize: 1000000},
	fileFilter: (req,file,cb) =>{
		checkFileType(file, cb);
	}
}).single('myCoverletter');

const app = express();
/* GET users listing. */
router.get('/', functions.isLoggedIn, (req, res, next) =>{
	// get the users details from the db
 User.findOne(
	 {'username': req.user.username},
	 // list of information to grab from the db
	 'firstname lastname gender dateofbirth city province postalcode phone address userType companyName contactPerson companySite oesc approved resume coverletter profilePic', (err,user) => {
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
			coverletter: user.coverletter,
			profileImg: user.profilePic,
			imgLocation: 'uploads/images/' + user.profilePic
		});
	} else {
		Job.find({ 'username': req.user.username }, ( err, jobs) => {
				if(err) {
					console.log(err);
				} else {
					res.render('employers/employer-Profile.ejs', {
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
					approved: user.approved,
					jobs: jobs
				});
				}
		});
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
						 console.log(req.file);
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
					upload(req, res, (err) => {
 					 if(err){
 						 console.log(err);
 						 res.render('users/upload-resume', {
 							 title: 'Upload Resume',
 							 msg: err,
 							 msgType: 'alert alert-danger'
 						 });
 					 } else {
 						 console.log(req.file);
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
					console.log(req.file);
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
	res.render('users/upload-coverletter', {
		title: 'upload coverletter',
		msg: undefined
	});
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
						console.log(file);
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
						console.log(file);
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
// GET upload Profile Pic
router.get('/upload-pic', functions.isLoggedIn, (req, res, next) => {
	res.render('users/profile-pic-upload.ejs', {
		title: "Welcome",
		msg: undefined
	});
});
// POST upload users image
router.post('/upload-pic', functions.isLoggedIn, (req,res) => {
	// get the users details from the db
 User.findOne(
	 {'username': req.user.username},
	 // list of information to grab from the db
	 'profilePic', (err,user) => {
		if(err){
			console.log(err);
		}
		// check if the user has a saved resume
		if(user.profilePic) {
			let file = "./public/uploads/images/" + user.profilePic
			// delete the old resume and upload the new one and save it to mongodb
			try {
				 fs.unlinkSync(file);
				 uploadImg(req, res, (err) => {
					 if(err){
						 console.log(err);
						 res.render('users/upload-pic', {
							 title: 'Upload picture',
							 msg: err,
							 msgType: 'alert alert-danger'
						 });
					 } else {
						 console.log(req.file);
						 let username = req.user.username;
						 User.update({username:username},
							 { $set: {
								 profilePic: req.file.filename
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
					uploadImg(req, res, (err) => {
 					 if(err){
 						 console.log(err);
 						 res.render('users/upload-pic', {
 							 title: 'Upload Picture',
 							 msg: err,
 							 msgType: 'alert alert-danger'
 						 });
 					 } else {
 						 console.log(req.file);
 						 let username = req.user.username;
 						 User.update({username:username},
 							 { $set: {
 								 profilePic: req.file.filename
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
		}else{
			uploadImg(req, res, (err) => {
				if(err){
					console.log(err);
					res.render('users/upload-pic', {
						title: 'Upload Picture',
						msg: err,
						msgType: 'alert alert-danger'
					});
				} else {
					console.log(req.file);
					console.log(req.file.filename);
					let username = req.user.username;
					User.update({username:username},
						{ $set: {
							profilePic: req.file.filename
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
// update employer profile
router.post('/update-employer-profile', functions.isLoggedIn, (req,res,next) => {
	let username = req.user.username;
	//update the users details with the new inputs
	User.update({username:username},
		{ $set: {
			companyName: req.body.companyName,
			city: req.body.city,
			province: req.body.province,
			postalcode: req.body.postalcode,
			phone: req.body.phone,
			address: req.body.address,
			desc: req.body.desc
		}}, null, (err) => {
		if(err){
			console.log(err);
		}
		else {
			res.redirect('/users');
		}
	});
});
//GET: jobs list pages
router.get('/jobs-list', (req,res,next) => {
	res.render('users/jobList',{
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
//GET the add Jobs Page
router.get('/add-job', functions.isLoggedIn, (req,res,next) => {
	User.findOne(
 	 {'username': req.user.username},
 	 // list of information to grab from the db
 	 'companyName comapanyLogo', (err, user) => {
		 if(err) {
			 console.log(err);
		 } else {
			 res.render('employers/addJob',{
				title: 'SMWDB',
				user: req.user,
				companyName: user.companyName,
				companyLogo: user.comapanyLogo
			});
		 }
	 });
});
// POST add the job to the db
router.post('/add-job', functions.isLoggedIn, (req,res) => {
	Job.create({
				 username: req.user.username,
	       companyName: req.body.companyName,
	       companyLogo: req.body.companyLogo,
	       jobTitle: req.body.jobTitle,
	       location: req.body.location,
				 salary: req.body.salary,
				 jobDescription: req.body.jobDescription
	   }, (err, job) => {
	       if (err) {
	           console.log(err);
	       }
	       else {
	           res.redirect('/users');
	       }
	   }) ;
});
// Delete job
router.get('/job-delete/:_id', (req,res,next) => {
	let _id = req.params._id;

	Job.remove({_id: _id}, (err) =>{
		if(err){
			console.log(err);
		}else {
			res.redirect('/users');
		}
	})
});
// allowed file type function
const checkFileType = function(file, cb){
	const fileTypes = /docx|pdf|txt/;
	const extType = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
	if(extType){
		return cb(null, true);
	} else {
		cb('Error: Invalid File Type please upload .pdf .docx .txt')
	}
}
// file check function
const checkImageType = function(file, cb){
	const fileTypes = /jpg|jpeg|png|gif|svg/;
	const extType = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
	const mimeType = fileTypes.test(file.mimetype);
	if(mimeType && extType){
		return cb(null, true);
	} else {
		cb('Error: That File is not an image')
	}
}
module.exports = router;
