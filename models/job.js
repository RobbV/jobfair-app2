// references
const mongoose = require('mongoose');
const passport = require('passport');
const findOrCreate = require('mongoose-findorcreate');

const jobSchema = new mongoose.Schema({
	username: String,
	companyName: String,
	companyLogo: String,
	jobTitle: String,
	location: String,
	salary: String,
	jobDescription: String
});
//use plm to automatically define username and passport field for the model
jobSchema.plugin(findOrCreate);
// export module
module.exports = mongoose.model('job', jobSchema);
