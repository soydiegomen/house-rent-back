'use strict';

var HouseModel = require('./house-model');
const PAGE_SIZE = 2;


//GET - Return a House with specified ID
exports.getPublishedHouses = function(req, res) {

    //Build the filters using query string parametters
    var filters = buildJSONFilter(req);
    //[left or rigth]
    let pagDirection = req.query.pagDirection;
    let sortJSON = null
    if(pagDirection === 'rigth' ){
      sortJSON = {
          //Ordenadas de forma descendiente (lastModification)
          lastModification : -1
      };
    }else{
      //Left case
      sortJSON = {
          //Ordenadas de forma ascendiente (lastModification)
          lastModification : 1
      };
    }

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

            res.status(200).jsonp(house);
        }
    );

};

/*
Helpers
*/
function buildJSONFilter(req){
    //Published is the default status
    var status = 'Publicado';
    var propertyType = req.query.property;
    var operationType = req.query.operation;
    var min = req.query.min;
    var max = req.query.max;
    var search = req.query.search;
    //Next result page
    let itemLastDate = req.query.itemLastDate;
    let pagDirection = req.query.pagDirection;
    //var datePagination = '2018-04-17 03:36:23.865Z';

    let paginationFilter = null;
    if(pagDirection === 'rigth' ){
      paginationFilter = {
          $lte : new Date(itemLastDate)
      }
    }else{
      //Left case
      paginationFilter = {
          $gte : new Date(itemLastDate)
      }
    }

    var filters = {
        status: status,
        lastModification: paginationFilter
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


    return filters;
}
