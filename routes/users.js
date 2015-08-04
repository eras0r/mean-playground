var express = require('express');
var router = express.Router();

var _ = require('lodash');
//var mongoose = require('mongoose');
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