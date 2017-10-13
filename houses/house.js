'use strict';

var mongoose = require('mongoose');  
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
    //Set empty array if there are not files
    var arrayFiles = (req.body.files && req.body.files.length > 0) ?
        req.body.files : [];

    var newHouse = new HouseModel({
        userId:    req.body.userId,
        title:     req.body.title,
        summary:   req.body.summary,
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
        noParking:   req.body.noParking,
        files: arrayFiles
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
    //Set empty array if there are not files
    var arrayFiles = (req.body.files && req.body.files.length > 0) ?
        req.body.files : [];

    //TODO: Borrar fisicamente los archivos que se habían agregado anteriormente a esta casa
    //Y que en el update ya no se incluyen
    HouseModel.findById(req.params.id, function(err, house) {
        house.userId   = req.body.userId;
        house.title    = req.body.title;
        house.summary     = req.body.summary;
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
        house.files    = arrayFiles;
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

//GET - Return the last publish houses
exports.getHousesByStatus = function(req, res) {  
    var status = req.params.status ? req.params.status : 'Publicado';
    HouseModel.find({ 
        status : status
    })
    .sort( 
        //order DESC
        { 
            creationDate : -1 
        }
    )
    .exec(function(err, answer) {
        if(err){
            res.send(500, err.message);
        }

        res.status(200).jsonp(answer);
    });
};

//GET - Return a House with specified ID
exports.getHouseWithFiles = function(req, res) {  
    HouseModel.aggregate(
        [
            {
                $lookup:
                {
                    from: 'files',
                    localField: 'files',
                    foreignField: '_id',
                    as: 'filesData'
                },
            },
            {
                $match: 
                {
                    _id: new mongoose.Types.ObjectId(req.params.id),
                }
            }
        ],
        function(err, house) {
            if(err){
                return res.send(500, err.message);
            }

            res.status(200).jsonp(house);
        }
    );
    
};