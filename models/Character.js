var mongoose = require("mongoose");

var CharacterSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: 'character.validation.error.firstname.required'
  },
  last_name: {
    type: String,
    required: 'character.validation.error.lastname.required'
  },
  nick_name: {
    type: String
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

var Character = mongoose.model('Character', CharacterSchema);

// include and attach the JSON plugin
var toJson = require('../mongoose/plugins/json');

CharacterSchema.plugin(toJson.plugin);

module.exports = Character;
