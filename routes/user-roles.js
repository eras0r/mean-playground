var express = require('express');
var router = express.Router();
var _ = require('lodash');

var log = require('../lib/logger');
var errorHandling = require('../mongoose/plugins/error-handling');

var User = require('../models/user');
var Role = require('../models/role');

/**
 * List a user's roles.
 * GET /users/:id/roles
 */
router.get('/:id/roles', function (req, res, next) {
  User.findById(req.params.id)
});

/* POST /users/:id/roles */
/**
 * Adds a new role to the given user.
 */
router.post('/:id/roles', function (req, res, next) {
  User.findById(req.params.id)
    .then(function (user) {
      var newRoleId = req.body.roleId;

      log.debug('current user roles: ' + user.roles);
      log.debug('new roleId: ' + newRoleId);

      // find role
      Role.findById(newRoleId).exec()
        .then(function (role) {
          var userAlreadyHasRole = false;
          _.forEach(user.roles, function (persistentRole) {

            // TODO find a better way the the toString comparison below
            if (persistentRole.toString() === role._id.toString()) {
              log.warn('Role ignored, because the user already has the given role: ', role);
              userAlreadyHasRole = true;
              // break the forEach loop
              return false;
            }
          });

          if (!userAlreadyHasRole) {
            // add the role to the user's role
            user.roles.push(role);

            // save the user
            log.info('saving user now...');
            user.save()
              .then(function (savedUser) {
                log.info('role %s has been added to user %s', role, user);
                res.json(savedUser.roles);
              });
          }
          else {
            // TODO maybe use other error code
            res.status(400);
            res.end();
          }
        })
        .catch(function (err) {
          errorHandling.handleNotFoundError(err, res, next);
        });
    })
    .catch(function (err) {
      errorHandling.handleNotFoundError(err, res, next);
    });

});

module.exports = router;
