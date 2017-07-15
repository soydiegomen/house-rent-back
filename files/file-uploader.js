'use strict';

var FileModel = require('./file-model');
var multer  =   require('multer');
//var path = require('path');
var fileContainer = 'uploads';
var containerPath = './' + fileContainer;
var defaultFileStatus = 'New';


/*Setup Multer*/
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, containerPath);
  },
  filename: function (req, file, callback) {

        var newFileName =  Date.now() + '-' + file.originalname;
        var fileUrl = fileContainer + '/' + newFileName;
        
        var newFile = new FileModel({
            userId:  '59659ecf9fbf3e320d000002',
            fileUrl:    fileUrl ,
            name:  file.originalname,
            fileType:  file.mimetype,
            //size:    file.size,
            status:  defaultFileStatus
        });

        newFile.save(function(err, savedfile) {
            if(err) {
                console.log('Some error happend');
                //return res.status(500).send( err.message);
            }else{
                console.log(savedfile);
            }
                
        });
        callback(null, newFileName);
    }
});


var upload = multer({ storage : storage}).single('userPhoto');
/*
var app = express()

app.use(multer(config))
*/
//POST - Insert a new File in the DB
exports.uploadFile = function(req, res) {  
    upload(req,res,function(err) {
        if(err) {
            return res.status(500).send(err.message);
        }

        
        //
        res.status(200).jsonp( { result : 'ok'});
    });
};