var express = require('express');
var router = express.Router();

var _ = require('lodash');

var User = require('../models/User');
var Role = require('../models/Role');

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
    User.create(req.body, function (err, user) {
        if (err) {
            return next(err);
        }

        _.forEach(req.body.roles, function (roleId) {
            Role.findById(roleId, function (err, role) {
                console.log('role = ', role);
                if (err) {
                    return next(err);
                }

                // add the newly created user to the role.users list for bidirectional linking
                role.users.push(user);
                role.save();
            });
        });

        res.status(201);
        res.location('/users/' + user._id);
        res.json(user);
    });

});

/* GET /users/:id */
router.get('/:id', function (req, res, next) {
    // TODO exclude roles from selection
    //User.findById(req.params.id).populate({path: 'roles'}).exec(function (err, role) {
    User.findById(req.params.id, function (err, role) {
        if (err) {
            return next(err);
        }
        res.json(role);
    });
});

/* POST /users/:id/roles */
/**
 * Adds a new role to the given user.
 */
router.post('/:id/roles', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            next(err);
        }

        console.log('current user roles: ' + user.roles);
        console.log('request body: ' + req.body);
        console.log('new roles: ' + req.body.roles);

        // contains a promise for each role to be retrieved
        var rolePromises = [];


        // iterate over the roles to be added
        _.forEach(req.body.roles, function (roleId) {
            console.log('role ' + roleId + ' will be added');
            console.log('checking if role ' + roleId + ' exists...');

            var rolePromise = Role.findById(roleId).exec();
            console.log('rolePromise: ', rolePromise);
            rolePromises.push(rolePromise);

            // TODO avoid adding roles which are already present

            // check if the role exists
            rolePromise
                .then(function (role) {
                    console.log('found role = ', role);

                    // add the newly created user to the role.users list for bidirectional linking
                    user.roles.push(role);
                });
                // TODO define alternative promise provider for mongoose, see http://eddywashere.com/blog/switching-out-callbacks-with-promises-in-mongoose/
                //.catch(function (err) {
                //    console.log('error finding role with id ' + roleId + ' role will not be added!');
                //    //console.log(err);
                //});
        });

        // wait for all role calls to be completed
        Promise.all(rolePromises).then(function () {
            console.log('all roles loaded');
            console.log('saving user now...');
            user.save();
            console.log('user has been updated successfully with roles');
        });

        res.json();
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