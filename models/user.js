// references
const mongoose = require('mongoose');
const passport = require('passport');
const plm = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
	userType: String,
	firstname: String,
	lastname: String,
	gender: String,
	dateofbirth: String,
	address: String,
	city: String,
	province: String,
	postalcode: String,
	phone: String,
	education: String,
	lenghtOfJobSearch: String,
	employmentStatus: String,
	oesc: Boolean,
	resume: String,
	// employer needed fields
	companyName: String,
	contactPerson: String,
	companySite: String,
	aboutCompany: String,
	companyLogo: String,
	approved: Boolean,
	logo: String,
	image1: String,
	image2: String,
	image3: String
});

//use plm to automatically define username and passport field for the model
userSchema.plugin(plm);
userSchema.plugin(findOrCreate);
// export module
module.exports = mongoose.model('User', userSchema);
