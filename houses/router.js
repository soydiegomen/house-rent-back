'use strict';

var houseCtrl = require('./house');
var router = require('express').Router();

router.route('/houses')
	.get(houseCtrl.getAllHouses)
	.post(houseCtrl.addHouse);

module.exports = router;