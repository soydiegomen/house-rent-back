'use strict';

var FileModel = require('./file-model');
var multer  =   require('multer');
var sharp = require('sharp');
var fs = require('fs');

//Class variables
// containerPath is the fisical path where the file is saved
var containerPath = './uploads';
// publicContainer is used for the Front app for build the relative path
var publicContainer = 'uploads';
var defaultFileStatus = 'New';
//This prefix is used for optimized file. This files will be used for the Front app
const FILE_PREFIX = 'min-';
//File max length 1MB
var maxSize = 1024 * 1024;

/*Setup Multer*/
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    //Is posible define a url out of project directory
    //callback(null, '/proyectos/home/temp');
    callback(null, containerPath);
  },
  filename: function (req, file, callback) {
        //En fileFilter definimos el nombre que tendra el archivo 
        //Y se lo asignamos a req.boyd.newFileName
        callback(null, req.body.newFileName);
    }
});

function fileFilter (req, file, callback) {
    //TODO userId get from sesión. For MVP culd be hardcoded
    var userId = '59659ecf9fbf3e320d000002';
    //For save file the form must have a userId field
    if(!userId || userId.length === 0){
        //When error happend must return this error, for send to the user
        //This instruction avoid save the file in the sever
        callback(null, false);
    }
    
    var newFileName =  Date.now() + '-' + file.originalname;
    // fileUrl is used for the front project for retrive the file
    //The file who is saved for Multer module will be deleted afeter create a optimized file
    var fileUrl = publicContainer + '/' + FILE_PREFIX + newFileName;

    var newFile = new FileModel({
        userId:  userId,
        fileUrl:    fileUrl ,
        name:  file.originalname,
        fileType:  file.mimetype,
        //size:    file.size,
        status:  defaultFileStatus
    });

    newFile.save(function(err, savedfile) {
        if(err) {
            //When error happend must return this error, for send to the user
            //This instruction avoid save the file in the sever
            callback(null, false);
        }
        //Set file row info in request body for return data to the user
        req.body.savedFile = savedfile;
        req.body.newFileName = newFileName;

        // To accept the file pass `true`, like so:
        callback(null, true);
    });
}

//When limit is exced the server return the json {"error":"File too large"}
var upload = multer({ 
            storage : storage, 
            fileFilter : fileFilter,
            limits: { fileSize: maxSize } 
        }).single('userPhoto');

function resizeImage(filePath, fileName){
    console.log('Start resize image');
    var fileToResize = filePath + '/' + fileName;
    var fileDestiny = filePath + '/' + FILE_PREFIX + fileName;
    sharp(fileToResize)
      .resize(800)
      .toFile(fileDestiny)
      .then(function() {
        //delete original file
        fs.unlinkSync(fileToResize);
      })
      .catch( function(err) {
        console.log('Some error happend', err);
      });
}

//POST - Insert a new File in the DB
exports.uploadFile = function(req, res) {  
    upload(req,res,function(err) {
        if(err) {
            //Return to user the json error
            return res.status(500).jsonp({ error : err.message });
        }else{
            //Si no hubo errores se redimenciona la imagen
            resizeImage( containerPath, req.body.newFileName );

        }
        //Return saved file data
        res.status(200).jsonp( req.body.savedFile );
    });
    
};

