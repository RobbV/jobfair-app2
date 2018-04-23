// references
const mongoose = require('mongoose');
const passport = require('passport');
const plm = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const adminSchema = new mongoose.Schema({
	fullname: String,
	adminLevel: Number
});

adminSchema.plugin(plm);
adminSchema.plugin(findOrCreate);

module.exports = mongoose.model('Admin', adminSchema);
