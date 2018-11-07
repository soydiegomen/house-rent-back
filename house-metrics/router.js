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


router.route('/houseLike/:id')
		.put(houseMetCtrl.addLike);

module.exports = router;
