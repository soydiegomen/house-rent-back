'use strict';

var houseCtrl = require('./house');
var router = require('express').Router();

router.route('/houses')
	.get(houseCtrl.getAllHouses)
	.post(houseCtrl.addHouse);

router.route('/house/:id')
	.get(houseCtrl.getById)
	.put(houseCtrl.updateHouse)
	.delete(houseCtrl.deleteHouse);

module.exports = router;