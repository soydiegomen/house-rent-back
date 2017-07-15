'use strict';

var fileCtrl = require('./file');
var fileUploaderCtrl = require('./file-uploader');
var router = require('express').Router();

router.route('/files')
	.get(fileCtrl.getAllFiles)
	.post(fileCtrl.addFile);

router.route('/file/:id')
	.get(fileCtrl.getById)
	.put(fileCtrl.updateFiles)
	.delete(fileCtrl.deleteFile);

router.route('/upload-files')
	.post(fileUploaderCtrl.uploadFile);

module.exports = router;