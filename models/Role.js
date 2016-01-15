var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var RoleSchema = new mongoose.Schema({
  rolename: {
    type: String,
    required: 'role.validation.error.rolename.required'
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// include and attach the JSON plugin
var toJson = require('../mongoose/plugins/json');
RoleSchema.plugin(toJson.plugin);

// register error handling plugin
var errorHandling = require('../mongoose/plugins/error-handling');
RoleSchema.plugin(errorHandling.plugin);

var Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
