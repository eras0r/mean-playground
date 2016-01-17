var mongoose = require('mongoose');
var log = require('../lib/logger');

// set promise provider to bluebird
mongoose.Promise = require('bluebird');

var databaseUrl = 'mongodb://localhost/lost';

var options = {
  user: 'lost',
  pass: 'b6DNfHABKU',
  auth: {
    authdb: 'lost'
  }
};

mongoose.connect(databaseUrl, options, function (err) {
  if (err) {
    log.error('Error connecting to database "' + databaseUrl + '"', err);
  } else {
    log.info('Successfully connected to database "' + databaseUrl + '"');
  }
});
