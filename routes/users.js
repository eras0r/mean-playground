var express = require('express');
var router = express.Router();

var _ = require('lodash');

var log = require('../lib/logger');

var User = require('../models/user');
var Role = require('../models/role');

var errorHandling = require('../mongoose/plugins/error-handling');

/* GET /users listing. */
router.get('/', function (req, res, next) {
  // exclude roles.users from selection
  User.find().populate({path: 'roles', select: '-users'}).exec(function (err, users) {
    //User.find({}).exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

/* POST /users (bi directional linking between users and roles) */
router.post('/', function (req, res, next) {

  var user = req.body;

  // load all roles and check if they exist
  // non existing roles will not be added to the user's roles
  var rolePromises = [];
  _.forEach(user.roles, function (roleId) {

    var rolePromise = Role.findById(roleId).exec();
    rolePromises.push(rolePromise);

    rolePromise
      .then(function (role) {
        log.debug('role with id "%S" has been found and will be added to the users roles', roleId);
      })
      .catch(function (err) {
        log.warn('role with id "%s" was not found and was not added to the users roles.', roleId);

        log.debug('user.roles before removal: ', user.roles);
        // remove the non exsiting role from the user's roles
        _.remove(user.roles, function (role) {
          return role.toString() === roleId.toString();
        });
        log.debug('user.roles after removal: ', user.roles);
      });
  });

  // wait for multiple promises and ignore rejected promises.
  // see http://stackoverflow.com/a/30310336
  Promise.all(rolePromises.map(function (el) {
      return el.reflect();
    }))
    // TODO this seems not to work in node
    //.filter(function (p) {
    //    return p.isFulfilled();
    //})
    .then(function (results) {
      log.info('Saving user: %j', user);
      User.create(user)
        .then(function (createdUser) {
          // iterate over promises
          _.forEach(results, function (promise) {
            var fulFilled = promise.isFulfilled();
            log.debug('role promise fulfilled: %s', fulFilled);
            if (fulFilled) {
              var role = promise.value();
              log.debug('role : %s', role);
              role.users.push(createdUser);
              role.save()
                .then(function () {
                  log.info('User %s saved successfully', user);
                });
            }
          });

          res.status(201);
          res.location('/users/' + createdUser._id);
          res.json(createdUser);
        })
        .catch(function (err) {
          log.error('Error creating new user. User=%j, error=%j', user, err);
          return next(err);
        });

    });

});

/* GET /users/:id */
router.get('/:id', function (req, res, next) {
  // TODO exclude roles from selection
  //User.findById(req.params.id).populate({path: 'roles'}).exec(function (err, role) {
  User.findById(req.params.id).populate({path: 'roles', select: '-users'}).exec()
    .then(function (user) {
      res.json(user);
    })
    .catch(function (err) {
      errorHandling.handleNotFoundError(err, res, next);
    });
});

/* DELETE /users/:id */
router.delete('/:id', function (req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
    if (err) {
      return next(err);
    }
    res.status(204);
    res.end();
  });
});

// TODO remove
/* DELETE /users/ */
router.delete('/', function (req, res, next) {
  User.find({}).remove().exec(function (err) {
    if (err) {
      return next(err);
    }
    res.status(204);
    res.end();
  });
});

module.exports = router;
