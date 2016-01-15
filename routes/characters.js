var express = require('express');
var router = express.Router();

//var mongoose = require('mongoose');
var Character = require('../models/character');

/* GET /characters listing. */
router.get('/', function (req, res, next) {
  Character.find(function (err, characters) {
    if (err) {
      return next(err);
    }
    res.json(characters);
  });
});

/* POST /characters */
router.post('/', function (req, res, next) {
  Character.create(req.body, function (err, character) {
    if (err) {
      return next(err);
    }

    res.status(201);
    res.location('/characters/' + character._id);
    res.json(character);
  });
});

/* GET /characters/:id */
router.get('/:id', function (req, res, next) {
  Character.findById(req.params.id, function (err, character) {
    if (err) {
      return next(err);
    }
    res.json(character);
  });
});

/* PUT /characters/:id */
router.put('/:id', function (req, res, next) {
  Character.findById(req.params.id, function (err, character) {
    if (err) {
      next(err);
    }

    // explicitly update the desired fields
    character.first_name = req.body.first_name;
    character.last_name = req.body.last_name;
    character.nick_name = req.body.nick_name;

    // update the timestamp
    // TODO handle this somewhere globally for all schemas, maybe use https://github.com/sabymike/mongoose-schema-lastmodifiedfields
    character.updated_at = Date.now();

    // save the characater
    character.save(function (err, saved) {
      if (err) {
        next(err);
      }

      res.json(saved);
    });

  });

  //Character.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, character) {
  //    if (err) {
  //        return next(err);
  //    }
  //    console.log(character);
  //    res.json(character);
  //});
});

/* DELETE /characters/:id */
router.delete('/:id', function (req, res, next) {
  Character.findByIdAndRemove(req.params.id, req.body, function (err, character) {
    if (err) {
      return next(err);
    }
    res.status(204);
    res.end();
  });
});

module.exports = router;
