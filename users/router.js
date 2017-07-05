'use strict';

var userCtrl = require('./user');
var router = require('express').Router();

router.route('/users')
	.get(userCtrl.getAllUsers)
	.post(userCtrl.addUser);

router.route('/user/:id')
	.get(userCtrl.getById)
	.put(userCtrl.updateUser)
	.delete(userCtrl.deleteUser);

module.exports = router;