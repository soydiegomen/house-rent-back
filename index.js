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
app.use('/api', require('./houses/router'));
app.use('/api', require('./house-metrics/router'));
app.use('/api', require('./files/router'));
app.use('/api', require('./house-files	/router'));

// Export the app instance for unit testing via supertest
module.exports = app;