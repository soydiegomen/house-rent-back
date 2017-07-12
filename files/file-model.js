'use strict';

var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var fileSchema = new Schema({  
  userId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  fileUrl:    { type: String, required: true },
  name:    { type: String, required: true },
  fileType:    { type: String, required: true },
  size:    { type: Number },
  status:    { type: Boolean, enum:
    ['New', 'Deleted'] },
  creationDate:     { type: Date, default: Date.now },
  lastModification:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);