'use strict';
var mongoose = require('mongoose');  
var HouseFileModel = require('./house-file-model');

/*Helpers*/
function deleteFilesOfHouse(houseFiles){
    //Borrar todos los archivos
    if(houseFiles.length > 0){
        //TODO: Si la imagen esta dentro del arreglo de las imagenes a agregar
        //no se debería borrar
        houseFiles.forEach(function(item) {
            //TODO: Debemos borrar también los archivos de forma forma física
            item.remove(function(err) {
                if(err){
                    //TODO: Manejar cuando hay un error
                    console.log('Error al borrar una imagen' + err.message);
                }
            });
        });
    }   
}

function saveHouseFiles(arrayFiles, houseId, callback){
    var arrayNewFiles = [];
    var filesToSave = arrayFiles.length;
    
    arrayFiles.forEach(function(fileId) {
        var newHouseFile = new HouseFileModel({
            houseId:    houseId,
            fileId:     fileId,
            isActive:  true
        });

        newHouseFile.save(function(err, houseFile) {
            if(err){
                //TODO: Manejar cuando hay un error
                console.log('Error al borrar una imagen' + err.message);
            }
            //Agrego el archivo a un arreglo para reponderlo al request
            arrayNewFiles.push(houseFile);

            filesToSave--;
            //Si no hay archivos por guardar respondemos el request para terminar el proceso
            if(filesToSave === 0){
                callback(arrayNewFiles);
                //res.status(200).jsonp(arrayNewFiles);
            }
        });
    });
}

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

//POST - Save the files of a house
exports.saveFilesOfHouse = function(req, res) {  
    var houseId = req.body.houseId;
    var arrayFiles = req.body.files;

    //Save new files
    saveHouseFiles(arrayFiles, houseId, function(savedFilesArray){
        res.status(200).jsonp(savedFilesArray);
    });
};

//PUT - Update the files of a house. First delete the old files, after save all files like they are news
exports.updateFilesOfHouse = function(req, res) {  
    var houseId = req.params.houseId;

    HouseFileModel.find({
        houseId: new mongoose.Types.ObjectId(houseId)
    })
    .exec(function(err, houseFiles) {
        if(err) 
            res.send(500, err.message);

        //Borrar todos los archivos. Para agregar los que se recibieron como si fueran nuevos
        deleteFilesOfHouse(houseFiles);

        var arrayFiles = req.body.files;
        var filesToSave = arrayFiles.length;
        
        if(filesToSave === 0){
            res.status(200).jsonp([]);
        }

        //Save new files
        saveHouseFiles(arrayFiles, houseId, function(savedFilesArray){
            res.status(200).jsonp(savedFilesArray);
        });
        
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

