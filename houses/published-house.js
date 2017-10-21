'use strict';

var HouseModel = require('./house-model');


//GET - Return a House with specified ID
exports.getPublishedHouses = function(req, res) {  
    
    //Build the filters using query string parametters
    var filters = buildJSONFilter(req);

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
                $match: filters
            },
            { 
                $sort : 
                { 
                    //Ordenadas por la última fecha de modificación  
                    lastModification : -1  
                } 
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
    var greater = req.query.greater; 
    var least = req.query.least;
    var search = req.query.search; 

    var filters = {
        status: status
    };

    if(propertyType && propertyType.length > 0){
        filters.propertyType = propertyType;
    }

    if(operationType && operationType.length > 0){
        filters.operationType = operationType;
    }

    if(greater && (least && least > 0)){
        filters.price = { $gt: Number(greater), $lt: Number(least) };
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