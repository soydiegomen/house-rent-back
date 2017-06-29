var app = require('./index');
	mongoose = require('mongoose'),
	config = require('./config');

// Connection to DB
mongoose.connect('mongodb://'+ config.mongodb.host +'/tvshows', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

// Note that there's not much logic in this file.
// The server should be mostly "glue" code to set things up and
// then start listening
app.listen(config.express.port, config.express.ip, function (error) {
  if (error) {
    log.error('Unable to listen for connections', error)
    process.exit(10)
  }
  console.log('Node server running on http://' + config.express.ip + ':' +config.express.port);
})