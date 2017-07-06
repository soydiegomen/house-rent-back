'use strict';

var HouseModel = require('./house-model');

//GET - Return all houses in the DB
exports.getAllHouses = function(req, res) {  
    HouseModel.find(function(err, houses) {
        if(err) 
            res.send(500, err.message);

        console.log('GET /houses');
        res.status(200).jsonp(houses);
    });
};


//POST - Insert a new User in the DB
exports.addHouse = function(req, res) {  
    console.log('POST');
    console.log(req.body);

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
        contact:   req.body.contact
    });

    newHouse.save(function(err, house) {
        if(err) 
            return res.status(500).send( err.message);
        res.status(200).jsonp(house);
    });
};