var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var userSchema = new Schema({  
  name:    { type: String, required: true },
  email:    { type: String, required: true, index: { unique: true }  },
  password:    { type: String, required: true },
  userType:    { type: String, required: true, enum:
    ['SuperAdmin', 'Admin', 'User']},
  isActive:    { type: Boolean },
  creationDate:     { type: Date, default: Date.now },
  lastModification:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);