'use strict';

var houseCtrl = require('./house');
var houseFilterCtrl = require('./house-filter');
var router = require('express').Router();

router.route('/houses')
	.get(houseCtrl.getAllHouses)
	.post(houseCtrl.addHouse);

router.route('/house/:id')
	.get(houseCtrl.getById)
	.put(houseCtrl.updateHouse)
	.delete(houseCtrl.deleteHouse);

router.route('/houses/byStatus/:status')
	.get(houseCtrl.getHousesByStatus);

router.route('/houses/filter')
	.get(houseFilterCtrl.getHousesByFilters);

router.route('/house-with-files/:id')
	.get(houseCtrl.getHouseWithFiles);

module.exports = router;