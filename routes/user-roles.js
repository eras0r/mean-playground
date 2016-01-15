var express = require('express');
var router = express.Router();

var _ = require('lodash');

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

      console.log('current user roles: ' + user.roles);
      console.log('new roleId: ' + newRoleId);

      // find role
      Role.findById(newRoleId).exec()
        .then(function (role) {
          var userAlreadyHasRole = false;
          _.forEach(user.roles, function (persistentRole) {

            // TODO find a better way the the toString comparison below
            if (persistentRole.toString() === role._id.toString()) {
              console.log('Role ignored, because the user already has the given role: ', role);
              userAlreadyHasRole = true;
              // break the forEach loop
              return false;
            }
          });

          if (!userAlreadyHasRole) {
            // add the role to the user's role
            user.roles.push(role);

            // save the user
            console.log('saving user now...');
            user.save()
              .then(function (savedUser) {
                res.json(savedUser.roles);
              });
            console.log('user has been updated successfully with roles');
          }
          else {
            // TODO maybe use other error code
            res.status(400);
            res.end();
          }
        })
        .catch(function (err) {
          console.log('Skipping role with id=' + newRoleId + ', because it was not found in the roles collection!');
          console.log(err);
        });
    })
    .catch(function (err) {
      if (err) {
        next(err);
      }
    });

});

module.exports = router;
