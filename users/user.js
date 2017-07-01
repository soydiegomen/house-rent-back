var mongoose = require('mongoose');  
var userModel = require('./user-model');

//POST - Insert a new User in the DB
exports.addUser = function(req, res) {  
    console.log('POST');
    console.log(req.body);

    var newUser = new userModel({
        name:    req.body.name,
        email:     req.body.email,
        password:  req.body.password,
        userType:   req.body.userType,
        isActive:  req.body.isActive
    });

    newUser.save(function(err, user) {
        if(err) 
            return res.status(500).send( err.message);
        res.status(200).jsonp(user);
    });
};

//GET - Return all users in the DB
exports.getAllUsers = function(req, res) {  
    userModel.find(function(err, users) {
        if(err) 
            res.send(500, err.message);

        console.log('GET /users')
        res.status(200).jsonp(users);
    });
};