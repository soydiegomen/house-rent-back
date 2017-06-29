var tvShowCtrl = require('./tv-show');
var router = require('express').Router();

router.route('/tvshows')
	.get(tvShowCtrl.getAllTVShows)
	.post(tvShowCtrl.addTVShow);

router.route('/tvshows/:id')
	.get(tvShowCtrl.getById)
	.put(tvShowCtrl.updateTVShow)
	.delete(tvShowCtrl.deleteTVShow);

module.exports = router;