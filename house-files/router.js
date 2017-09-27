'use strict';

var houseFileCtrl = require('./house-file');
var router = require('express').Router();

router.route('/house-files')
	.get(houseFileCtrl.getAllHouseFiles)
	.post(houseFileCtrl.addHouseFile);

router.route('/house-file/:id')
	.get(houseFileCtrl.getById)
	.put(houseFileCtrl.updateHouseFile)
	.delete(houseFileCtrl.deleteHouseFile);

router.route('/files-of-house/:houseId')
	.get(houseFileCtrl.getFileDetailsByHouse);

module.exports = router;