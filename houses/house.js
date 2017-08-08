'use strict';

var HouseModel = require('./house-model');

//GET - Return all houses in the DB
exports.getAllHouses = function(req, res) {  
    HouseModel.find(function(err, houses) {
        if(err){
            res.send(500, err.message);
        }

        res.status(200).jsonp(houses);
    });
};

//GET - Return a House with specified ID
exports.getById = function(req, res) {  
    HouseModel.findById(req.params.id, function(err, house) {
        if(err){
            return res.send(500, err.message);
        }

        res.status(200).jsonp(house);
    });
};


//POST - Insert a new House in the DB
exports.addHouse = function(req, res) {  

    var newHouse = new HouseModel({
        userId:    req.body.userId,
        title:     req.body.title,
        price:  req.body.price,
        priceType:   req.body.priceType,
        propertyType:  req.body.propertyType,
        operationType:  req.body.operationType,
        services:   req.body.services,
        status:  req.body.status,
        address:  req.body.address,
        contact:   req.body.contact,
        noBedrooms:  req.body.noBedrooms,
        noBathrooms:  req.body.noBathrooms,
        noParking:   req.body.noParking
    });

    newHouse.save(function(err, house) {
        if(err){
            return res.status(500).jsonp( err);
        }
        res.status(200).jsonp(house);
    });
};

//PUT - Update a register already exists
exports.updateHouse = function(req, res) {  
    HouseModel.findById(req.params.id, function(err, house) {
        house.userId   = req.body.userId;
        house.title    = req.body.title;
        house.price = req.body.price;
        house.priceType  = req.body.priceType;
        house.propertyType = req.body.propertyType;
        house.operationType = req.body.operationType;
        house.services  = req.body.services;
        house.status = req.body.status;
        house.address = req.body.address;
        house.contact  = req.body.contact;
        house.noBedrooms =  req.body.noBedrooms;
        house.noBathrooms =  req.body.noBathrooms;
        house.noParking =   req.body.noParking;
        house.lastModification = new Date();

        house.save(function(err) {
            if(err){ 
                return res.status(500).send(err.message);
            }
            res.status(200).jsonp(house);
        });
    });
};

//DELETE - Delete a House with specified ID
exports.deleteHouse = function(req, res) {  
    HouseModel.findById(req.params.id, function(err, house) {
        house.remove(function(err) {
            if(err){
                return res.status(500).send(err.message);
            }
            res.status(200).send();
        });
    });
};