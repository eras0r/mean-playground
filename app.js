var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var debug = require('debug')('helloWorld:app');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// gzip/deflate outgoing responses
var compression = require('compression');

var _ = require('lodash');

// own scripts
var db = require('./mongoose');
var routes = require('./routes/index');

var roles = require('./routes/roles');
var users = require('./routes/users');
var usersRoles = require('./routes/user-roles');
var characters = require('./routes/characters');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// json pretty print
app.set('json spaces', 2);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// enable gzip compression
app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// gzip
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// custom global handler for all requests
app.use(function (req, res, next) {
    // set some HTTP header
    debug('setting powered by header');
    res.set('X-Powered-By', 'Hello World REST API');

    next();
});

app.use('/', routes);
app.use('/roles', roles);
app.use('/users', users);
app.use('/users', usersRoles);
app.use('/characters', characters);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log('404 error handler');
    var err = new Error('Not Found');
    err.status = 404;
    next(err); // any argument in next() other than 'route' will be treated as error

    // this would just send a 404 response without any further processing
    //res.status(404).end();
});

// error handlers

// generic mongoose error handler
app.use(function (err, req, res, next) {
    // handle mongoose validation errors
    if (err.name === 'ValidationError') {
        res.status(422);
        //res.json(err);
        res.json(convertValidationError(err));
    }
    else {
        // call the next error handler for all other errors
        next(err);
    }
});

/**
 * converts mongoose's validation errors in more user friendly errors (without stacktrace etc.) to be returned by the REST API.
 * @param validationError mongoose's validation error
 * @returns {{}} the converted validation error
 */
function convertValidationError(validationError) {
    var convertedErr = {};

    convertedErr.message = validationError.message;
    convertedErr.errors = {};

    _.forOwn(validationError.errors, function (val, key) {
        convertedErr.errors[key] = _.pick(val, ['kind', 'path', 'message']);
    });

    return convertedErr;
}

// development error handler (notice the 4 arguments)
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log('error', err);
        console.log('dev error handler, err.name = ', err.name);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler (notice the 4 arguments)
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log('non-dev error handler, err.name = ', err.name);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
