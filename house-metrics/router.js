'use strict';

var houseMetCtrl = require('./house-metric');
var router = require('express').Router();

router.route('/house-metrics')
	.get(houseMetCtrl.getAllHouseMetrics)
	.post(houseMetCtrl.addHouseMetric);

router.route('/house-metric/:id')
	.get(houseMetCtrl.getById)
	.put(houseMetCtrl.updateHouseMetric)
	.delete(houseMetCtrl.deleteHouseMetric);

module.exports = router;