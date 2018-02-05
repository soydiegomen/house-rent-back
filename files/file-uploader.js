'use strict';

var FileModel = require('./file-model');
var multer  =   require('multer');
//var sharp = require('sharp');
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

/*File Helpers*/
//Build and create the destination path
function getDestinationPath(basePath){
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();

    //Example: /uploads/2017/09/31
    //var finalPath = basePath + currentYear + '/' + currentMonth + '/' + currentDay;
    var finalPath =  '/' + currentYear;

    if (!fs.existsSync(basePath + finalPath)){
        fs.mkdirSync(basePath + finalPath);
    }

    //Append Month
    finalPath = finalPath + '/' + currentMonth;

    if (!fs.existsSync(basePath + finalPath)){
        fs.mkdirSync(basePath + finalPath);
    }

    //Append Day
    finalPath = finalPath + '/' + currentDay;

    if (!fs.existsSync(basePath + finalPath)){
        fs.mkdirSync(basePath + finalPath);
    }

    return finalPath;
}

/*Setup Multer*/
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    //Is posible define a url out of project directory
    //callback(null, '/proyectos/home/temp');
    
    callback(null, req.body.destinationPath);
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
    
    var destinationPath = getDestinationPath(containerPath);
    //Path for save the new file
    var pathForSaveFile = containerPath + destinationPath;
    //Relative path (this is for define the relative path used for consume the file, using another aplication)
    var relativePath = publicContainer + destinationPath;

    var newFileName =  Date.now() + '-' + file.originalname;
    var tempFileName = FILE_PREFIX + newFileName 
    // fileUrl is used for the front project for retrive the file
    //The file who is saved for Multer module will be deleted afeter create a optimized file
    var fileUrl = relativePath + '/' + tempFileName;

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

        //newFileName is the final file, this will be optimized
        req.body.newFileName = newFileName;
        //tempFileName is a temporal file created just for dowload the file
        req.body.tempFileName = tempFileName;
        //Final path for save the file
        req.body.destinationPath = pathForSaveFile;

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

function resizeImage(filePath, fileName, tempFileName){
    
    var fileToResize = filePath + '/' + fileName;
    console.log("#### Saved file");
    console.log(fileToResize);
    var fileDestiny = filePath + '/' + tempFileName;
    //Comente el uso de Sharp ya que requiere actualizar el modulo a una versión más reciente de node
    /*
    return sharp(fileToResize)
      .resize(800)
      .toFile(fileDestiny)
      .then(function() {
        //delete original file
        fs.unlinkSync(fileToResize);
      })
      .catch( function(err) {
        console.log('Some error happend', err);
      });*/
}


//POST - Insert a new File in the DB
exports.uploadFile = function(req, res) {  
    upload(req,res,function(err) {
        if(err) {
            //Return to user the json error
            return res.status(500).jsonp({ error : err.message });
        }else{
            
            //Comente estas lineas en lo que hago el upgrade de Sharp
            /*
            //Si no hubo errores se redimenciona la imagen
            resizeImage( req.body.destinationPath, 
                req.body.newFileName,
                req.body.tempFileName )
            .then(function (){
                //Return saved file data
                res.status(200).jsonp( req.body.savedFile );            
            });
            */
            resizeImage( req.body.destinationPath, 
                req.body.newFileName,
                req.body.tempFileName );
            console.log('Savedfile: ' + req.body.savedFile);
            res.status(200).jsonp( req.body.savedFile );            
        }
        
    });
    
};

