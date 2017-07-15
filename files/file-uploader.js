'use strict';

var FileModel = require('./file-model');
var multer  =   require('multer');
var path = require('path');

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

/*Setup Multer*/
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    //callback(null, file.fieldname + '-' + Date.now());
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //callback(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage : storage}).single('userPhoto');

//POST - Insert a new File in the DB
exports.uploadFile = function(req, res) {  
    upload(req,res,function(err) {
        if(err) {
            return res.status(500).send(err.message);
        }
        res.status(200).jsonp({ result : 'ok'});
    });
};