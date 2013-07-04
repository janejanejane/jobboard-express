var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var JobSchema = new Schema({
  jobtitle: String,
  location: String,
  description: String,
  apply_details: String,
  company_name: String,
  company_website: String,
  confirmation_email: String,
  salary: Number,
  jobtype: Number,
  jobkey: String,
  jobkey_confirmation: { type: String, default: null },
  isdeleted: { type: Number, default: 0 },
  category: Number,
  created_at: { type : Date, default: Date.now() },
  updated_at: Date
});

JobSchema.pre('save', function(next){
  this.updated_at = new Date;
  if (!this.created_at) {
    this.created_at = new Date;
  }
  next();
});

module.exports = mongoose.model('Job', JobSchema);