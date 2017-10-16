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

    if(propertyType){
        filters.propertyType = propertyType;
    }

    if(operationType){
        filters.operationType = operationType;
    }

    if(greater && least){
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

/*
db.getCollection('houses').aggregate(
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
                $match: 
                {
                    //Solo las casas publicadas
                    status: 'Publicado',
                    propertyType: 'Casa',
                    operationType: 'Venta',
                    price: { $gt: 1000, $lt: 5000 },
                    $or: [ { title: /prueba/i } , { summary: /prueba/i }, 
                        { 'address.address': /prueba/i }, { 'contact.name': /prueba/i } 
                    ]
                }
            },
            { 
                $sort : 
                { 
                    //Ordenadas por la última fecha de modificación  
                    lastModification : -1  
                } 
            }
        ])

*/