var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  password: String,
  description: String,
  time : { type : Date, default: Date.now() }   
});

UserSchema.methods.generatePassword = function(){
  var result = '';
  var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(var i = 6; i > 0; --i){
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result; 
}

module.exports = mongoose.model('User', UserSchema);