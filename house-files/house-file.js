'use strict';
var mongoose = require('mongoose');  
var HouseFileModel = require('./house-file-model');

//GET - Return all house files in the DB
exports.getAllHouseFiles = function(req, res) {  
    HouseFileModel.find(function(err, houseFiles) {
        if(err) 
            res.send(500, err.message);

        res.status(200).jsonp(houseFiles);
    });
};

//GET - Return a House file with specified ID
exports.getById = function(req, res) {  
    HouseFileModel.findById(req.params.id, function(err, houseFile) {
        if(err) 
            return res.send(500, err.message);

        res.status(200).jsonp(houseFile);
    });
};

//GET - Return a House file with specified ID
exports.getFileDetailsByHouse = function(req, res) {  
    HouseFileModel.aggregate([
            {
              $lookup:
                {
                  from: 'files',
                  localField: 'fileId',
                  foreignField: '_id',
                  as: 'file'
                }
           },
           {
              $match: { 'houseId': new mongoose.Types.ObjectId(req.params.houseId) }
           }
        ], function(err, houseFile) {
        if(err) 
            return res.send(500, err.message);

        res.status(200).jsonp(houseFile);
    });
};

//POST - Insert a new House file in the DB
exports.addHouseFile = function(req, res) {  

    var newHouseFile = new HouseFileModel({
        houseId:    req.body.houseId,
        fileId:     req.body.fileId,
        isActive:  req.body.isActive
    });

    newHouseFile.save(function(err, houseFile) {
        if(err) 
            return res.status(500).send( err.message);
        res.status(200).jsonp(houseFile);
    });
};

//PUT - Update a register already exists
exports.updateHouseFile = function(req, res) {  
    HouseFileModel.findById(req.params.id, function(err, houseFile) {
        houseFile.houseId   = req.body.houseId;
        houseFile.fileId    = req.body.fileId;
        houseFile.isActive = req.body.isActive;
        houseFile.lastModification = new Date();

        houseFile.save(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).jsonp(houseFile);
        });
    });
};

//PUT - Update a register already exists
exports.updateFilesOfHouse = function(req, res) {  
    var houseId = req.params.houseId;

    HouseFileModel.find({
        houseId: new mongoose.Types.ObjectId(houseId)
    })
    .exec(function(err, houseFiles) {
        if(err) 
            res.send(500, err.message);

        //Borrar todos los archivos
        if(houseFiles.length > 0){
            //TODO: Si la imagen esta dentro del arreglo de las imagenes a agregar
            //no se debería borrar
            houseFiles.forEach(function(item) {
                //TODO: Debemos borrar también los archivos de forma forma física
                item.remove(function(err) {
                    if(err){
                        //TODO: Manejar cuando hay un error
                        //return res.status(500).send(err.message);
                        console.log('Error al borrar una imagen' + err.message);
                    }
                });
            });
        }

        req.body.files.forEach(function(fileId) {
            var newHouseFile = new HouseFileModel({
                houseId:    houseId,
                fileId:     fileId,
                isActive:  true
            });

            newHouseFile.save(function(err, houseFile) {
                if(err){
                    //TODO: Manejar cuando hay un error
                    //return res.status(500).send(err.message);
                    console.log('Error al borrar una imagen' + err.message);
                }
                console.log('Se agrego el archivo', houseFile);
            });
        });

        res.status(200).jsonp(houseFiles);
    });
};

//DELETE - Delete a House file with specified ID
exports.deleteHouseFile = function(req, res) {  
    HouseFileModel.findById(req.params.id, function(err, houseFile) {
        houseFile.remove(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).send();
        });
    });
};