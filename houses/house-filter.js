'use strict';

var HouseModel = require('./house-model');

//GET - Return all houses in the DB
exports.getHousesByFilters = function(req, res) {  
    //Publicado is the default status for show houses in the aplication
    var status = 'Publicado';
    HouseModel.find({ 
        status : status
    })
    .sort( 
        //order DESC
        { 
            creationDate : -1 
        }
    )
    .exec(function(err, answer) {
        if(err){
            res.send(500, err.message);
        }

        res.status(200).jsonp(answer);
    });
};
/*Probar en Robomongo*/
/*
db.getCollection('houses').aggregate([
{
$lookup:
  {
  from: "files",
  localField: "files",
  foreignField: "_id",
  as: "filesData"
  }
}
])
*/