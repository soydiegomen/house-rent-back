'use strict';

var express = require('express'),
	bodyParser  = require('body-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
	app = express();
var multer  =   require('multer');
var path = require('path')

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());
//Enable All CORS Requests
app.use(cors());

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

app.post('/api/photo',function(req,res){
	console.log('Is in /api/photo ')
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
/*end setup Multer*/

// Load the routes ("controllers" -ish)
app.use('/api', require('./users/router'));
app.use('/api', require('./houses/router'));
app.use('/api', require('./house-metrics/router'));
app.use('/api', require('./files/router'));
app.use('/api', require('./house-files/router'));

// Export the app instance for unit testing via supertest
module.exports = app;