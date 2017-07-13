'use strict';

var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var houseFileSchema = new Schema({  
  houseId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  fileId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  isActive:    { type: Boolean, required: true },
  creationDate:     { type: Date, default: Date.now },
  lastModification:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('HouseFile', houseFileSchema);