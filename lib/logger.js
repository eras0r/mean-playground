var bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'lost',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
  ]
});
