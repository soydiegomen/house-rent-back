'use strict';

var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var houseMetSchema = new Schema({  
  houseId:    { type: mongoose.Schema.Types.ObjectId },
  views:    { type: Number, default: 0  },
  likes:    { type: Number, default: 0 },
  lastModification:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('HouseMetric', houseMetSchema);