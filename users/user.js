'use strict';

var UserModel = require('./user-model');

//GET - Return all users in the DB
exports.getAllUsers = function(req, res) {  
    UserModel.find(function(err, users) {
        if(err) 
            res.send(500, err.message);

        console.log('GET /users');
        res.status(200).jsonp(users);
    });
};

//GET - Return a User with specified ID
exports.getById = function(req, res) {  
    UserModel.findById(req.params.id, function(err, user) {
        if(err) 
            return res.send(500, err.message);

        console.log('GET /user/' + req.params.id);
        res.status(200).jsonp(user);
    });
};

//POST - Insert a new User in the DB
exports.addUser = function(req, res) {  
    console.log('POST');
    console.log(req.body);

    var newUser = new UserModel({
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

//PUT - Update a register already exists
exports.updateUser = function(req, res) {  
    UserModel.findById(req.params.id, function(err, user) {
        user.name   = req.body.name;
        user.email    = req.body.email;
        user.password = req.body.password;
        user.userType  = req.body.userType;
        user.isActive = req.body.isActive;

        user.save(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).jsonp(user);
        });
    });
};

//DELETE - Delete a User with specified ID
exports.deleteUser = function(req, res) {  
    UserModel.findById(req.params.id, function(err, user) {
        user.remove(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).send();
        });
    });
};