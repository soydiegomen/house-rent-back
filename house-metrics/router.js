'use strict';

var houseMetCtrl = require('./house-metric');
var router = require('express').Router();

router.route('/house-metrics')
	.get(houseMetCtrl.getHouseMetrics)
	.post(houseMetCtrl.addHouseMetric);

router.route('/house-metric/:id')
	.get(houseMetCtrl.getById)
	.put(houseMetCtrl.updateHouseMetric)
	.delete(houseMetCtrl.deleteHouseMetric);

//Add and remove [like, views]
router.route('/housemetric/:id')
		.post(houseMetCtrl.addMetric)
		.delete(houseMetCtrl.removeMetric);

module.exports = router;
