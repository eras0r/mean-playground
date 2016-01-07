var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'user.validation.error.username.required'
    },
    algorithm: {
        type: String,
        required: 'user.validation.error.algorithm.required'
    },
    iterations: {
        type: Number,
        required: 'user.validation.error.iterations.required'
    },
    salt: {
        type: String,
        required: 'user.validation.error.salt.required'
    },
    password: {
        type: String,
        required: 'user.validation.error.password.required'
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }],
    updated_at: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('User', UserSchema);

// include and attach the JSON plugin
var toJson = require('../mongoose/plugins/json');

/**
 * toJSON implementation
 */
UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        // first call the global toJson plugin
        ret = toJson.toJson(ret);

        // additionally hide security information
        delete ret.algorithm;
        delete ret.iterations;
        delete ret.salt;
        delete ret.password;

        return ret;
    }
};

var User = mongoose.model('User', UserSchema);

module.exports = User;