'use strict';

var FileModel = require('./file-model');

//GET - Return all Files in the DB
exports.getAllFiles = function(req, res) {  
    FileModel.find(function(err, files) {
        if(err) 
            res.send(500, err.message);

        res.status(200).jsonp(files);
    });
};

//GET - Return a Files with specified ID
exports.getById = function(req, res) {  
    FileModel.findById(req.params.id, function(err, file) {
        if(err) 
            return res.send(500, err.message);

        res.status(200).jsonp(file);
    });
};

//POST - Insert a new File in the DB
exports.addFile = function(req, res) {  
    console.log(req.body);

    var newFile = new FileModel({
        userId:  req.body.userId,
        fileUrl:    req.body.fileUrl,
        name:  req.body.name,
        fileType:  req.body.fileType,
        size:    req.body.size,
        status:  req.body.status
    });

    newFile.save(function(err, file) {
        if(err) 
            return res.status(500).send( err.message);
        res.status(200).jsonp(file);
    });
};

//PUT - Update a register already exists
exports.updateFiles = function(req, res) {  
    FileModel.findById(req.params.id, function(err, file) {
        file.userId   = req.body.userId;
        file.fileUrl    = req.body.fileUrl;
        file.name   = req.body.name;
        file.fileUrl    = req.body.fileUrl;
        file.fileType   = req.body.fileType;
        file.size    = req.body.size;
        file.status    = req.body.status;
        file.lastModification = new Date();

        file.save(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).jsonp(file);
        });
    });
};

//DELETE - Delete a File with specified ID
exports.deleteFile = function(req, res) {  
    FileModel.findById(req.params.id, function(err, file) {
        file.remove(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).send();
        });
    });
};