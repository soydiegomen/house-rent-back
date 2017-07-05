'use strict';

var express = require('express'),
	bodyParser  = require('body-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
	app = express();

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());
//Enable All CORS Requests
app.use(cors());

// Load the routes ("controllers" -ish)
app.use('/api', require('./users/router'));

// Export the app instance for unit testing via supertest
module.exports = app;