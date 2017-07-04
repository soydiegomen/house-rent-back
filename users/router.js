'use strict';

var userCtrl = require('./user');
var router = require('express').Router();

router.route('/users')
	.get(userCtrl.getAllUsers)
	.post(userCtrl.addUser);

module.exports = router;