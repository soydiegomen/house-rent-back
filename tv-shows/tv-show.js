var mongoose = require('mongoose');  
var tvShow = require('./tv-show-model');

//GET - Return all tvshows in the DB
exports.getAllTVShows = function(req, res) {  
    tvShow.find(function(err, tvshows) {
        if(err) 
            res.send(500, err.message);

        console.log('GET /tvshows')
        res.status(200).jsonp(tvshows);
    });
};

//GET - Return a TVShow with specified ID
exports.getById = function(req, res) {  
    tvShow.findById(req.params.id, function(err, show) {
        if(err) 
            return res.send(500, err.message);

        console.log('GET /tvshow/' + req.params.id);
        res.status(200).jsonp(show);
    });
};

//POST - Insert a new TVShow in the DB
exports.addTVShow = function(req, res) {  
    console.log('POST');
    console.log(req.body);

    var newshow = new tvShow({
        title:    req.body.title,
        year:     req.body.year,
        country:  req.body.country,
        poster:   req.body.poster,
        seasons:  req.body.seasons,
        genre:    req.body.genre,
        summary:  req.body.summary
    });

    newshow.save(function(err, show) {
        if(err) 
            return res.status(500).send( err.message);
        res.status(200).jsonp(show);
    });
};

//PUT - Update a register already exists
exports.updateTVShow = function(req, res) {  
    tvShow.findById(req.params.id, function(err, show) {
        show.title   = req.body.title;
        show.year    = req.body.year;
        show.country = req.body.country;
        show.poster  = req.body.poster;
        show.seasons = req.body.seasons;
        show.genre   = req.body.genre;
        show.summary = req.body.summary;

        show.save(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).jsonp(show);
        });
    });
};

//DELETE - Delete a TVShow with specified ID
exports.deleteTVShow = function(req, res) {  
    tvShow.findById(req.params.id, function(err, show) {
        show.remove(function(err) {
            if(err) 
                return res.status(500).send(err.message);
            res.status(200).send();
        })
    });
};