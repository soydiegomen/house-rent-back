'use strict';
var mongoose = require('mongoose');  
var HouseMetModel = require('./house-metric-model');

//GET - Return all houseMet in the DB
exports.getAllHouseMetrics = function(req, res) {
    HouseMetModel.find(function(err, houseMet) {
        if(err)
            res.send(500, err.message);

        console.log('GET /houseMet');
        res.status(200).jsonp(houseMet);
    });
};

//GET - Return a House Metric with specified ID
exports.getById = function(req, res) {
    HouseMetModel.findById(req.params.id, function(err, houseMet) {
        if(err)
            return res.send(500, err.message);

        console.log('GET /houseMet/' + req.params.id);
        res.status(200).jsonp(houseMet);
    });
};

//GET - Return all houseMet in the DB
exports.getHouseMetrics = function(req, res) {
    var filters = req.query.houseId ?
      {
        houseId : new mongoose.Types.ObjectId(req.query.houseId)
      }
      : {};

    HouseMetModel.find(filters)
    .exec(function(err, metrics) {
        if(err){
            res.send(500, err.message);
        }

        res.status(200).jsonp(metrics);
    });
};

//POST - Insert a new House Metric in the DB
exports.addHouseMetric = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var newHouseMet = new HouseMetModel({
        houseId:  req.body.houseId,
        views:    req.body.views,
        likes:  req.body.likes
    });

    newHouseMet.save(function(err, houseMet) {
        if(err)
            return res.status(500).send( err.message);
        res.status(200).jsonp(houseMet);
    });
};

//PUT - Update a register already exists
exports.updateHouseMetric = function(req, res) {
    HouseMetModel.findById(req.params.id, function(err, houseMet) {
        houseMet.views   = req.body.views;
        houseMet.likes    = req.body.likes;
        houseMet.lastModification = new Date();

        houseMet.save(function(err) {
            if(err)
                return res.status(500).send(err.message);
            res.status(200).jsonp(houseMet);
        });
    });
};

//DELETE - Delete a House Metric with specified ID
exports.deleteHouseMetric = function(req, res) {
    HouseMetModel.findById(req.params.id, function(err, houseMet) {
        houseMet.remove(function(err) {
            if(err)
                return res.status(500).send(err.message);
            res.status(200).send();
        });
    });
};
