'use strict';

var FileModel = require('./file-model');
var multer  =   require('multer');
//var path = require('path');
var fileContainer = 'uploads';
var containerPath = './' + fileContainer;
var defaultFileStatus = 'New';


/*Setup Multer*/
/*Setup Multer*/
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, containerPath);
  },
  filename: function (req, file, callback) {
        //En fileFilter definimos el nombre que tendra el archivo 
        //Y se lo asignamos a req.boyd.newFileName
        callback(null, req.body.newFileName);
    }
});

function fileFilter (req, file, callback) {
    console.log('In fileFilter');
    //TODO userId get from sesión. For MVP culd be hardcoded
    var userId = '59659ecf9fbf3e320d000002';
    //For save file the form must have a userId field
    if(!userId || userId.length === 0){
        //When error happend must return this error, for send to the user
        //This instruction avoid save the file in the sever
        callback(null, false);
    }

    var newFileName =  Date.now() + '-' + file.originalname;
    var fileUrl = fileContainer + '/' + newFileName;

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
        callback(null, true)
    });
}
var upload = multer({ 
        storage : storage, 
        fileFilter : fileFilter })
        .single('userPhoto');

//POST - Insert a new File in the DB
exports.uploadFile = function(req, res) {  
    upload(req,res,function(err) {
        if(err) {
            //Return to user the json error
            return res.status(500).jsonp({ error : err.message });
        }
        //Return saved file data
        res.status(200).jsonp( req.body.savedFile );
    });
};