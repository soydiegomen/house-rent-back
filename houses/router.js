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

/*Obtiene el modelo house y sus archivos (filtra por el id de la casa)*/
router.route('/house-with-files/:id')
	.get(houseCtrl.getHouseWithFiles);

/*Services used for main app*/

/*Obtiene las casas publicadas para mostrarlas en el home.
Estas casas pueden filtrarse utilizando varios criterios y también implementa paginación*/
router.route('/published-houses')
	.get(publishedHouseCtrl.getPublishedHouses);

	/*Obtiene el número de casas publicadas.
	Estas casas pueden filtrarse utilizando varios criterios.
	Sirve para saber el número de elementos obtenidos en el servicio published-houses*/
router.route('/published-houses/count')
		.get(publishedHouseCtrl.countPublishedHouses);

module.exports = router;
