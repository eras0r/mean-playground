var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'user.validation.error.username.required'
    },
    // TODO exclude from json
    algorithm: {
        type: String,
        required: 'user.validation.error.algorithm.required',
        hide: true
    },
    // TODO exclude from json
    iterations: {
        type: Number,
        required: 'user.validation.error.iterations.required'
    },
    // TODO exclude from json
    salt: {
        type: String,
        required: 'user.validation.error.salt.required'
    },
    // TODO exclude from json
    password: {
        type: String,
        required: 'user.validation.error.password.required'
    },
    roles: [{
        //type: Schema.ObjectId,
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

module.exports = User;