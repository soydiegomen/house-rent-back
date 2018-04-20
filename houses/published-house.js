'use strict';

var HouseModel = require('./house-model');
const PAGE_SIZE = 2;


//GET - Return a House with specified ID
exports.getPublishedHouses = function(req, res) {

    //Build the filters using query string parametters
    var filters = buildJSONFilter(req);

    //Determina el ordenamiento dependiendo el sentido de la páginación
    let sortJSON = buildJSONSorter(req);

    HouseModel.aggregate(
        [
            {
                //Incluye la información de los archivos
                $lookup:
                {
                    from: 'files',
                    localField: 'files',
                    foreignField: '_id',
                    as: 'filesData'
                }
            },
            {
                //Incluye la información de las metricas
                $lookup:
                {
                    from: 'housemetrics',
                    localField: '_id',
                    foreignField: 'houseId',
                    as: 'metrics'
                }
            },
            {
                $match: filters,
            },
            {
                $sort : sortJSON
            },
            {
                $limit : PAGE_SIZE
            }
        ],
        function(err, house) {
            if(err){
                return res.send(500, err.message);
            }

            //Ordeno el listado de casas de forma descendiente con base en la fecha de la última actualización
            //TODO: el ordenamiento solo debería hacerse cuando la páginación es hacia la izquierda
            let sortedHouses = house.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.lastModification) - new Date(a.lastModification);
            });

            res.status(200).jsonp(house);
        }
    );

};

/*
Helpers
*/

function buildJSONSorter(req){
    let sortJSON = null;
    if(req.query.pagDirection === 'rigth' || !req.query.pagDirection){
      //Default case. Ordenadas de forma descendiente (lastModification)
      sortJSON = { lastModification : -1 };
    }else{
      //Ordenadas de forma ascendiente (lastModification)
      sortJSON = { lastModification : 1 };
    }

    return sortJSON;
}

function buildJSONFilter(req){
    //Published is the default status
    var status = 'Publicado';
    var propertyType = req.query.property;
    var operationType = req.query.operation;
    var min = req.query.min;
    var max = req.query.max;
    var search = req.query.search;
    //Pagination parametters
    let itemLastDate = req.query.itemLastDate;
    let pagDirection = req.query.pagDirection;

    var filters = {
        status: status
    };

    if(propertyType && propertyType.length > 0){
        filters.propertyType = propertyType;
    }

    if(operationType && operationType.length > 0){
        filters.operationType = operationType;
    }

    if(max && max > 0 && min){
        filters.price = { $gt: Number(min), $lt: Number(max) };
    }

    if(search){
        var likeRegEx = new RegExp(search, 'i');
        filters.$or = [
            { title: likeRegEx } ,
            { summary: likeRegEx },
            { 'address.address': likeRegEx },
            { 'contact.name': likeRegEx }
        ];
    }

    //paginationFilter
    let paginationFilter = null;
    if(pagDirection === 'rigth' || !pagDirection){
      //Default case. Navegación a la derecha
      filters.lastModification = {
          //Si no trae fecha utilizar la fecha actual
          $lte : (itemLastDate ? new Date(itemLastDate) : new Date())
      }
    }else{
      //Navegación a la izquierda
      filters.lastModification = {
          //Si no trae fecha utilizar la fecha actual
          $gte : new Date(itemLastDate)
      }
    }



    return filters;
}
