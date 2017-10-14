'use strict';

var houseCtrl = require('./house');
var publishedHouseCtrl = require('./published-house');
var router = require('express').Router();

/*Services used for admin*/

router.route('/houses')
	.get(houseCtrl.getAllHouses)
	.post(houseCtrl.addHouse);

router.route('/house/:id')
	.get(houseCtrl.getById)
	.put(houseCtrl.updateHouse)
	.delete(houseCtrl.deleteHouse);

router.route('/houses/byStatus/:status')
	.get(houseCtrl.getHousesByStatus);

router.route('/house-with-files/:id')
	.get(houseCtrl.getHouseWithFiles);

/*Services used for main app*/

router.route('/published-houses')
	.get(publishedHouseCtrl.getPublishedHouses);

module.exports = router;