'use strict';

var HouseModel = require('./house-model');


//GET - Return a House with specified ID
exports.getPublishedHouses = function(req, res) {  
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
                $match: 
                {
                    //Solo las casas publicadas
                    status: 'Publicado'
                }
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