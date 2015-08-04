var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

var Role = mongoose.model('Role', RoleSchema);

module.exports = Role;