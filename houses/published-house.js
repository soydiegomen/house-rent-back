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