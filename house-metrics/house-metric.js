'use strict';
var mongoose = require('mongoose');
var HouseMetModel = require('./house-metric-model');

//GET - Return all houseMet in the DB
exports.getAllHouseMetrics = function(req, res) {
    HouseMetModel.find(function(err, houseMet) {
        if(err)
            res.send(500, err.message);

        res.status(200).jsonp(houseMet);
    });
};

//GET - Return a House Metric with specified ID
exports.getById = function(req, res) {
    HouseMetModel.findById(req.params.id, function(err, houseMet) {
        if(err)
            return res.send(500, err.message);

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
  .then(
    function (metrics){
      res.status(200).jsonp(metrics);
    }
  )
  .catch(
    function (err){
      res.send(500, err.message);
    }
  )
};

//POST - Insert a new House Metric in the DB
exports.addHouseMetric = function(req, res) {
    var newHouseMet = new HouseMetModel({
        houseId:  req.body.houseId,
        views:    req.body.views,
        likes:  req.body.likes
    });

    saveHouseMetric(newHouseMet, res);
};

//PUT - Update a register already exists
exports.updateHouseMetric = function(req, res) {
    HouseMetModel.findById(req.params.id, function(err, houseMet) {
        houseMet.views   = req.body.views;
        houseMet.likes    = req.body.likes;
        houseMet.lastModification = new Date();

        saveHouseMetric(houseMet, res);
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

/*
Add like
*/
exports.addMetric = function(req, res) {
  HouseMetModel.find({
    houseId : req.params.id
  })
  .then( function (metrics){
    let houseMetric = {};

    if(metrics.length > 0){
      //Este caso es para cuando ya tiene una metrica registrada
      houseMetric = metrics[0];
    }else{
      //Este caso es para cuando no tiene una metrica registrada
      houseMetric = new HouseMetModel({
          houseId:  req.params.id,
          views:    0,
          likes:  0
      });
    }

    //Increase [likes, views] of house
    switch (req.body.type) {
      case "likes":
        houseMetric.likes++;
        break;
      case "views":
        houseMetric.views++;
        break;
    }

    houseMetric.lastModification = new Date();
    saveHouseMetric(houseMetric, res);

  })
  .catch( function (err){
    res.send(500, err.message);
  });
};

/*
Remove like
*/
exports.removeMetric = function(req, res) {
  HouseMetModel.find({
    houseId : req.params.id
  })
  .then( function (metrics){
    let houseMetric = {};
    if(metrics.length > 0){
      //Este caso es para cuando ya tiene una metrica registrada
      houseMetric = metrics[0];

      //Increase likes of house
      if(houseMetric.likes > 0){
        //Increase [likes, views] of house
        switch (req.body.type) {
          case "likes":
            houseMetric.likes--;
            break;
          case "views":
            houseMetric.views--;
            break;
        }

        houseMetric.lastModification = new Date();

        saveHouseMetric(houseMetric, res);
        return;
      }
    }
    //Else does not need create a metric row
    return res.status(200).jsonp(houseMetric);
  })
  .catch( function (err){
    res.send(500, err.message);
  });
};

//Function for save a House Metric
function saveHouseMetric(houseMetric, res){
  houseMetric.save()
  .then( function (){
    return res.status(200).jsonp(houseMetric);
  })
  .catch(function (saveError){
    return res.status(500).send(saveError.message);
  });
}
