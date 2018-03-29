// references
const mongoose = require('mongoose');
const passport = require('passport');
const plm = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
	userType: String,
	companyName: String,
	contactPerson: String,
	username: String,
	companySite: String,
	city: String,
	province: String,
	postalCode: String,
	phone: String,
	aboutCompany: String,
	companyLogo: String,
	oesc: Boolean,
	approved: Boolean,
	logo: String,
	about: String,
	image1: String,
	image2: String,
	image3: String
});
//use plm to automatically define username and passport field for the model
userSchema.plugin(plm);
userSchema.plugin(findOrCreate);
// export module
module.exports = mongoose.model('Employer', userSchema);
