/**
 * Transformer function that converts the given object to JSON.
 * This function can be reused by schemas in order to be extended.
 * @param ret the object to be converted into JSON
 * @returns {*} the object converted into JSON
 */
module.exports.toJson = function toJson(ret) {
  // rename _id to id
  ret.id = ret._id;

  // extract creation timestamp from ObjectId
  ret.created_at = ret._id.getTimestamp();

  // remove _id and __v
  delete ret._id;
  delete ret.__v;

  return ret;
};

/**
 * The plugin to transform documents into JSON.
 * @param schema the mongoose schema to be operated on.
 */
module.exports.plugin = function (schema) {
  schema.options.toJSON = {
    transform: function (doc, ret, options) {
      return module.exports.toJson(ret);
    }
  };

};
