'use strict';

var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var houseSchema = new Schema({  
  userId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  title:    { type: String, required: true  },
  summary:   { type: String  },
  price:    { type: Number },
  /* priceType must be required becouse mongoose force this for enum data types */
  priceType:    { type: String, required: true, enum:
    ['Mensual', 'Semanal', 'Dia', 'Noche', 'Compra', 'Otro']},
  propertyType:    { type: String, required: true, enum:
    ['Casa', 'Departamento', 'Local', 'Terreno', 'Salon', 'Otro']},
  operationType:    { type: String, required: true, enum:
    ['Venta', 'Renta']},
  services: [ { type: String, required: true, enum:
  	['Internet', 'Telefono', 'Cocina', 'Jardin', 'Mascotas', 'SeguridadPrivada'] }],
  status:    { type: String, required: true, enum:
    ['Publicado', 'Borrador', 'Inactivo']},
  address:    { 
  		address: { type: String, required: true },
  		state: { type: String },
  		town: { type: String },
  		longitude: { type: Number },
  		latitude: { type: Number }
  },
  contact:    { 
  		name: { type: String, required: true },
  		phone: { type: String },
  		mail: { type: String },
  		facebook: { type: String },
  		website: { type: String }
  },
  noBedrooms:    { type: Number, required: true },
  noBathrooms:    { type: Number, required: true },
  noParking:    { type: Number, required: true },
  creationDate:     { type: Date, default: Date.now, required: true },
  lastModification:     { type: Date, default: Date.now, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model('House', houseSchema);