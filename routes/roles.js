var express = require('express');
var router = express.Router();

//var mongoose = require("mongoose");
var Role = require('../models/role');
var User = require('../models/user');

/* GET /roles */
router.get('/', function (req, res, next) {
  // deselect a property (referenced collection 'users' in this case)
  // Role.find({}, '-users').exec(function (err, roles) {

  // populate collection 'users'
  Role.find({}).populate('users').exec(function (err, roles) {
    if (err) {
      return next(err);
    }
    res.json(roles);
  });
});

/* POST /roles */
router.post('/', function (req, res, next) {
  Role.create(req.body, function (err, role) {
    if (err) {
      return next(err);
    }

    res.status(201);
    res.location('/roles/' + role._id);
    res.json(role);
  });
});

/* GET /roles/:id/users (get the users for a given role */
router.get('/:id/users', function (req, res, next) {
  // do not select the 'roles' collection from each user
//    User.find({roles: req.params.id}, '-roles').exec(function (err, roles) {

  // populate the 'roles' collection
  // User.find({roles: req.params.id}).populate({path: 'roles'}).exec(function (err, roles) {

  // exclude the 'users' property from a populated 'roles' collection
  User.find({roles: req.params.id}).populate({path: 'roles', select: '-users'}).exec(function (err, roles) {
    if (err) {
      return next(err);
    }
    res.json(roles);
  });
});

/* GET /roles/:id */
router.get('/:id', function (req, res, next) {
  // TODO exclude roles from selection
  //Role.findById(req.params.id).populate({path: 'users', select: '-roles'}).exec(function (err, role) {
  Role.findById(req.params.id).populate({path: 'users'}).exec(function (err, role) {
    if (err) {
      return next(err);
    }
    res.json(role);
  });
});

/* GET /roles/:id/users */
router.get('/:id/users', function (req, res, next) {
  Role.findById(req.params.id, function (err, role) {
    if (err) {
      return next(err);
    }
    res.json(role);
  });
});

/* PUT /roles/:id */
router.put('/:id', function (req, res, next) {
  Role.findById(req.params.id, function (err, role) {
    if (err) {
      next(err);
    }

    // explicitly update the desired fields
    role.rolename = req.body.rolename;

    // update the timestamp
    // TODO handle this somewhere globally for all schemas, maybe use https://github.com/sabymike/mongoose-schema-lastmodifiedfields
    role.updated_at = Date.now();

    // save the role
    role.save(function (err, saved) {
      if (err) {
        next(err);
      }

      res.json(saved);
    });

  });

});

/* DELETE /roles/:id */
router.delete('/:id', function (req, res, next) {
  Role.findByIdAndRemove(req.params.id, req.body, function (err, role) {
    if (err) {
      return next(err);
    }
    res.status(204);
    res.end();
  });
});

module.exports = router;
